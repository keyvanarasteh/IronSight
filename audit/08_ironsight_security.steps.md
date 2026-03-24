# ironsight-security — Implementation Steps

> Audit: [08_ironsight_security.md](08_ironsight_security.md) · 11 Issues (5 High, 6 Medium)

---

## STEP 1: Streaming Hash _(High #4)_

**Dosya:** `crates/ironsight-security/src/hash.rs`

### Ne Yapılacak
```rust
use sha2::{Sha256, Digest};
use std::io::{BufReader, Read};

pub fn hash_file(path: &Path) -> Result<String> {
    let file = File::open(path)?;
    let mut reader = BufReader::with_capacity(65536, file); // 64 KiB buffer
    let mut hasher = Sha256::new();
    
    let mut buf = [0u8; 65536];
    loop {
        let n = reader.read(&mut buf)?;
        if n == 0 { break; }
        hasher.update(&buf[..n]);
    }
    
    Ok(hex::encode(hasher.finalize()))
}
```

### Test
```rust
#[test]
fn test_streaming_hash_matches_full_read() {
    let path = Path::new("/usr/bin/ls");
    let streaming = hash_file_streaming(path).unwrap();
    let full = hash_file_full(path).unwrap();
    assert_eq!(streaming, full);
}
```

---

## STEP 2: Streaming Entropy _(High #5)_

**Dosya:** `crates/ironsight-security/src/entropy.rs`

```rust
pub fn file_entropy_streaming(path: &Path) -> Result<f64> {
    let file = File::open(path)?;
    let mut reader = BufReader::new(file);
    let mut freq = [0u64; 256];
    let mut total = 0u64;
    
    let mut buf = [0u8; 65536];
    loop {
        let n = reader.read(&mut buf)?;
        if n == 0 { break; }
        for &byte in &buf[..n] {
            freq[byte as usize] += 1;
        }
        total += n as u64;
    }
    
    if total == 0 { return Ok(0.0); }
    let len = total as f64;
    Ok(freq.iter().filter(|&&c| c > 0).map(|&c| {
        let p = c as f64 / len;
        -p * p.log2()
    }).sum())
}
```

---

## STEP 3: Real Linux Signature Verification _(High #1)_

**Dosya:** `crates/ironsight-security/src/signature.rs`

### Ne Yapılacak
1. `dpkg -S` ile dosyanın hangi pakete ait olduğunu bul
2. `dpkg --verify` ile paket bütünlüğünü kontrol et
3. Sonucu `SignatureResult`'a yaz

```rust
#[cfg(target_os = "linux")]
pub fn verify_linux(path: &Path) -> SignatureResult {
    // 1. Hangi pakete ait?
    let pkg_output = std::process::Command::new("dpkg")
        .args(["-S", &path.to_string_lossy()])
        .output();
    
    let package = match pkg_output {
        Ok(out) if out.status.success() => {
            let stdout = String::from_utf8_lossy(&out.stdout);
            Some(stdout.split(':').next().unwrap_or("").trim().to_string())
        },
        _ => None,
    };

    // 2. Paket bütünlüğü
    let verified = if let Some(ref pkg) = package {
        let verify = std::process::Command::new("dpkg")
            .args(["--verify", pkg])
            .output();
        match verify {
            Ok(out) => out.status.success(),
            _ => false,
        }
    } else {
        false
    };

    SignatureResult {
        is_signed: Some(package.is_some()),
        signer: package,
        verified: Some(verified),
        method: "dpkg-verify".to_string(),
    }
}
```

### Test
```rust
#[cfg(target_os = "linux")]
#[test]
fn test_system_binary_verified() {
    let result = verify_linux(Path::new("/usr/bin/ls"));
    assert_eq!(result.is_signed, Some(true));
    assert!(result.signer.is_some());
}

#[cfg(target_os = "linux")]
#[test]
fn test_custom_binary_not_in_package() {
    let tmp = tempfile::NamedTempFile::new().unwrap();
    let result = verify_linux(tmp.path());
    assert_eq!(result.is_signed, Some(false));
}
```

---

## STEP 4: Configurable Thresholds _(Medium #7)_

**Dosya:** `crates/ironsight-security/src/audit.rs`

```rust
pub struct SecurityAuditConfig {
    pub entropy_thresholds: EntropyThresholds,
    pub suspicious_dirs: Vec<String>,
    pub max_file_size: u64,  // Streaming için
}

#[derive(Clone)]
pub struct EntropyThresholds {
    pub low: f64,     // default: 3.0
    pub medium: f64,  // default: 5.0
    pub high: f64,    // default: 6.5
    pub critical: f64, // default: 7.5
}

pub struct SecurityAudit {
    config: SecurityAuditConfig,
}

impl SecurityAudit {
    pub fn with_config(config: SecurityAuditConfig) -> Self { Self { config } }
}
```

---

## STEP 5: Severity Score _(Medium #10)_

```rust
pub struct AuditResult {
    pub severity_score: f64,  // 0.0 - 100.0
    pub flag_count: u32,
    pub flags: Vec<AuditFlag>,
    pub hash: Option<String>,
    pub entropy: Option<f64>,
    pub signature: Option<SignatureResult>,
    pub path_analysis: Option<PathAnalysis>,
}

#[derive(Debug, Clone)]
pub struct AuditFlag {
    pub name: String,
    pub severity: f64,  // 0-100 ağırlık
    pub description: String,
}

impl AuditResult {
    pub fn compute_severity(&mut self) {
        self.severity_score = self.flags.iter()
            .map(|f| f.severity)
            .sum::<f64>()
            .min(100.0);
    }
}
```

---

## STEP 6: Module Enumeration _(Medium #6)_

**Dosya:** `crates/ironsight-security/src/modules.rs` [YENİ]

```rust
#[cfg(target_os = "linux")]
pub fn enumerate_modules(path: &Path) -> Result<Vec<SharedLibrary>> {
    let output = std::process::Command::new("ldd")
        .arg(path)
        .output()?;
    
    // ldd çıktısını parse et
    let libs: Vec<SharedLibrary> = String::from_utf8_lossy(&output.stdout)
        .lines()
        .filter_map(parse_ldd_line)
        .collect();
    
    Ok(libs)
}

pub struct SharedLibrary {
    pub name: String,
    pub path: Option<PathBuf>,
    pub address: Option<u64>,
}
```

---

## STEP 7: Path Analysis İyileştirme _(Medium #9)_

```rust
// ÖNCE (çok agresif):
if path_lower.contains("downloads") || path_lower.contains("desktop")

// SONRA (sadece bilinen konumlar):
fn is_user_download_dir(path: &str) -> bool {
    let patterns = [
        "/home/*/Downloads/",
        "/Users/*/Downloads/",
        "/home/*/Desktop/",
        "/Users/*/Desktop/",
        "/tmp/",
        "/dev/shm/",
    ];
    patterns.iter().any(|p| glob_match(p, path))
}
```

---

## Doğrulama Planı

```bash
cargo test --package ironsight-security
cargo test --package ironsight-security -- hash::tests
cargo test --package ironsight-security -- entropy::tests
cargo test --package ironsight-security -- signature::tests
```
