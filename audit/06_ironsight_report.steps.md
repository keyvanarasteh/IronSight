# ironsight-report — Implementation Steps

> Audit: [06_ironsight_report.md](06_ironsight_report.md) · 10 Issues (5 High, 5 Medium)

---

## STEP 1: Splunk HEC Export _(High #1)_

**Dosya:** `crates/ironsight-report/src/siem.rs` [YENİ]

### Bağımlılık Ekle
```toml
reqwest = { workspace = true }
tokio = { workspace = true }
```

### Ne Yapılacak
```rust
pub struct SplunkExporter {
    endpoint: String,
    token: String,
    client: reqwest::Client,
    timeout: Duration,
}

impl SplunkExporter {
    pub fn new(endpoint: &str, token: &str) -> Self {
        Self {
            endpoint: endpoint.to_string(),
            token: token.to_string(),
            client: reqwest::Client::new(),
            timeout: Duration::from_secs(10),
        }
    }

    pub async fn send(&self, report: &IncidentReport) -> Result<()> {
        let payload = serde_json::json!({
            "event": report,
            "sourcetype": "ironsight:incident",
            "source": "ironsight-edr",
            "time": report.timestamp.timestamp(),
        });
        
        self.client.post(&self.endpoint)
            .header("Authorization", format!("Splunk {}", self.token))
            .json(&payload)
            .timeout(self.timeout)
            .send()
            .await?
            .error_for_status()?;
        Ok(())
    }
}
```

### Test
```rust
#[tokio::test]
async fn test_splunk_payload_format() {
    let report = test_report();
    let payload = SplunkExporter::format_payload(&report);
    assert!(payload["event"]["process"]["pid"].is_number());
    assert_eq!(payload["sourcetype"], "ironsight:incident");
}
```

---

## STEP 2: Typed Enum Fields _(High #2)_

**Dosya:** `crates/ironsight-report/src/incident.rs`

### Ne Yapılacak
```rust
// ÖNCE:
pub level: String,
pub recommended_action: String,

// SONRA:
pub level: ThreatLevel,
pub recommended_action: RecommendedAction,

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RecommendedAction {
    None,
    LogOnly,
    Monitor,
    Suspend,
    SuspendDumpKill,
    Isolate,
}
```

---

## STEP 3: Schema Versioning _(High #5)_

```rust
pub struct IncidentReport {
    pub schema_version: String,  // "1.0.0"
    // ... mevcut alanlar
}

impl Default for IncidentReport {
    fn default() -> Self {
        Self {
            schema_version: "1.0.0".to_string(),
            ..
        }
    }
}
```

---

## STEP 4: Report Aggregation _(High #4)_

**Dosya:** `crates/ironsight-report/src/summary.rs` [YENİ]

```rust
pub struct ScanSummary {
    pub scan_id: Uuid,
    pub timestamp: DateTime<Utc>,
    pub total_processes: usize,
    pub threats_by_level: HashMap<ThreatLevel, usize>,
    pub top_threats: Vec<IncidentReport>,
    pub system_info: SystemInfo,
    pub scan_duration: Duration,
}

impl ScanSummary {
    pub fn from_reports(reports: Vec<IncidentReport>, info: SystemInfo) -> Self { ... }
}
```

---

## STEP 5: ProcessInfo From Conversion _(High #3)_

```rust
impl From<ironsight_core::ProcessInfo> for incident::ProcessInfo {
    fn from(p: ironsight_core::ProcessInfo) -> Self {
        Self {
            pid: p.pid,
            name: p.name,
            exe_path: p.exe.map(|e| e.to_string_lossy().to_string()),
            cmd: p.cmd.join(" "),
            cpu_usage: p.cpu,
            memory_bytes: p.memory,
        }
    }
}
```

---

## STEP 6: Typed Error + Memory Format _(Medium #6-7)_

```rust
// Typed error
#[derive(thiserror::Error, Debug)]
pub enum ReportError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
    #[error("SIEM export failed: {0}")]
    SiemExport(String),
}

// Memory format
fn format_memory(bytes: u64) -> String {
    match bytes {
        b if b >= 1_073_741_824 => format!("{:.1} GiB", b as f64 / 1_073_741_824.0),
        b if b >= 1_048_576 => format!("{:.1} MiB", b as f64 / 1_048_576.0),
        b if b >= 1024 => format!("{:.1} KiB", b as f64 / 1024.0),
        b => format!("{b} B"),
    }
}
```

---

## STEP 7: Syslog CEF Format _(Medium #8)_

**Dosya:** `crates/ironsight-report/src/formatter.rs`

```rust
pub fn to_cef(report: &IncidentReport) -> String {
    format!(
        "CEF:0|IronSight|EDR|1.0|{}|{}|{}|pid={} name={} score={}",
        report.threat.level,
        report.process.name,
        severity_to_cef(report.threat.raw_score),
        report.process.pid,
        report.process.name,
        report.threat.raw_score,
    )
}
```

---

## Doğrulama Planı

```bash
cargo test --package ironsight-report
cargo test --package ironsight-report -- siem::tests
cargo test --package ironsight-report -- summary::tests
```
