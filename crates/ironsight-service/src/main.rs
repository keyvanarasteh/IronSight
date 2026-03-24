//! IronSight — Professional SecOps & Reverse Engineering Toolkit
//!
//! Full pipeline: Config → Privilege → Snapshot → Security → Network → Memory → Heuristic → Report
//!
//! Usage:
//!   ironsight                        Full system scan (auto-discovers config)
//!   ironsight --pid <PID>            Scan specific process
//!   ironsight --top <N>              Show top N threats (default: 10)
//!   ironsight --config <PATH>        Use specific config file
//!   ironsight --generate-config      Print default TOML config
//!   ironsight --check-privileges     Show privilege status and exit
//!   ironsight --watchdog-sentinel    Run as watchdog (internal)
//!   ironsight --daemon               Run in continuous scanning mode
//!   ironsight --json                 Output results as JSON

mod config;
mod privilege;
mod watchdog;

use std::path::{Path, PathBuf};
use std::time::{Duration, Instant};
use std::sync::Arc;

use anyhow::Result;
use clap::Parser;
use sysinfo::{ProcessRefreshKind, System, UpdateKind};
use tokio::signal;
use tracing::{info, warn, error};


use ironsight_core::snapshot::{build_snapshot, ProcessSnapshot};
use ironsight_core::ProcessInfo;
use ironsight_heuristic::signals;
use ironsight_heuristic::{DecayEngine, HeuristicEngine, Signal, ThreatLevel};
use ironsight_report::incident;
use ironsight_response::{ActionType, ExclusionList, ResponseHandler};

#[derive(Parser)]
#[command(name = "ironsight", version, about = "Endpoint Detection & Response")]
struct Cli {
    #[arg(long)]
    config: Option<PathBuf>,

    #[arg(long)]
    pid: Option<u32>,

    #[arg(long, default_value = "50")]
    top: usize,

    #[arg(long)]
    json: bool,

    #[arg(long)]
    daemon: bool,

    #[arg(long)]
    watchdog_sentinel: bool,

    #[arg(long)]
    watch_pid: Option<u32>,

    #[arg(long)]
    watch_interval: Option<u64>,

    #[arg(long)]
    check_privileges: bool,

    #[arg(long)]
    generate_config: bool,
}

struct NetworkAuditCache;
impl NetworkAuditCache {
    fn scan_all() -> Result<Self> {
        Ok(Self)
    }
    fn get_for_pid(&self, pid: u32) -> ironsight_network::audit::NetworkAudit {
        ironsight_network::audit::NetworkAudit::scan_pid(pid)
    }
}

pub struct ScanResult {
    pub assessment: ironsight_heuristic::ThreatAssessment,
    pub report: incident::IncidentReport,
}

pub struct ScanRunResult {
    pub threat_count: usize,
    pub results: Vec<ScanResult>,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    // ── Watchdog sentinel mode (early exit) ──
    if cli.watchdog_sentinel {
        tracing_subscriber::fmt()
            .with_env_filter("ironsight=info")
            .init();
        if let Some(pid) = cli.watch_pid {
            let interval = cli.watch_interval.unwrap_or(10);
            watchdog::run_sentinel_loop(pid, Duration::from_secs(interval), 5);
        }
        return Ok(());
    }

    // ── Generate config (early exit) ──
    if cli.generate_config {
        print!("{}", config::Config::default_toml());
        return Ok(());
    }

    // ── Load configuration ──
    let cfg = Arc::new(if let Some(path) = cli.config.as_ref() {
        config::Config::from_file(path)?
    } else {
        config::Config::discover()
    });

    // ── Initialize logging from config ──
    let env_filter = tracing_subscriber::EnvFilter::from_default_env()
        .add_directive(
            format!("ironsight={}", cfg.general.log_level)
                .parse()
                .unwrap_or_else(|_| "ironsight=info".parse().unwrap()),
        );
    tracing_subscriber::fmt().with_env_filter(env_filter).init();

    // ── Banner ──
    if !cli.json {
        println!();
        println!("╔══════════════════════════════════════════════════════════════╗");
        println!("║          🔬 IRONSIGHT — SecOps Forensics Toolkit           ║");
        println!("║          v0.1.0 · by Keyvan Arasteh                        ║");
        println!("╚══════════════════════════════════════════════════════════════╝");
        println!();
    }

    // ── Privilege check ──
    let priv_report = privilege::PrivilegeReport::check();
    if !cli.json {
        priv_report.display();
    }

    if cli.check_privileges {
        return Ok(());
    }

    if priv_report.overall_level == privilege::PrivilegeLevel::Limited {
        warn!("Running with limited privileges — some features may be degraded");
    }

    // ── Watchdog spawn ──
    if cfg.watchdog.enabled && !cli.daemon {
        let my_pid = std::process::id();
        match watchdog::spawn_sentinel(
            my_pid,
            Duration::from_secs(cfg.watchdog.interval_secs),
        ) {
            Ok(sentinel_pid) => {
                info!("🐕 Watchdog sentinel spawned as PID {sentinel_pid}");
            }
            Err(e) => {
                warn!("Failed to spawn watchdog: {e}");
            }
        }
    }

    if cli.daemon {
        run_daemon(cfg).await?;
    } else {
        let mut decay = DecayEngine::new();
        let results = run_scan(Arc::clone(&cfg), &mut decay, cli.pid).await?;
        display_results(results, cli.top, cli.json, &cfg)?;
    }

    Ok(())
}

async fn run_daemon(config: Arc<config::Config>) -> Result<()> {
    let interval = Duration::from_secs(config.general.interval_secs);
    let mut decay = DecayEngine::new();
    
    info!("Daemon mode started — interval: {}s", config.general.interval_secs);
    
    let (shutdown_tx, mut shutdown_rx) = tokio::sync::watch::channel(false);
    
    tokio::spawn(async move {
        let mut sigterm = signal::unix::signal(signal::unix::SignalKind::terminate()).unwrap();
        tokio::select! {
            _ = signal::ctrl_c() => {},
            _ = sigterm.recv() => {},
        }
        info!("Shutdown signal received");
        let _ = shutdown_tx.send(true);
    });
    
    loop {
        let scan_start = Instant::now();
        let results = run_scan(Arc::clone(&config), &mut decay, None).await?;
        let scan_duration = scan_start.elapsed();
        
        info!("Scan completed in {:?} — {} threats found", 
              scan_duration, results.threat_count);
        
        tokio::select! {
            _ = tokio::time::sleep(interval) => {},
            _ = shutdown_rx.changed() => {
                if *shutdown_rx.borrow() {
                    info!("SIGTERM received, shutting down gracefully...");
                    break;
                }
            }
        }
    }
    Ok(())
}

async fn run_scan(
    cfg: Arc<config::Config>,
    decay: &mut DecayEngine,
    target_pid: Option<u32>,
) -> Result<ScanRunResult> {
    info!("📸 Stage 1: Capturing process snapshot...");
    let mut sys = System::new();
    sys.refresh_processes_specifics(
        sysinfo::ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::nothing()
            .with_cpu()
            .with_memory()
            .with_exe(UpdateKind::OnlyIfNotSet)
            .with_cmd(UpdateKind::OnlyIfNotSet)
            .with_cwd(UpdateKind::OnlyIfNotSet)
            .with_user(UpdateKind::OnlyIfNotSet),
    );
    let snapshot = build_snapshot(&sys);
    
    let processes: Vec<ProcessInfo> = if let Some(pid) = target_pid {
        match snapshot.find_by_pid(pid) {
            Some(p) => vec![p.clone()],
            None => {
                anyhow::bail!("❌ PID {pid} not found");
            }
        }
    } else {
        snapshot.processes.values().cloned().collect()
    };

    let engine = Arc::new(HeuristicEngine::new());
    let net_cache = Arc::new(NetworkAuditCache::scan_all()?);
    let mut ex_list = ExclusionList::default();
    for n in &cfg.exclusions.names { ex_list.add_name(n); }
    for p in &cfg.exclusions.paths { ex_list.path_prefixes.push(p.to_string()); }
    for pid in &cfg.exclusions.pids { ex_list.add_pid(*pid); }
    let exclusion_list = Arc::new(ex_list);

    let handles = processes.into_iter().map(|proc| {
        let engine = Arc::clone(&engine);
        let cfg = Arc::clone(&cfg);
        let exclusion_list = Arc::clone(&exclusion_list);
        let net_cache = Arc::clone(&net_cache);
        tokio::spawn(async move {
            scan_process(&proc, &cfg, &engine, &exclusion_list, &net_cache).await
        })
    });

    let scanned: Vec<ScanResult> = futures::future::join_all(handles)
        .await
        .into_iter()
        .filter_map(|r: Result<Option<ScanResult>, _>| r.ok())
        .flatten()
        .collect();

    // ── Decay engine Integration & Auto Response ──
    let mut active_results = Vec::new();
    let mut threat_count = 0;
    
    for mut result in scanned {
        let raw_score = result.assessment.score;
        decay.record(result.assessment.pid, raw_score);
        let effective_score = decay.get_score(result.assessment.pid).map(|d| d.decayed_score).unwrap_or(raw_score);
        result.assessment.score = effective_score;
        
        if result.assessment.level >= ThreatLevel::Medium {
            threat_count += 1;
        }

        if cfg.thresholds.auto_response && effective_score >= 80.0 {
            let handler = ResponseHandler::new(&cfg.general.report_dir)
                .with_exclusions(exclusion_list.as_ref().clone());
            
            let exe_path = result.report.process.exe_path.clone();
            let log = handler.respond(
                result.assessment.pid, 
                &result.assessment.name, 
                exe_path.as_deref(),
                result.assessment.score,
                ActionType::SuspendDumpKill
            );
            info!("Auto-response executed: {:?}", log);
            let mapped_actions: Vec<incident::ActionInfo> = log.actions_taken.into_iter().map(|a| incident::ActionInfo {
                action_type: format!("{:?}", a.action),
                success: a.success,
                message: a.message,
                timestamp: a.timestamp,
            }).collect();
            result.report.actions.extend(mapped_actions);
        }
        
        active_results.push(result);
    }

    Ok(ScanRunResult {
        threat_count,
        results: active_results,
    })
}

async fn scan_process(
    proc_info: &ProcessInfo,
    cfg: &config::Config,
    engine: &HeuristicEngine,
    exclusion_list: &ExclusionList,
    net_cache: &NetworkAuditCache,
) -> Option<ScanResult> {
    let exe_str = proc_info.exe.as_ref().map(|p| p.to_string_lossy());
    if exclusion_list.is_excluded(&proc_info.name, proc_info.pid, exe_str.as_deref().map(|s| s.as_ref())) {
        return None;
    }

    let mut sigs: Vec<Signal> = Vec::new();
    let mut report = ironsight_report::IncidentReport::new();

    report.process = incident::ProcessInfo {
        pid: proc_info.pid,
        name: proc_info.name.clone(),
        exe_path: proc_info
            .exe
            .as_ref()
            .map(|p| p.to_string_lossy().into_owned()),
        cmdline: if proc_info.cmd.is_empty() {
            None
        } else {
            Some(proc_info.cmd.join(" "))
        },
        parent_pid: proc_info.parent_pid,
        user: proc_info.uid.map(|u| format!("uid:{u}")),
        cpu_percent: proc_info.cpu_percent,
        memory_bytes: proc_info.memory_bytes,
        start_time: None,
    };

    // ── Security Analysis ──
    if cfg.scan.security {
        if let Some(ref exe) = proc_info.exe {
            let path = Path::new(exe);
            if let Ok(result) = ironsight_security::entropy::compute_entropy(path) {
                report.security.entropy = Some(result.entropy);
                report.security.entropy_risk = Some(format!("{:?}", result.risk_level));
                if result.entropy > cfg.thresholds.entropy_alert {
                    sigs.push(signals::high_entropy(result.entropy));
                }
            }
            if let Ok(hash_result) = ironsight_security::hash::compute_sha256(path) {
                report.security.sha256 = Some(hash_result.sha256);
            }
            let sig_result = ironsight_security::signature::verify_signature(path);
            report.security.is_signed = sig_result.is_signed;
            if sig_result.is_signed == Some(false) {
                sigs.push(signals::unsigned_binary());
            }
            let path_result = ironsight_security::path_analysis::analyze_path(Some(path));
            report.security.suspicious_path = path_result.is_suspicious;
            if let Some(ref reason) = path_result.reason {
                report.security.flags.push(reason.clone());
            }
            if path_result.is_suspicious {
                let reason = path_result.reason.as_deref().unwrap_or("unknown");
                sigs.push(signals::suspicious_path(&path.to_string_lossy(), reason));
            }
        } else {
            sigs.push(signals::fileless_process());
        }
    }

    if proc_info.cpu_percent > cfg.thresholds.cpu_spike {
        sigs.push(signals::cpu_spike(proc_info.cpu_percent));
    }

    // ── Network Analysis ──
    if cfg.scan.network {
        let net_audit = net_cache.get_for_pid(proc_info.pid);
        report.network = incident::NetworkInfo {
            total_sockets: net_audit.total_sockets,
            listeners: net_audit.listeners.len(),
            external_connections: net_audit.external_connections.len(),
            suspicious_connections: net_audit.suspicious_connections.len(),
            suspicious_ports: net_audit
                .suspicious_connections
                .iter()
                .map(|s| format!("{} ({})", s.socket.remote_port, s.intel.service))
                .collect(),
        };

        for conn in &net_audit.suspicious_connections {
            sigs.push(signals::suspicious_port(
                conn.socket.remote_port,
                &conn.intel.service,
            ));
        }
        if net_audit.external_connections.len() > 5 {
            sigs.push(signals::external_connections(
                net_audit.external_connections.len(),
            ));
        }
    }

    // ── Memory Analysis ──
    if cfg.scan.memory {
        if let Ok(regions) = ironsight_memory::maps::read_maps(proc_info.pid) {
            let summary = ironsight_memory::maps::summarize(proc_info.pid, &regions);
            report.memory = incident::MemoryInfo {
                total_regions: summary.total_regions,
                wx_violations: summary.writable_executable_regions,
                anonymous_executable: summary.anonymous_executable_regions,
                pattern_matches: 0,
                flags: summary.flags.clone(),
            };
            if summary.writable_executable_regions > 0 {
                sigs.push(signals::wx_violation(
                    summary.writable_executable_regions,
                ));
            }
            if summary.anonymous_executable_regions > 0 {
                sigs.push(signals::anonymous_executable(
                    summary.anonymous_executable_regions,
                ));
            }
            
            let pattern_result = ironsight_memory::scanner::scan_process(proc_info.pid);
            for m in &pattern_result.matches {
                sigs.push(Signal::new(
                    &format!("memory_pattern at 0x{:x}", m.region_start + m.offset as u64),
                    ironsight_heuristic::SignalCategory::MemoryAnomaly,
                    20.0,
                    &m.context,
                ));
            }
        }
    }

    let assessment = engine.assess(proc_info.pid, &proc_info.name, sigs);
    report.threat = incident::ThreatInfo {
        score: assessment.score,
        level: format!("{:?}", assessment.level),
        signals: assessment
            .signals
            .iter()
            .map(|s| incident::SignalInfo {
                name: s.name.clone(),
                category: format!("{:?}", s.category),
                weight: s.weight,
                description: s.description.clone(),
                evidence: s.evidence.clone(),
            })
            .collect(),
        recommended_action: format!("{:?}", assessment.recommended_action),
    };

    Some(ScanResult { assessment, report })
}

fn display_results(run_res: ScanRunResult, top_n: usize, json_mode: bool, cfg: &config::Config) -> Result<()> {
    let mut assessments = run_res.results;
    assessments.sort_by(|a, b| {
        b.assessment.score
            .partial_cmp(&a.assessment.score)
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    if json_mode {
        let reports: Vec<_> = assessments.iter().take(top_n).map(|r| &r.report).collect();
        println!("{}", serde_json::to_string_pretty(&reports)?);
        return Ok(());
    }

    let critical = assessments
        .iter()
        .filter(|r| r.assessment.level == ThreatLevel::Critical)
        .count();
    let high = assessments
        .iter()
        .filter(|r| r.assessment.level == ThreatLevel::High)
        .count();
    let medium = assessments
        .iter()
        .filter(|r| r.assessment.level == ThreatLevel::Medium)
        .count();

    println!();
    println!("── Scan Summary ───────────────────────────────────────────────");
    println!("  Total Processes: {}", assessments.len());
    println!("  🚨 Critical:     {critical}");
    println!("  🔴 High:         {high}");
    println!("  🟠 Medium:       {medium}");
    println!();

    println!("── Top {top_n} Threats ─────────────────────────────────────────────");
    println!("  {:<8} {:<20} {:>6} {:<10} {}", "PID", "NAME", "SCORE", "LEVEL", "SIGNALS");
    println!("  {}", "─".repeat(70));

    for res in assessments.iter().take(top_n) {
        if res.assessment.score < 1.0 { continue; }
        let signal_names: Vec<&str> = res.assessment.signals.iter().map(|s| s.name.as_str()).collect();
        println!(
            "  {:<8} {:<20} {:>5.0} {} {:<10} {}",
            res.assessment.pid,
            truncate(&res.assessment.name, 20),
            res.assessment.score,
            res.assessment.level.emoji(),
            format!("{:?}", res.assessment.level),
            truncate(&signal_names.join(", "), 40)
        );
    }

    let serious: Vec<&ScanResult> = assessments
        .iter()
        .filter(|r| r.assessment.level >= ThreatLevel::High)
        .collect();

    if !serious.is_empty() {
        println!();
        println!("── Detailed Reports (High/Critical) ───────────────────────────\n");
        for res in serious {
            println!("{}", ironsight_report::to_text(&res.report));
        }
    }

    let report_dir = &cfg.general.report_dir;
    let _ = std::fs::create_dir_all(report_dir);
    let mut saved = 0;
    for res in &assessments {
        if res.assessment.score >= cfg.thresholds.export_min_score {
            let path = format!("{report_dir}/incident_{}.json", res.report.process.pid);
            if ironsight_report::save_json(&res.report, &path).is_ok() {
                saved += 1;
            }
        }
    }
    if saved > 0 {
        println!("  💾 Saved {saved} incident reports to {report_dir}/");
    }

    println!();
    println!("Done. IronSight scan complete.");
    Ok(())
}

fn truncate(s: &str, max: usize) -> String {
    if s.chars().count() <= max {
        return s.to_string();
    }
    let truncated: String = s.chars().take(max - 1).collect();
    format!("{}…", truncated)
}
