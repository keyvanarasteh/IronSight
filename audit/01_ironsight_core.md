# ironsight-core — Deep Audit Report

**Description:** Core process monitoring — snapshot, diff, filter, tree, events  
**Dependencies:** sysinfo, crossbeam-channel, serde, chrono, thiserror, nix  
**Files:** lib.rs, error.rs, process_info.rs, snapshot.rs, spy.rs, diff.rs, filter.rs, system_info.rs, tests.rs

---

## ✅ What Works Well

- **Clean modular architecture** — Each concern (snapshot, diff, filter, spy) lives in its own module
- **Comprehensive test suite** — 30+ unit tests covering snapshots, diffs, filters, process info, and spy operations
- **Builder-pattern filter API** — Chainable `ProcessFilter` with `name_contains()`, `cpu_above()`, etc.
- **Process tree construction** — `snapshot.tree()` and `children_of()` working correctly
- **Cross-platform consideration** — Signal handling conditioned on `#[cfg(not(target_os = "windows"))]`

---

## 🔴 Critical Issues

### 1. No Graceful Shutdown for ProcessSpy Monitor Thread

**File:** `spy.rs:59-104`  
**Issue:** `start_monitoring()` spawns a thread with `loop { ... }` and no stop condition. The `_monitor: Option<JoinHandle<()>>` is stored but:
- No `AtomicBool` or `CancellationToken` to signal stop
- No `Drop` implementation to join the thread
- Calling `start_monitoring()` twice leaks the previous thread

**Fix Required:**
```rust
struct ProcessSpy {
    system: Arc<Mutex<System>>,
    event_tx: Sender<SpyEvent>,
    event_rx: Receiver<SpyEvent>,
    _monitor: Option<thread::JoinHandle<()>>,
    stop_flag: Arc<AtomicBool>,  // ADD THIS
}
```

### 2. ProcessSnapshot Cannot Be Serialized

**File:** `snapshot.rs:16-22`  
**Issue:** `ProcessSnapshot` uses `std::time::Instant` for `taken_at` which does NOT implement `Serialize`/`Deserialize`. This prevents:
- Caching snapshots to disk
- Sending snapshots over network
- JSON export of snapshots

**Fix Required:** Replace `taken_at: Instant` with `taken_at: DateTime<Utc>` from chrono

### 3. ProcessSpy::wait_for_spawn Busy-Loops

**File:** `spy.rs:207-225`  
**Issue:** `wait_for_spawn()` creates a new full snapshot every 200ms in a tight loop. Each `self.snapshot()` calls `sys.refresh_all()` which is expensive.

**Impact:** High CPU usage while waiting; blocks the calling thread

**Fix Required:** Use the event channel (`subscribe()`) to listen for `SpyEvent::ProcessSpawned` instead of polling

---

## 🟠 High Issues

### 4. ProcessSpy::kill() Ignores Return Value

**File:** `spy.rs:146-148`  
**Issue:** `p.kill()` returns a `bool`, but the code ignores it and always returns `Ok(())`. A failed kill is reported as success.

```rust
p.kill();  // Returns bool, but ignored!
info!("Killed process {pid}");
Ok(())  // Always Ok, even if kill failed
```

### 5. ProcessSpy::signal() Ignores Return Value

**File:** `spy.rs:161`  
**Issue:** Same issue as `kill()` — `p.kill_with(signal)` returns `Option<bool>`, but is ignored.

### 6. ProcessSpy::wait_for_exit() Holds Mutex Lock

**File:** `spy.rs:170-179`  
**Issue:** `wait_for_exit()` acquires the system mutex lock and then calls `p.wait()` which blocks indefinitely. This permanently deadlocks the system mutex, preventing any other operations.

### 7. No Timestamp in SpyEvent

**Issue:** `SpyEvent::Snapshot`, `SpyEvent::Diff`, etc. carry no timestamp, making it impossible to order events temporally at the consumer side.

---

## 🟡 Medium Issues

### 8. Error Type Missing Variants

**File:** `error.rs:5-18`  
**Issue:** `SuiteError` is too generic. Missing variants for:
- `SecurityError` — for ironsight-security integration
- `NetworkError` — for ironsight-network integration
- `MemoryError` — for ironsight-memory integration
- `ConfigError` — for configuration failures
- `PrivilegeError` — for insufficient permissions

### 9. ProcessInfo::gid Uses Raw Dereference

**File:** `process_info.rs:82`  
```rust
gid: p.group_id().map(|g| *g),
```
**Issue:** `group_id()` returns `Option<&Gid>` — the `*g` deref relies on `Gid` implementing `Deref<Target=u32>`. This works but is fragile if sysinfo changes its API.

### 10. ProcessInfo Has No Display Implementation

**Issue:** No `Display` trait impl for `ProcessInfo` or `ProcStatus`, making debug output less readable.

### 11. ProcessFilter Not Sortable

**Issue:** `ProcessFilter::collect()` returns unsorted results. Should support `.sort_by_cpu()`, `.sort_by_memory()`, `.limit(n)` for a complete query builder.

### 12. No process_info cmd Serialization Safety

**File:** `process_info.rs:68-72`  
**Issue:** Command line arguments (`cmd`) use `to_string_lossy()` which replaces invalid UTF-8 with `�`. This may cause false positives in pattern matching.

---

## ❌ Missing Implementations

| Feature | Status | Notes |
|---|---|---|
| `stop_monitoring()` | ❌ Missing | No way to stop the background monitor |
| Thread-safe snapshot cache | ❌ Missing | Each call re-scans the entire system |
| Snapshot serialization | ❌ Blocked | `Instant` prevents serialization |
| Event history/buffer | ❌ Missing | Events are fire-and-forget |
| Process resource limits | ❌ Missing | No rlimit/ulimit inspection |
| Network namespace awareness | ❌ Missing | Containers share PID namespace |
| cgroup detection | ❌ Missing | No container/Docker awareness |

---

## 📋 TODOs Found in Code

None explicitly marked, but implicit from architecture gaps listed above.

---

## 🧪 Test Coverage Gaps

| Area | Tested | Gap |
|---|---|---|
| Snapshot building | ✅ | No mock-based tests (all live) |
| Diff computation | ✅ | No concurrent modification test |
| Filter builder | ✅ | No empty snapshot test |
| ProcessSpy events | ❌ | No monitoring start/stop test |
| Signal sending | ❌ | No Unix signal delivery test |
| wait_for_exit | ❌ | No timeout/deadlock test |
| wait_for_spawn | ❌ | No timeout test |
| SystemInfo | ✅ | Basic validation only |
