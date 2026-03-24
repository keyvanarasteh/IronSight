# ironsight-core — Implementation Steps

> Audit: [01_ironsight_core.md](01_ironsight_core.md) · 12 Issues (3 Critical, 4 High, 5 Medium)

---

## STEP 1: ProcessSpy Graceful Shutdown _(Critical #1)_

**Dosya:** `crates/ironsight-core/src/spy.rs`

### Ne Yapılacak
1. `ProcessSpy` struct'a `stop_flag: Arc<AtomicBool>` ekle
2. `start_monitoring()` loop'unu `while !stop_flag.load(Ordering::Relaxed)` ile sar
3. `stop_monitoring()` metodu ekle — flag set et, thread join et
4. `Drop` trait impl ekle — otomatik cleanup
5. İkinci `start_monitoring()` çağrısı engelle (zaten çalışıyorsa hata dön)

### Kod Değişikliği
```rust
use std::sync::atomic::{AtomicBool, Ordering};

pub struct ProcessSpy {
    system: Arc<Mutex<System>>,
    event_tx: Sender<SpyEvent>,
    event_rx: Receiver<SpyEvent>,
    _monitor: Option<thread::JoinHandle<()>>,
    stop_flag: Arc<AtomicBool>,  // YENİ
}

pub fn stop_monitoring(&mut self) {
    self.stop_flag.store(true, Ordering::Relaxed);
    if let Some(handle) = self._monitor.take() {
        let _ = handle.join();
    }
}

impl Drop for ProcessSpy {
    fn drop(&mut self) {
        self.stop_monitoring();
    }
}
```

### Test
```bash
cargo test --package ironsight-core -- spy::tests
```
```rust
#[test]
fn test_monitor_start_stop() {
    let spy = ProcessSpy::new(Duration::from_millis(100));
    spy.start_monitoring();
    std::thread::sleep(Duration::from_millis(300));
    spy.stop_monitoring();
    // Thread should be joined, no leak
}

#[test]
fn test_double_start_returns_error() {
    let spy = ProcessSpy::new(Duration::from_millis(100));
    assert!(spy.start_monitoring().is_ok());
    assert!(spy.start_monitoring().is_err());
}
```

---

## STEP 2: ProcessSnapshot Serialization _(Critical #2)_

**Dosya:** `crates/ironsight-core/src/snapshot.rs`

### Ne Yapılacak
1. `taken_at: Instant` → `taken_at: DateTime<Utc>` değiştir
2. `ProcessSnapshot`'a `Serialize`/`Deserialize` derive ekle
3. `new()` içinde `Utc::now()` kullan
4. `elapsed()` metodunu `chrono::Duration` ile yeniden yaz

### Kod Değişikliği
```rust
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessSnapshot {
    pub processes: Vec<ProcessInfo>,
    pub taken_at: DateTime<Utc>,  // Instant → DateTime<Utc>
}

impl ProcessSnapshot {
    pub fn elapsed(&self) -> chrono::Duration {
        Utc::now() - self.taken_at
    }
}
```

### Test
```rust
#[test]
fn test_snapshot_serialization_roundtrip() {
    let snapshot = ProcessSnapshot::new(&system);
    let json = serde_json::to_string(&snapshot).unwrap();
    let restored: ProcessSnapshot = serde_json::from_str(&json).unwrap();
    assert_eq!(snapshot.processes.len(), restored.processes.len());
}
```

---

## STEP 3: wait_for_spawn Event-Based _(Critical #3)_

**Dosya:** `crates/ironsight-core/src/spy.rs`

### Ne Yapılacak
1. `wait_for_spawn()` → event channel üzerinden dinle
2. Polling yerine `subscribe()` + `SpyEvent::ProcessSpawned` filtrele
3. Timeout parametresi ekle

### Kod Değişikliği
```rust
pub fn wait_for_spawn(&self, name: &str, timeout: Duration) -> Result<ProcessInfo> {
    let deadline = Instant::now() + timeout;
    loop {
        match self.event_rx.recv_timeout(Duration::from_millis(100)) {
            Ok(SpyEvent::ProcessSpawned(info)) if info.name == name => return Ok(info),
            Ok(_) => continue,
            Err(RecvTimeoutError::Timeout) if Instant::now() < deadline => continue,
            Err(_) => return Err(SuiteError::Timeout(name.to_string())),
        }
    }
}
```

### Test
```rust
#[test]
fn test_wait_for_spawn_timeout() {
    let spy = ProcessSpy::new(Duration::from_millis(50));
    spy.start_monitoring();
    let result = spy.wait_for_spawn("nonexistent", Duration::from_millis(200));
    assert!(result.is_err());
}
```

---

## STEP 4: kill() ve signal() Dönüş Değeri _(High #4-5)_

**Dosya:** `crates/ironsight-core/src/spy.rs`

### Ne Yapılacak
1. `kill()` → `p.kill()` sonucunu kontrol et
2. `signal()` → `p.kill_with()` sonucunu kontrol et
3. Başarısız durumda `Err` dön

### Kod Değişikliği
```rust
pub fn kill(&self, pid: u32) -> Result<()> {
    let sys = self.system.lock().unwrap();
    let pid_key = Pid::from_u32(pid);
    if let Some(p) = sys.process(pid_key) {
        if p.kill() {
            info!("Killed process {pid}");
            Ok(())
        } else {
            Err(SuiteError::ProcessAction(format!("kill failed for PID {pid}")))
        }
    } else {
        Err(SuiteError::ProcessNotFound(pid))
    }
}
```

### Test
```rust
#[test]
fn test_kill_nonexistent_pid_returns_error() {
    let spy = ProcessSpy::new(Duration::from_secs(1));
    assert!(spy.kill(999999).is_err());
}
```

---

## STEP 5: wait_for_exit Mutex Deadlock _(High #6)_

**Dosya:** `crates/ironsight-core/src/spy.rs`

### Ne Yapılacak
1. `wait_for_exit()` → mutex lock al, PID kontrol et, ANINDA bırak
2. Poll loop ile PID varlığını kontrol et (mutex kısa süreli al/bırak)
3. Timeout ekle

### Kod Değişikliği
```rust
pub fn wait_for_exit(&self, pid: u32, timeout: Duration) -> Result<()> {
    let deadline = Instant::now() + timeout;
    loop {
        {
            let sys = self.system.lock().unwrap();
            if sys.process(Pid::from_u32(pid)).is_none() {
                return Ok(());  // Process exited
            }
        }  // Lock released here
        if Instant::now() > deadline {
            return Err(SuiteError::Timeout(format!("PID {pid}")));
        }
        thread::sleep(Duration::from_millis(100));
    }
}
```

---

## STEP 6: SpyEvent Timestamp _(High #7)_

**Dosya:** `crates/ironsight-core/src/spy.rs`

### Ne Yapılacak
1. Her `SpyEvent` varyantına `timestamp: DateTime<Utc>` ekle
2. Event oluşturma noktalarında `Utc::now()` stamp et

```rust
pub enum SpyEvent {
    ProcessSpawned { info: ProcessInfo, timestamp: DateTime<Utc> },
    ProcessExited { pid: u32, timestamp: DateTime<Utc> },
    Snapshot { snapshot: ProcessSnapshot, timestamp: DateTime<Utc> },
    Diff { diff: SnapshotDiff, timestamp: DateTime<Utc> },
}
```

---

## STEP 7: Error Type Genişletme _(Medium #8)_

**Dosya:** `crates/ironsight-core/src/error.rs`

### Ne Yapılacak
```rust
pub enum SuiteError {
    // Mevcut
    System(String),
    ProcessNotFound(u32),
    ProcessAction(String),
    // YENİ
    Security(String),
    Network(String),
    Memory(String),
    Config(String),
    Privilege(String),
    Timeout(String),
}
```

---

## STEP 8: ProcessFilter Sort + Limit _(Medium #11)_

**Dosya:** `crates/ironsight-core/src/filter.rs`

### Ne Yapılacak
1. `.sort_by_cpu()`, `.sort_by_memory()` ekle
2. `.limit(n)` ekle
3. ProcessInfo'ya `Display` impl ekle (#10)

```rust
impl ProcessFilter {
    pub fn sort_by_cpu(mut self) -> Self { self.sort = Some(SortBy::Cpu); self }
    pub fn sort_by_memory(mut self) -> Self { self.sort = Some(SortBy::Memory); self }
    pub fn limit(mut self, n: usize) -> Self { self.limit = Some(n); self }
}
```

---

## Doğrulama Planı

```bash
# Tüm testler
cargo test --package ironsight-core

# Yeni testler
cargo test --package ironsight-core -- spy::tests::test_monitor_start_stop
cargo test --package ironsight-core -- spy::tests::test_double_start
cargo test --package ironsight-core -- spy::tests::test_kill_nonexistent
cargo test --package ironsight-core -- snapshot::tests::test_serialization

# Lint
cargo clippy --package ironsight-core -- -W warnings
```
