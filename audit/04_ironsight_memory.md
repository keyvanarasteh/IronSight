# ironsight-memory — Deep Audit Report

**Description:** Memory analysis — pattern scanning, region watching, protection change detection  
**Dependencies:** ironsight-core, serde, regex, xxhash-rust, tracing, thiserror  
**Files:** lib.rs, maps.rs, scanner.rs, watcher.rs

---

## ✅ What Works Well

- **Solid /proc/PID/maps parser** — Handles all fields correctly including hex addresses, permissions, device, inode, pathname
- **W^X violation detection** — Correctly identifies writable+executable regions (classic shellcode indicator)
- **Anonymous executable detection** — Flags anonymous mappings with execute permission
- **Memory watcher diff engine** — Detects added, removed, permission-changed, and size-changed regions
- **Pattern scanner** — 14 suspicious patterns covering shells, download tools, C2 beacons, credential exposure
- **Good test coverage** — 15+ tests with sample maps data and mock regions

---

## 🟠 High Issues

### 1. Memory Scanner Can Cause OOM

**File:** `scanner.rs:119`  
```rust
let mut buf = vec![0u8; region.size() as usize];
```
**Issue:** Allocates entire region into memory (up to 64 MiB per region). With many regions, this can exhaust memory. Scanning /proc/PID/mem should use buffered reads.

**Fix Required:** Use chunked reading with a fixed buffer (e.g., 4 MiB chunks).

### 2. Memory Scanner Has No Error Reporting

**File:** `scanner.rs:79-129`  
**Issue:** `scan_process()` silently swallows all errors via `continue`. If /proc/PID/mem is unreadable, the caller gets an empty `Vec` with no indication of failure.

**Fix Required:** Return `Result<Vec<PatternMatch>, MemoryError>` or at minimum, return partial results with an error count.

### 3. xxhash-rust Dependency Unused

**File:** `Cargo.toml:13`  
**Issue:** `xxhash-rust = { version = "0.8", features = ["xxh3"] }` is declared as a dependency but never used anywhere in the crate.

### 4. MemorySummary Not Connected to Scanner

**Issue:** `MemorySummary` reports `flags` but `pattern_matches` count from the scanner is not included. These two subsystems operate independently.

### 5. Watcher Has No Continuous Mode

**Issue:** `diff_regions()` is a one-shot comparison. There's no continuous watcher that periodically polls and emits events (like `ProcessSpy::start_monitoring()` in core).

---

## 🟡 Medium Issues

### 6. Maps Parser Uses splitn with Whitespace

**File:** `maps.rs:104`  
```rust
let parts: Vec<&str> = line.splitn(6, char::is_whitespace).collect();
```
**Issue:** `/proc/PID/maps` uses spaces (not tabs) as delimiters, and there may be multiple spaces between fields. `splitn` with `char::is_whitespace` handles this correctly, but `parts.len() < 5` check loses information if pathname contains spaces.

### 7. No Entropy Calculation Per Region

**Issue:** The memory crate can scan for patterns but doesn't compute entropy per memory region. High-entropy anonymous executable regions are a strong indicator of encrypted shellcode.

### 8. No Memory Region Hashing

**Issue:** No xxhash or other hash computation per region to detect modifications between scans. The `xxhash-rust` dependency is declared but unused.

### 9. SuspiciousPatterns Not Extensible

**File:** `scanner.rs:21-41`  
**Issue:** `SuspiciousPatterns::patterns()` returns a hardcoded `Vec`. No way to:
- Add custom patterns from config
- Disable specific patterns
- Load YARA-style rules

### 10. Non-Linux Platforms Return Empty Results

**Files:** `maps.rs:94-97`, `scanner.rs:131-134`  
**Issue:** Both `read_maps()` and `scan_process()` return empty results on non-Linux platforms. This is documented behavior but the caller has no way to distinguish "nothing suspicious" from "not supported."

### 11. format_context Could Leak Sensitive Data

**File:** `scanner.rs:137-143`  
**Issue:** The context string includes raw hex + ASCII of surrounding bytes, which could contain passwords or keys. Context should be truncated or redacted in non-forensic mode.

---

## ❌ Missing Implementations

| Feature | Status | Notes |
|---|---|---|
| Continuous memory watcher | ❌ | Only one-shot diff |
| Buffered memory reading | ❌ | Full region allocation |
| Per-region entropy | ❌ | Not computed |
| Per-region hashing | ❌ | xxhash unused |
| Custom pattern loading | ❌ | Hardcoded patterns |
| YARA rule support | ❌ | Not planned |
| Windows memory reading | ❌ | Returns empty |
| macOS memory reading | ❌ | Returns empty |
| Memory dump integration | ❌ | No connection to response crate |
| Region change events | ❌ | No event channel |

---

## 🧪 Test Coverage

| Area | Tested | Notes |
|---|---|---|
| Maps parsing | ✅ | 7 tests with sample data |
| W^X detection | ✅ | Verified |
| Heap/Stack detection | ✅ | Verified |
| Summary flags | ✅ | W^X flags |
| Permission string | ✅ | Round-trip test |
| Pattern scanning | ✅ | Shell, password, clean buffer |
| Context formatting | ✅ | Hex + ASCII |
| Region diff (add) | ✅ | New region detection |
| Region diff (remove) | ✅ | Removed region detection |
| Permission change | ✅ | Suspicious permission escalation |
| Size change | ✅ | Heap growth detection |
| No changes | ✅ | Identical regions |
| Continuous scanning | ❌ | No continuous mode |
| OOM safety | ❌ | Not tested |
| Error handling | ❌ | Silent failures untested |
