# ironsight-report — Deep Audit Report

**Description:** SIEM-ready reporting — JSON schema, Splunk HEC, Microsoft Sentinel export  
**Dependencies:** ironsight-core, serde, serde_json, chrono, uuid, whoami, tracing, thiserror  
**Files:** lib.rs, incident.rs, formatter.rs

---

## ✅ What Works Well

- **Clean incident report schema** — Comprehensive `IncidentReport` struct with process, threat, security, network, and memory info
- **UUID-based report IDs** — Each report gets a unique identifier
- **Dual format output** — Pretty JSON for humans, compact JSON for SIEM ingestion
- **Human-readable text report** — Well-formatted ASCII art with sections, emojis, and clear layout
- **JSON round-trip tested** — Serialization/deserialization verified
- **File saving** — `save_json()` writes reports to disk

---

## 🟠 High Issues

### 1. No Splunk HEC Export (Described but Missing)

**File:** `Cargo.toml:7`  
**Issue:** Description says "Splunk HEC, Microsoft Sentinel export" but:
- `reqwest` is in workspace deps but NOT in this crate's deps
- No HTTP client code exists
- No Splunk HEC endpoint integration
- No Microsoft Sentinel webhook

**This is a significant gap between documentation and implementation.**

### 2. Incident Report Uses String-Based Types

**File:** `incident.rs:56-71`  
**Issue:** Several fields use raw `String` instead of typed enums:
```rust
pub level: String,              // Should be ThreatLevel enum
pub recommended_action: String, // Should be RecommendedAction enum
pub category: String,           // Should be SignalCategory enum
```
This prevents compile-time validation and allows typos.

### 3. IncidentReport::ProcessInfo Duplicates ironsight-core::ProcessInfo

**File:** `incident.rs:43-54`  
**Issue:** `ironsight_report::incident::ProcessInfo` is a near-copy of `ironsight_core::ProcessInfo` but with different types (e.g., `exe_path: Option<String>` vs `exe: Option<PathBuf>`). No `From` conversion exists.

### 4. No Report Aggregation

**Issue:** Reports are per-process only. No system-level summary report combining all threat assessments into a single output.

### 5. Report Has No Schema Version

**Issue:** No `schema_version` field in `IncidentReport`. If the format changes, SIEM parsers will break with no way to handle versioning.

---

## 🟡 Medium Issues

### 6. save_json Returns Box<dyn Error>

**File:** `formatter.rs:161`  
**Issue:** `save_json()` returns `Box<dyn std::error::Error>` instead of a typed error. Other crates use `thiserror` but this function doesn't.

### 7. Text Formatter Has Integer Division for Memory

**File:** `formatter.rs:42`  
```rust
report.process.memory_bytes / (1024 * 1024)
```
**Issue:** Integer division truncates. 500 KB shows as "0 MiB". Should format bytes properly or use float division.

### 8. No CSV/XML Export

**Issue:** Only JSON and text formats supported. Many SIEM tools accept CSV, Syslog (CEF), or XML.

### 9. ActionInfo Timestamp is String

**File:** `incident.rs:106`  
**Issue:** `timestamp: String` should be `DateTime<Utc>` for proper serialization control.

### 10. No Report Signing

**Issue:** Reports have no integrity verification. A tampered report file cannot be detected.

---

## ❌ Missing Implementations

| Feature | Status | Notes |
|---|---|---|
| Splunk HEC export | ❌ | Described but not built |
| Microsoft Sentinel export | ❌ | Described but not built |
| Syslog CEF format | ❌ | Common SIEM format |
| CSV export | ❌ | Spreadsheet compatibility |
| Schema versioning | ❌ | No version field |
| Report aggregation | ❌ | No system summary |
| Report signing/integrity | ❌ | No tamper detection |
| Report encryption | ❌ | Sensitive data unprotected |
| Typed enum fields | ❌ | String-based types |
| Streaming output | ❌ | All in-memory |
| Report retention policy | ❌ | No cleanup |

---

## 🧪 Test Coverage

| Area | Tested | Notes |
|---|---|---|
| JSON serialization | ✅ | Round-trip test |
| Compact JSON | ✅ | Single-line verified |
| Text report sections | ✅ | All sections present |
| Signal display | ✅ | Signal names in text |
| File saving | ✅ | Write and read back |
| Edge cases (empty) | ❌ | Empty report not tested |
| Large reports | ❌ | Performance not tested |
| SIEM integration | ❌ | No integration tests |
