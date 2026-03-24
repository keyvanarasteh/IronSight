# ironsight-security — Deep Audit Report

**Description:** Binary integrity analysis — hash, entropy, signature, module enumeration  
**Dependencies:** ironsight-core, serde, sha2, hex, tracing, thiserror  
**Files:** lib.rs, audit.rs, entropy.rs, hash.rs, path_analysis.rs, signature.rs

---

## ✅ What Works Well

- **Clean orchestrator pattern** — `SecurityAudit::audit()` runs all checks and returns unified `AuditResult`
- **Shannon entropy calculation** — Mathematically correct with proper 0.0–8.0 range
- **Risk classification** — Low/Medium/High/Critical based on entropy thresholds
- **Path analysis with cross-platform support** — Both Unix and Windows suspicious dirs defined
- **SHA-256 hashing** — Standard implementation with hex output
- **Good test coverage** — 12+ tests covering entropy math, hash verification, path detection, signature logic

---

## 🟠 High Issues

### 1. Linux Signature Verification is a Heuristic, Not Real Verification

**File:** `signature.rs:18-35`  
```rust
let is_system = path_str.starts_with("/usr/")
    || path_str.starts_with("/bin/")
    || path_str.starts_with("/sbin/");
```
**Issue:** This is NOT signature verification — it's just path checking. A malicious binary copied to `/usr/bin/` would be "signed" according to this logic. Real Linux verification would need:
- GPG signature checking via `gpgv`
- Package manager verification (`dpkg --verify`, `rpm -V`)
- Filesystem integrity (AIDE, OSSEC)

### 2. Windows Authenticode Not Implemented

**File:** `signature.rs:37-45`  
**Issue:** Returns `is_signed: None` on Windows. Missing Authenticode verification via WinVerifyTrust API or `cross-authenticode` crate.

### 3. macOS Codesign Not Implemented

**File:** `signature.rs:47-55`  
**Issue:** Returns `is_signed: None` on macOS. Could shell out to `codesign --verify` as a first step.

### 4. Hash Reads Entire File Into Memory

**File:** `hash.rs:16`  
```rust
let data = fs::read(path)?;
```
**Issue:** Reads entire file into memory. For large binaries (>1 GiB), this causes OOM. Should use streaming `Sha256::new()` with chunked reads from `BufReader`.

### 5. Entropy Also Reads Entire File Into Memory

**File:** `entropy.rs:44`  
Same issue as hash — `fs::read(path)` loads entire file. Should use buffered/streaming approach.

---

## 🟡 Medium Issues

### 6. No Module Enumeration

**File:** `Cargo.toml:7`  
**Issue:** Description says "module enumeration" but there's no implementation for reading shared library dependencies (equivalent to `ldd` on Linux or `dumpbin /dependents` on Windows).

### 7. SecurityAudit Has No Configurable Thresholds

**File:** `audit.rs:37`  
**Issue:** `SecurityAudit` is a unit struct with no configuration. Entropy thresholds are hardcoded in `EntropyRisk::from_entropy()`. No way to adjust what counts as "High" vs "Critical" for different deployments.

### 8. No Digital Certificate Chain Validation

**Issue:** Even when signature checking works, there's no trust chain validation — no checking against trusted root certificates.

### 9. path_analysis Downloads/Desktop Detection is Too Aggressive

**File:** `path_analysis.rs:64`  
```rust
if path_lower.contains("downloads") || path_lower.contains("desktop")
```
**Issue:** This matches ANY path containing "downloads" or "desktop", including legitimate paths like `/opt/app/desktop-renderer/bin` or `/var/lib/downloads-manager/daemon`.

### 10. AuditResult Has No Severity Score

**Issue:** `AuditResult` has `flag_count: u32` and `flags: Vec<String>` but no numeric severity score. The caller must count flags and interpret them manually.

### 11. No Virus Total / IOC Database Integration

**Issue:** SHA-256 hashes are computed but never checked against known-malicious hash databases (VirusTotal, MalwareBazaar, NSRL).

---

## ❌ Missing Implementations

| Feature | Status | Notes |
|---|---|---|
| Real Linux signature verification | ❌ | Path heuristic only |
| Windows Authenticode | ❌ | TODO stub |
| macOS codesign | ❌ | TODO stub |
| Module/library enumeration | ❌ | Described but missing |
| Streaming hash for large files | ❌ | Full file read |
| Streaming entropy for large files | ❌ | Full file read |
| Known-bad hash lookups | ❌ | No VirusTotal/IOC |
| Certificate chain validation | ❌ | Not planned |
| ELF/PE header analysis | ❌ | No binary format parsing |
| Configurable thresholds | ❌ | Hardcoded |
| Severity scoring | ❌ | Flag count only |
| File type detection (magic bytes) | ❌ | No implementation |

---

## 🧪 Test Coverage

| Area | Tested | Notes |
|---|---|---|
| Entropy of zeros | ✅ | Verified 0.0 |
| Entropy of random | ✅ | Verified ~8.0 |
| Entropy of text | ✅ | Verified 3-6 range |
| Risk classification | ✅ | All 4 levels |
| Empty data entropy | ✅ | Edge case |
| File entropy | ✅ | Real file I/O |
| SHA-256 known hash | ✅ | "hello world" verification |
| Missing file hash | ✅ | Error handling |
| Suspicious paths | ✅ | /tmp, /dev/shm, Downloads |
| Normal paths | ✅ | /usr/bin, /opt safe |
| Fileless process | ✅ | No exe path |
| System binary trust | ✅ | Linux only |
| Non-system binary | ✅ | Linux only |
| Large file handling | ❌ | OOM risk untested |
| Cross-platform signature | ❌ | Stubs only |
| SecurityAudit.audit() | ❌ | No integration test |
