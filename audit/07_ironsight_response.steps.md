# ironsight-response — Implementation Steps

> Audit: [07_ironsight_response.md](07_ironsight_response.md) · 12 Issues (2 Critical, 6 High, 4 Medium)

---

## STEP 1: Secure Dump Directory _(Critical #1)_

**Dosya:** `crates/ironsight-response/src/actions.rs`

### Ne Yapılacak
1. Dump dizini `/var/lib/ironsight/dumps/` olarak değiştir
2. `0700` permissions ayarla
3. Ownership kontrolü yap

```rust
use std::os::unix::fs::PermissionsExt;

fn ensure_dump_dir(path: &Path) -> Result<()> {
    std::fs::create_dir_all(path)?;
    let perms = std::fs::Permissions::from_mode(0o700);
    std::fs::set_permissions(path, perms)?;
    
    // Root'a ait olduğunu kontrol et
    let meta = std::fs::metadata(path)?;
    if meta.uid() != 0 {
        warn!("Dump directory not owned by root: {}", path.display());
    }
    Ok(())
}
```

### Test
```rust
#[test]
fn test_dump_dir_permissions() {
    let tmp = tempdir().unwrap();
    let dump_dir = tmp.path().join("dumps");
    ensure_dump_dir(&dump_dir).unwrap();
    
    let perms = std::fs::metadata(&dump_dir).unwrap().permissions();
    assert_eq!(perms.mode() & 0o777, 0o700);
}
```

---

## STEP 2: Dump Size Limit _(Critical #2)_

```rust
const MAX_TOTAL_DUMP_SIZE: u64 = 256 * 1024 * 1024; // 256 MiB

fn dump_memory(pid: u32, dump_dir: &Path) -> Result<DumpResult> {
    let mut total_size = 0u64;
    let regions = read_maps(pid)?;
    
    for region in &regions {
        if total_size + region.size() > MAX_TOTAL_DUMP_SIZE {
            warn!("Dump size limit reached ({} MiB), stopping", MAX_TOTAL_DUMP_SIZE / (1024*1024));
            break;
        }
        // dump region...
        total_size += region.size();
    }
    
    Ok(DumpResult { total_size, regions_dumped: count })
}
```

---

## STEP 3: MemoryDump + Resume Handling _(High #3)_

**Dosya:** `crates/ironsight-response/src/handler.rs`

```rust
match recommended {
    ActionType::LogOnly => { /* mevcut */ },
    ActionType::Suspend => { /* mevcut */ },
    ActionType::Kill => { /* mevcut */ },
    ActionType::MemoryDump => {
        let dump_result = actions::dump_memory(pid, &self.dump_dir)?;
        log.add_action("memory_dump", &format!("{} bytes dumped", dump_result.total_size));
    },
    ActionType::Resume => {
        actions::resume(pid)?;
        log.add_action("resume", "Process resumed");
    },
    ActionType::SuspendDumpKill => {
        self.forensic_kill(pid)?;
    },
}
```

---

## STEP 4: Exclusion Birleştirme _(High #4-5)_

**Dosya:** `crates/ironsight-response/src/exclusions.rs`

### Ne Yapılacak
1. `is_excluded()` → hem name, PID VE path kontrol et
2. Config'den ExclusionList oluştur

```rust
pub fn is_excluded(&self, name: &str, pid: u32, path: Option<&str>) -> bool {
    // PID kontrolü
    if self.pids.contains(&pid) { return true; }
    // İsim kontrolü
    if self.names.iter().any(|n| n == name) { return true; }
    // Path kontrolü
    if let Some(p) = path {
        if self.paths.iter().any(|prefix| p.starts_with(prefix)) { return true; }
    }
    false
}

impl From<&ExclusionConfig> for ExclusionList {
    fn from(config: &ExclusionConfig) -> Self {
        let mut list = ExclusionList::with_system_defaults();
        list.add_names(&config.names);
        list.add_paths(&config.paths);
        list
    }
}
```

---

## STEP 5: Process Existence Check _(High #6)_

```rust
fn verify_process_exists(pid: u32) -> Result<()> {
    match nix::sys::signal::kill(Pid::from_raw(pid as i32), None) {
        Ok(_) => Ok(()),
        Err(nix::errno::Errno::ESRCH) => Err(ResponseError::ProcessNotFound(pid)),
        Err(e) => Err(ResponseError::Signal(e.to_string())),
    }
}

pub fn forensic_kill(&self, pid: u32) -> Result<ResponseLog> {
    verify_process_exists(pid)?;  // Önce kontrol
    
    // Suspend
    self.suspend(pid)?;
    verify_process_exists(pid)?;  // Hala yaşıyor mu?
    
    // Dump
    let dump = self.dump_memory(pid)?;
    
    // Kill (process ölmüş olabilir, hata yutulabilir)
    match self.kill(pid) {
        Ok(_) => {},
        Err(ResponseError::ProcessNotFound(_)) => {
            warn!("Process already exited before kill");
        },
        Err(e) => return Err(e),
    }
    Ok(log)
}
```

---

## STEP 6: Action Audit Trail _(Medium #7)_

```rust
pub struct ActionAuditLog {
    entries: Vec<AuditEntry>,
    file_path: PathBuf,
}

#[derive(Serialize)]
struct AuditEntry {
    timestamp: DateTime<Utc>,
    pid: u32,
    process_name: String,
    action: ActionType,
    result: String,
    operator: String,  // "auto" veya username
}

impl ActionAuditLog {
    pub fn log_action(&mut self, entry: AuditEntry) -> Result<()> {
        self.entries.push(entry.clone());
        // Append to file
        let mut file = OpenOptions::new().append(true).create(true).open(&self.file_path)?;
        writeln!(file, "{}", serde_json::to_string(&entry)?)?;
        Ok(())
    }
}
```

---

## STEP 7: Rate Limiting _(Medium #9)_

```rust
pub struct ActionRateLimiter {
    actions: VecDeque<(Instant, ActionType)>,
    max_kills_per_minute: usize,  // default: 5
    max_suspends_per_minute: usize,  // default: 10
}

impl ActionRateLimiter {
    pub fn can_act(&mut self, action: &ActionType) -> bool {
        self.cleanup_old();
        let count = self.actions.iter().filter(|(_, a)| a == action).count();
        match action {
            ActionType::Kill => count < self.max_kills_per_minute,
            ActionType::Suspend => count < self.max_suspends_per_minute,
            _ => true,
        }
    }
}
```

---

## STEP 8: Regex Exclusions _(Medium #10)_

```rust
use regex::Regex;

pub struct ExclusionList {
    pids: HashSet<u32>,
    names: Vec<String>,
    paths: Vec<String>,
    name_patterns: Vec<Regex>,  // YENİ: glob/regex support
}

impl ExclusionList {
    pub fn add_pattern(&mut self, pattern: &str) -> Result<()> {
        self.name_patterns.push(Regex::new(pattern)?);
        Ok(())
    }
}
```

---

## Doğrulama Planı

```bash
cargo test --package ironsight-response
cargo test --package ironsight-response -- exclusions::tests
cargo test --package ironsight-response -- actions::tests
```
