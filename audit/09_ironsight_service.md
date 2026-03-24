# ironsight-service — Deep Audit Report

**Description:** Service orchestrator — tokio event loop, config, privilege escalation, watchdog  
**Dependencies:** All workspace crates + tokio, tracing, anyhow, sysinfo, toml, nix, chrono  
**Files:** main.rs, config.rs, privilege.rs, watchdog.rs

---

## ✅ What Works Well

- **Full pipeline integration** — Config → Privilege → Snapshot → Security → Network → Memory → Heuristic → Report
- **TOML config with auto-discovery** — Searches `./ironsight.toml`, `/etc/ironsight/config.toml`, `~/.config/ironsight/config.toml`
- **Sane defaults** — Every config field has a reasonable default via `serde(default)`
- **Privilege report** — Checks CAP_SYS_PTRACE, CAP_KILL, NET_READ, PROC_MAPS with clear display
- **Watchdog sentinel** — Peer process monitoring with auto-restart
- **CLI argument parsing** — `--pid`, `--top`, `--config`, `--generate-config`, `--check-privileges`
- **Good test coverage** — 15+ tests for config parsing, privilege checks, watchdog args

---

## 🔴 Critical Issues

### 1. No Async/Tokio Usage Despite Dependency

**File:** `Cargo.toml:22`, `main.rs:28`  
**Issue:** `tokio` is in dependencies with `full` features but `main()` is a synchronous function. The entire scan pipeline is blocking. No `#[tokio::main]`, no async operations, no concurrent scanning.

**Impact:** 
- Process scanning is sequential — 500 processes take N × single-process time
- Network DNS lookups block the main thread
- No concurrent security analysis

### 2. Network Audit Rescans /proc/net Per Process

**File:** `main.rs:223`  
```rust
let net_audit = ironsight_network::audit::NetworkAudit::scan_pid(proc_info.pid);
```
**Issue:** `scan_pid()` calls `SocketMapper::scan()` which parses ALL of `/proc/net/tcp`, `/proc/net/tcp6`, etc. — **for every process.** With 500 processes, this means ~2000 full /proc/net reads.

**Fix Required:** Scan once, cache results, filter by PID.

### 3. auto_response Config Flag is Never Used

**File:** `config.rs:63`, `main.rs` (not referenced)  
**Issue:** `thresholds.auto_response: bool` exists in config but `main.rs` never checks it. The response handler is never invoked. Critical/High threats are reported but no automated action is ever taken.

### 4. report.min_level Config is Never Used

**File:** `config.rs:81`, `main.rs` (not referenced)  
**Issue:** `report.min_level: String` exists but the report filtering in `main.rs` uses `thresholds.export_min_score` instead. The `min_level` field is dead config.

---

## 🟠 High Issues

### 5. No Continuous Monitoring / Daemon Mode

**Issue:** The tool runs a single scan and exits. Despite `general.interval_secs` config existing, there's no loop mode, no `--daemon` flag, no systemd service file.

### 6. No Graceful Signal Handling

**Issue:** No SIGTERM/SIGINT handler. Ctrl+C kills the process mid-scan, potentially leaving:
- Orphaned watchdog sentinel processes
- Partially-written report files
- Unfinished forensic dumps

### 7. Exclusion Logic Duplicated

**File:** `main.rs:399-417`  
**Issue:** `is_excluded()` in `main.rs` duplicates exclusion logic from `ironsight_response::ExclusionList`. Two separate exclusion systems with different code.

### 8. DecayEngine Never Used

**Issue:** `ironsight-heuristic` has a fully implemented `DecayEngine` for time-based scoring, but `main.rs` does single-shot assessment only. The decay engine has no integration point.

### 9. Memory Pattern Scanning Not Integrated

**File:** `main.rs:250-273`  
**Issue:** Memory analysis reads maps and checks W^X violations, but `ironsight_memory::scanner::scan_process()` is **never called.** Pattern scanning for shellcode/C2 strings is completely skipped.

### 10. Config shellexpand Only Handles ~/

**File:** `config.rs:220-227`  
**Issue:** Only `~/` is expanded to `$HOME`. No support for `~user/`, `$VAR`, or `${VAR}` patterns.

---

## 🟡 Medium Issues

### 11. truncate() Panics on Multi-Byte UTF-8

**File:** `main.rs:419-424`  
```rust
format!("{}…", &s[..max - 1])
```
**Issue:** String slicing on byte boundary. Process names with UTF-8 characters (e.g., Chinese, Japanese, emoji) will panic on invalid char boundary.

### 12. No JSON Output Mode for CLI

**Issue:** Only human-readable text output. No `--json` flag for machine-parseable output to stdout. Saved JSON files exist but stdout is always text.

### 13. Watchdog Sentinel Monitors Old PID After Restart

**File:** `watchdog.rs:93-107`  
**Issue:** When the sentinel restarts the main process, it gets a new PID but continues monitoring the old one (variable `watch_pid` never updates in the loop). The comment says "In production, the new process would register itself" — but this registration mechanism doesn't exist.

### 14. No Watchdog Heartbeat Protocol

**Issue:** Watchdog uses `is_pid_alive()` (kill signal 0) which only checks if the process exists, not if it's healthy. A hung process would appear "alive" but not functioning.

### 15. Report Directory Not Secured

**File:** `main.rs:379`  
```rust
let _ = std::fs::create_dir_all(report_dir);
```
**Issue:** Creates directory with default permissions (typically 0755). Security reports containing threat data, hashes, and process details are world-readable.

### 16. No --version Flag

**Issue:** Version is hardcoded in banner text but no `--version` CLI flag.

---

## ❌ Missing Implementations

| Feature | Status | Notes |
|---|---|---|
| Async/concurrent scanning | ❌ | Tokio unused |
| Continuous daemon mode | ❌ | Single-shot only |
| auto_response integration | ❌ | Config dead |
| Decay engine integration | ❌ | Never used |
| Memory pattern scanning | ❌ | Not called |
| Signal handling (SIGTERM) | ❌ | No handler |
| systemd service unit | ❌ | No .service file |
| JSON stdout output | ❌ | Text only |
| REST API interface | ❌ | No server mode |
| Network scan caching | ❌ | Per-process rescan |
| Kernel crate integration | ❌ | Empty stub |
| clap/structopt CLI parsing | ❌ | Manual arg parsing |
| Log file output | ❌ | Stderr only |
| Watchdog heartbeat | ❌ | PID check only |
| Config hot-reload | ❌ | Read once |
| Process scan caching | ❌ | Full rescan |

---

## 🧪 Test Coverage

| Area | Tested | Notes |
|---|---|---|
| Default config values | ✅ | All fields |
| TOML parsing | ✅ | Full and partial |
| TOML roundtrip | ✅ | Generate → parse |
| Config discovery fallback | ✅ | No file → defaults |
| shellexpand tilde | ✅ | Basic test |
| Privilege check execution | ✅ | Runs successfully |
| Privilege levels | ✅ | Enum validation |
| /proc/net readability | ✅ | World-readable check |
| PID alive check | ✅ | Own PID, dead PID |
| Watchdog arg parsing | ✅ | Full and absent |
| Watchdog roles | ✅ | Enum validation |
| Full scan pipeline | ❌ | No integration test |
| CLI argument parsing | ❌ | Not tested |
| Exclusion logic | ❌ | Not tested |
| Report saving | ❌ | Not tested |
| Error handling | ❌ | Not tested |
