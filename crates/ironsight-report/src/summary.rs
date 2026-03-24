use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanSummary {
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
    pub total_scanned: usize,
    pub threats_found: u32,
    pub critical_count: u32,
    pub high_count: u32,
    pub medium_count: u32,
}

impl ScanSummary {
    pub fn new(total_scanned: usize) -> Self {
        Self {
            start_time: Utc::now(),
            end_time: Utc::now(),
            total_scanned,
            threats_found: 0,
            critical_count: 0,
            high_count: 0,
            medium_count: 0,
        }
    }

    pub fn complete(&mut self) {
        self.end_time = Utc::now();
    }
    
    pub fn duration_ms(&self) -> i64 {
        self.end_time.timestamp_millis() - self.start_time.timestamp_millis()
    }
}
