# ironsight-memory — Implementation Steps

> Audit: [04_ironsight_memory.md](04_ironsight_memory.md) · 11 Issues (5 High, 6 Medium)

---

## STEP 1: Chunked Memory Reading _(High #1 — OOM Fix)_

**Dosya:** `crates/ironsight-memory/src/scanner.rs`

### Ne Yapılacak
1. `vec![0u8; region.size()]` → 4 MiB chunk'lar ile oku
2. Her chunk'ta pattern ara, sonuçları birleştir

```rust
const CHUNK_SIZE: usize = 4 * 1024 * 1024; // 4 MiB

fn scan_region(file: &mut File, region: &MemoryRegion, patterns: &SuspiciousPatterns) -> Vec<PatternMatch> {
    let mut matches = Vec::new();
    let mut offset = 0u64;
    let mut buf = vec![0u8; CHUNK_SIZE.min(region.size() as usize)];
    
    while offset < region.size() {
        let to_read = CHUNK_SIZE.min((region.size() - offset) as usize);
        let buf = &mut buf[..to_read];
        if file.seek(SeekFrom::Start(region.start + offset)).is_err() { break; }
        if file.read_exact(buf).is_err() { break; }
        
        for pattern in patterns.patterns() {
            // chunk içinde pattern ara
        }
        offset += to_read as u64;
    }
    matches
}
```

### Test
```rust
#[test]
fn test_large_region_chunked_scan() {
    // 128 MiB sahte bölge oluştur — OOM olmamalı
    let region = MemoryRegion { size: 128 * 1024 * 1024, .. };
    // Chunked scanning çalışmalı
}
```

---

## STEP 2: Error Reporting _(High #2)_

**Dosya:** `crates/ironsight-memory/src/scanner.rs`

### Ne Yapılacak
1. `ScanResult` struct oluştur: matches + errors + stats
2. Hataları toplama, partial results dönme

```rust
pub struct ScanResult {
    pub matches: Vec<PatternMatch>,
    pub errors: Vec<ScanError>,
    pub regions_scanned: usize,
    pub regions_failed: usize,
    pub bytes_scanned: u64,
}

pub fn scan_process(pid: u32) -> ScanResult { ... }
```

### Test
```rust
#[test]
fn test_scan_nonexistent_pid_returns_errors() {
    let result = scan_process(999999);
    assert!(result.regions_scanned == 0);
    assert!(!result.errors.is_empty());
}
```

---

## STEP 3: xxhash Kullanımı _(High #3 + Medium #8)_

**Dosya:** `crates/ironsight-memory/src/scanner.rs`

### Ne Yapılacak
1. Her bölge için xxh3 hash hesapla
2. Hash'leri `MemoryRegion` veya `ScanResult`'a ekle
3. İki scan arası hash karşılaştırma

```rust
use xxhash_rust::xxh3::xxh3_64;

pub struct RegionHash {
    pub region_start: u64,
    pub hash: u64,
}

fn hash_region(data: &[u8]) -> u64 {
    xxh3_64(data)
}
```

---

## STEP 4: Per-Region Entropy _(Medium #7)_

**Dosya:** `crates/ironsight-memory/src/scanner.rs`

### Ne Yapılacak
1. `ironsight_security::entropy::calculate_entropy()` benzeri fonksiyon
2. Chunk verisi üzerinde entropy hesapla
3. Yüksek entropy + executable = şüpheli

```rust
fn region_entropy(data: &[u8]) -> f64 {
    let mut freq = [0u64; 256];
    for &byte in data { freq[byte as usize] += 1; }
    let len = data.len() as f64;
    freq.iter().filter(|&&c| c > 0).map(|&c| {
        let p = c as f64 / len;
        -p * p.log2()
    }).sum()
}
```

---

## STEP 5: Continuous Memory Watcher _(High #5)_

**Dosya:** `crates/ironsight-memory/src/watcher.rs`

### Ne Yapılacak
1. `MemoryWatcher` struct: interval-based polling
2. `start_watching(pid)` → background thread
3. Değişiklik olduğunda event yayınla

```rust
pub struct MemoryWatcher {
    interval: Duration,
    stop_flag: Arc<AtomicBool>,
    event_tx: Sender<MemoryEvent>,
}

pub enum MemoryEvent {
    RegionAdded(MemoryRegion),
    RegionRemoved(MemoryRegion),
    PermissionChanged { region: MemoryRegion, old: String, new: String },
    WxViolationDetected(MemoryRegion),
}
```

---

## STEP 6: MemorySummary + Scanner Bağlantısı _(High #4)_

**Dosya:** `crates/ironsight-memory/src/lib.rs`

### Ne Yapılacak
```rust
pub struct MemorySummary {
    pub total_regions: usize,
    pub wx_violations: usize,
    pub anon_exec_regions: usize,
    pub pattern_matches: usize,     // YENİ
    pub suspicious_patterns: Vec<String>,  // YENİ
    pub high_entropy_regions: usize, // YENİ
    pub flags: Vec<String>,
}
```

---

## STEP 7: Configurable Patterns _(Medium #9)_

**Dosya:** `crates/ironsight-memory/src/scanner.rs`

### Ne Yapılacak
```rust
impl SuspiciousPatterns {
    pub fn default() -> Self { /* mevcut hardcoded patterns */ }
    pub fn from_config(config: &PatternConfig) -> Self { ... }
    pub fn add_pattern(&mut self, name: &str, pattern: &str) { ... }
    pub fn remove_pattern(&mut self, name: &str) { ... }
}
```

---

## Doğrulama Planı

```bash
cargo test --package ironsight-memory
cargo test --package ironsight-memory -- scanner::tests
cargo test --package ironsight-memory -- watcher::tests
cargo clippy --package ironsight-memory -- -W warnings
```
