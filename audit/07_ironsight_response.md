# ironsight-response — Deep Audit Report

**Description:** Automated response handler — suspend, forensic dump, kill, exclusion list  
**Dependencies:** ironsight-core, serde, chrono, tracing, thiserror, nix  
**Files:** lib.rs, actions.rs, exclusions.rs, handler.rs

---

## ✅ What Works Well

- **Correct forensic order** — Suspend → Dump → Kill sequence preserved in `forensic_kill()`
- **Exclusion list system** — Pre-populated with critical system processes (init, systemd, sshd, etc.)
- **Path-based exclusions** — Protects system directories (/usr/sbin/, /usr/lib/systemd/)
- **Cross-platform fallbacks** — Non-Unix platforms get explicit "not supported" results
- **Builder pattern** — `ResponseHandler::new().with_exclusions()` chaining

---

## 🔴 Critical Issues

### 1. Memory Dumps Written to /tmp/ by Default

**File:** `actions.rs:121`  
**Issue:** Default dump directory is derived from config `report_dir` which defaults to `/tmp/ironsight-reports`. Memory dumps contain sensitive process data (passwords, keys, session tokens).

**Impact:** Any user on the system can read forensic dumps.

**Fix Required:** 
- Use `0700` permissions on dump directory
- Write to `/var/lib/ironsight/dumps/` with root-only access
- Consider encrypting dumps at rest

### 2. Memory Dump Has No Size Limit

**File:** `actions.rs:190`  
**Issue:** Individual regions capped at 32 MiB but no total dump size limit. A process with thousands of small regions could fill the disk.

---

## 🟠 High Issues

### 3. ResponseHandler::respond() Ignores MemoryDump and Resume Actions

**File:** `handler.rs:75-98`  
```rust
match recommended {
    ActionType::LogOnly => { ... },
    ActionType::Suspend => { ... },
    ActionType::Kill => { ... },
    _ => {}  // ← MemoryDump and Resume silently ignored!
}
```
**Impact:** If `RecommendedAction::SuspendDumpKill` maps to `ActionType::MemoryDump`, the response handler does nothing.

### 4. No Integration Between ExclusionList and Config ExclusionConfig

**Issue:** Two separate exclusion systems exist:
- `ironsight_response::ExclusionList` — used by `ResponseHandler`
- `ironsight_service::config::ExclusionConfig` — used by `main.rs`

`ResponseHandler` creates its own `ExclusionList::default()` (empty!) by default. The config's exclusions are only used in `main.rs` for filtering processes, not in the response handler.

**Impact:** If auto-response is enabled, excluded processes could still be killed by the response handler.

### 5. ExclusionList::is_excluded Doesn't Check Path

**File:** `exclusions.rs:46-53`  
**Issue:** `is_excluded()` checks only name and PID, NOT path. `is_path_excluded()` is a separate method that's never called from `handler.rs`.

```rust
pub fn is_excluded(&self, name: &str, pid: u32) -> bool {
    // Checks pids and names only!
    // Path exclusions are never checked!
}
```

### 6. Actions Don't Verify Process Still Exists

**Issue:** `suspend()`, `resume()`, `kill_process()` use `nix::sys::signal::kill()` which returns `ESRCH` for non-existent PIDs. This is handled as an error, but there's no pre-check, meaning the forensic sequence could fail mid-way (suspend succeeds, dump fails because process exited, kill fails on already-dead process).

---

## 🟡 Medium Issues

### 7. No Action Audit Trail Persistence

**Issue:** `ResponseLog` is created but only stored in memory. Actions taken against processes are lost when the application exits.

### 8. No Undo/Rollback for Suspend

**Issue:** If a process is suspended and then determined to be benign, there's no automated rollback mechanism.

### 9. No Rate Limiting on Actions

**Issue:** Nothing prevents the response handler from killing multiple processes in rapid succession, potentially causing a denial-of-service against the system it's protecting.

### 10. ExclusionList Has No Regex/Glob Support

**Issue:** Process names must match exactly. A rule like `chrome-*` to exclude all Chrome helper processes is not supported.

### 11. No Confirmation/Approval Flow

**Issue:** For `auto_response` mode, there's no human-in-the-loop approval step before destructive actions (suspend/kill).

### 12. dump_memory Duplicates Maps Parsing

**File:** `actions.rs:169-203`  
**Issue:** `dump_memory()` re-parses `/proc/PID/maps` manually instead of using `ironsight_memory::maps::parse_maps()`. This duplicates logic and could produce inconsistent results.

---

## ❌ Missing Implementations

| Feature | Status | Notes |
|---|---|---|
| Auto-response integration | ❌ | Config flag exists but unused |
| Path-based exclusion check | ❌ | Method exists but uncalled |
| Action persistence/audit log | ❌ | In-memory only |
| Rate limiting | ❌ | No throttle |
| Undo/rollback | ❌ | No resume automation |
| Human approval flow | ❌ | No interactive mode |
| Network isolation response | ❌ | No firewall/iptables |
| Process quarantine | ❌ | No namespace isolation |
| File quarantine | ❌ | No file moving/renaming |
| Regex exclusions | ❌ | Exact match only |
| Windows responses | ❌ | Stub only |
| Response history querying | ❌ | No query API |

---

## 🧪 Test Coverage

| Area | Tested | Notes |
|---|---|---|
| Exclusion by name | ✅ | Custom exclusion |
| Exclusion by PID | ✅ | System defaults |
| Path exclusion | ✅ | Prefix matching |
| Excluded response | ✅ | Handler respects exclusions |
| LogOnly action | ✅ | No action taken |
| Suspend action | ✅ | Action attempted |
| Kill sequence | ❌ | Cannot safely test |
| Memory dump | ❌ | Requires elevated privileges |
| Forensic sequence | ❌ | Cannot safely test |
| Non-existent PID | ❌ | Error paths untested |
| Concurrent actions | ❌ | No thread safety tests |
