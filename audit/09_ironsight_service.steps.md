# ironsight-service — Implementation Steps

> Audit: [09_ironsight_service.md](09_ironsight_service.md) · 16 Issues (4 Critical, 6 High, 6 Medium)

---

## STEP 1: Async/Tokio Migration _(Critical #1)_

**Dosya:** `crates/ironsight-service/src/main.rs`

### Ne Yapılacak
1. `fn main()` → `#[tokio::main] async fn main()`
2. Process taramayı `tokio::spawn` ile paralelle
3. DNS lookup'ları async yap

```rust
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Config, privilege check...
    
    let snapshot = ProcessSnapshot::new(&system);
    let processes = snapshot.processes();
    
    // Paralel tarama
    let results: Vec<ScanResult> = futures::future::join_all(
        processes.iter().map(|proc| {
            let proc = proc.clone();
            tokio::spawn(async move {
                scan_process(&proc).await
            })
        })
    ).await
    .into_iter()
    .filter_map(|r| r.ok())
    .collect();
    
    // Sonuçları işle...
}
```

### Test
```rust
#[tokio::test]
async fn test_parallel_scan_completes() {
    let results = scan_top_n(10).await;
    assert!(results.len() <= 10);
}
```

---

## STEP 2: Network Scan Caching _(Critical #2)_

**Dosya:** `crates/ironsight-service/src/main.rs`

### Ne Yapılacak
```rust
// ÖNCE (her process için tam rescan):
let net_audit = NetworkAudit::scan_pid(proc_info.pid);

// SONRA (tek scan, filtrele):
let net_cache = NetworkAuditCache::scan_all()?;

for proc in &processes {
    let connections = net_cache.get_for_pid(proc.pid);
    // ... heuristic sinyalleri oluştur
}
```

---

## STEP 3: auto_response Entegrasyonu _(Critical #3)_

**Dosya:** `crates/ironsight-service/src/main.rs`

```rust
// Config'den auto_response kontrolü
if config.thresholds.auto_response && assessment.level >= ThreatLevel::Critical {
    let exclusion_list = ExclusionList::from(&config.exclusions);
    let handler = ResponseHandler::new()
        .with_exclusions(exclusion_list)
        .with_dump_dir(&config.general.dump_dir);
    
    match handler.respond(proc.pid, &proc.name, &assessment) {
        Ok(log) => {
            info!("Auto-response executed: {:?}", log);
            report.actions.push(log);
        },
        Err(e) => error!("Auto-response failed: {}", e),
    }
}
```

---

## STEP 4: Daemon / Continuous Mode _(High #5)_

**Dosya:** `crates/ironsight-service/src/main.rs`

```rust
async fn run_daemon(config: &Config) -> Result<()> {
    let interval = Duration::from_secs(config.scan.interval_secs);
    let mut decay = DecayEngine::new(Duration::from_secs(3600));
    
    info!("Daemon mode started — interval: {}s", config.scan.interval_secs);
    
    loop {
        let scan_start = Instant::now();
        let results = run_scan(&config, &mut decay).await?;
        let scan_duration = scan_start.elapsed();
        
        info!("Scan completed in {:?} — {} threats found", 
              scan_duration, results.threat_count);
        
        tokio::select! {
            _ = tokio::time::sleep(interval) => {},
            _ = tokio::signal::ctrl_c() => {
                info!("SIGTERM received, shutting down...");
                break;
            }
        }
    }
    Ok(())
}
```

---

## STEP 5: Signal Handling _(High #6)_

```rust
use tokio::signal;

async fn main() {
    let (shutdown_tx, shutdown_rx) = tokio::sync::watch::channel(false);
    
    // SIGTERM handler
    tokio::spawn(async move {
        let mut sigterm = signal::unix::signal(signal::unix::SignalKind::terminate()).unwrap();
        tokio::select! {
            _ = signal::ctrl_c() => {},
            _ = sigterm.recv() => {},
        }
        info!("Shutdown signal received");
        let _ = shutdown_tx.send(true);
    });
    
    // Main loop checks shutdown_rx
}
```

---

## STEP 6: Memory Pattern Scanning _(High #9)_

```rust
// ÖNCE (eksik):
let mem_summary = ironsight_memory::maps::read_maps(proc_info.pid);

// SONRA (pattern scanning dahil):
let mem_summary = ironsight_memory::maps::read_maps(proc_info.pid);
let pattern_matches = ironsight_memory::scanner::scan_process(proc_info.pid);

for m in &pattern_matches {
    signals.push(Signal::new(
        &format!("memory_pattern:{}", m.pattern_name),
        SignalCategory::MemoryAnomaly,
        20.0,
        &m.context,
    ));
}
```

---

## STEP 7: Decay Engine Entegrasyonu _(High #8)_

```rust
// main.rs — daemon mode içinde
let mut decay_engine = DecayEngine::new(Duration::from_secs(config.decay.half_life_secs));

// Her scan'da:
for result in &scan_results {
    let raw_score = result.assessment.raw_score;
    decay_engine.record(result.pid, raw_score);
    let effective_score = decay_engine.current_score(result.pid);
    
    // Effective score kullan (raw yerine)
    if effective_score >= config.thresholds.critical_score as f64 {
        // Auto response...
    }
}
```

---

## STEP 8: Exclusion Logic Birleştirme _(High #7)_

```rust
// ÖNCE (main.rs'de ayrı is_excluded):
fn is_excluded(info: &ProcessInfo, config: &ExclusionConfig) -> bool { ... }

// SONRA (response crate'i kullan):
let exclusion_list = ExclusionList::from(&config.exclusions);

for proc in &processes {
    if exclusion_list.is_excluded(&proc.name, proc.pid, proc.exe.as_deref()) {
        continue;
    }
    // ... taramaya devam
}
```

---

## STEP 9: UTF-8 Safe Truncation _(Medium #11)_

```rust
fn truncate(s: &str, max: usize) -> String {
    if s.chars().count() <= max {
        return s.to_string();
    }
    let truncated: String = s.chars().take(max - 1).collect();
    format!("{}…", truncated)
}
```

---

## STEP 10: JSON Output Mode _(Medium #12)_

```rust
// CLI arg: --json
if args.json_output {
    let reports: Vec<_> = results.iter()
        .map(|r| &r.report)
        .collect();
    println!("{}", serde_json::to_string_pretty(&reports)?);
} else {
    // Mevcut text çıktı
}
```

---

## STEP 11: Watchdog PID Update _(Medium #13)_

```rust
// watchdog.rs — yeniden başlatma sonrası PID güncelle
fn sentinel_loop(config: &WatchdogConfig) {
    let mut watch_pid = config.watch_pid;
    
    loop {
        if !is_pid_alive(watch_pid) {
            warn!("Process {} died, restarting...", watch_pid);
            match restart_process(&config) {
                Ok(new_pid) => {
                    watch_pid = new_pid;  // PID GÜNCELLE
                    info!("Restarted as PID {}", new_pid);
                },
                Err(e) => error!("Restart failed: {}", e),
            }
        }
        thread::sleep(Duration::from_secs(config.heartbeat_interval));
    }
}
```

---

## STEP 12: CLI Parser (clap) _(Medium #16)_

### Bağımlılık Ekle
```toml
clap = { version = "4", features = ["derive"] }
```

```rust
use clap::Parser;

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
    sentinel: bool,
    
    #[arg(long)]
    check_privileges: bool,
    
    #[arg(long)]
    generate_config: bool,
    
    #[arg(long)]
    version_info: bool,
}
```

---

## Doğrulama Planı

```bash
# Unit testler
cargo test --package ironsight-service

# Integration test (root gerekir)
sudo cargo run --release --package ironsight-service -- --top 10

# Daemon mode (5 saniye sonra Ctrl+C)
sudo cargo run --release --package ironsight-service -- --daemon

# JSON output
sudo cargo run --release --package ironsight-service -- --top 5 --json

# Tüm workspace
cargo test --workspace
cargo clippy --workspace -- -W warnings
```
