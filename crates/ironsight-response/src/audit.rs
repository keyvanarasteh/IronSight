use std::path::{Path, PathBuf};
use std::fs::OpenOptions;
use std::io::Write;
use chrono::{DateTime, Utc};
use serde::Serialize;
use crate::actions::ActionType;

pub struct ActionAuditLog {
    entries: Vec<AuditEntry>,
    file_path: PathBuf,
}

#[derive(Debug, Clone, Serialize)]
pub struct AuditEntry {
    pub timestamp: DateTime<Utc>,
    pub pid: u32,
    pub process_name: String,
    pub action: ActionType,
    pub result: String,
    pub operator: String,
}

impl ActionAuditLog {
    pub fn new<P: AsRef<Path>>(path: P) -> Self {
        Self {
            entries: Vec::new(),
            file_path: path.as_ref().to_path_buf(),
        }
    }

    pub fn log_action(&mut self, entry: AuditEntry) -> std::io::Result<()> {
        self.entries.push(entry.clone());
        if let Some(parent) = self.file_path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let mut file = OpenOptions::new()
            .append(true)
            .create(true)
            .open(&self.file_path)?;
        writeln!(file, "{}", serde_json::to_string(&entry)?)?;
        Ok(())
    }
}
