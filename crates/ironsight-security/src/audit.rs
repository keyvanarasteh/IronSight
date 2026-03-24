//! SecurityAudit — orchestrates all security checks for a single process.

use std::path::PathBuf;

use serde::{Deserialize, Serialize};

use crate::entropy::EntropyResult;
use crate::hash::HashResult;
use crate::path_analysis::PathAnalysis;
use crate::signature::SignatureResult;

// ─────────────────────────────────────────────────────────────────────────────
// AuditResult
// ─────────────────────────────────────────────────────────────────────────────

/// Complete security audit result for a single process.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditResult {
    pub pid: u32,
    pub name: String,
    pub exe_path: Option<PathBuf>,
    pub hash: Option<HashResult>,
    pub entropy: Option<EntropyResult>,
    pub path_analysis: PathAnalysis,
    pub signature: Option<SignatureResult>,
    /// Number of security flags raised (0 = clean).
    pub flag_count: u32,
    /// Detailed flags found.
    pub flags: Vec<AuditFlag>,
    /// Calculated severity score.
    pub severity_score: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditFlag {
    pub name: String,
    pub severity: f64,
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

// ─────────────────────────────────────────────────────────────────────────────
// SecurityAudit
// ─────────────────────────────────────────────────────────────────────────────

pub struct SecurityAuditConfig {
    pub entropy_thresholds: EntropyThresholds,
    pub suspicious_dirs: Vec<String>,
    pub max_file_size: u64,
}

#[derive(Clone)]
pub struct EntropyThresholds {
    pub low: f64,
    pub medium: f64,
    pub high: f64,
    pub critical: f64,
}

impl Default for SecurityAuditConfig {
    fn default() -> Self {
        Self {
            entropy_thresholds: EntropyThresholds { low: 3.0, medium: 5.0, high: 6.5, critical: 7.5 },
            suspicious_dirs: vec![],
            max_file_size: 256 * 1024 * 1024,
        }
    }
}

pub struct SecurityAudit {
    config: SecurityAuditConfig,
}

impl SecurityAudit {
    pub fn new() -> Self {
        Self { config: SecurityAuditConfig::default() }
    }

    pub fn with_config(config: SecurityAuditConfig) -> Self { 
        Self { config } 
    }

    pub fn audit(&self, pid: u32, name: &str, exe_path: Option<&PathBuf>) -> AuditResult {
        let mut flags: Vec<AuditFlag> = Vec::new();

        // 1. Path analysis (works even without exe)
        let path_analysis = crate::path_analysis::analyze_path(exe_path.map(|p| p.as_path()));
        if path_analysis.is_suspicious {
            if let Some(ref reason) = path_analysis.reason {
                flags.push(AuditFlag {
                    name: "SuspiciousPath".into(),
                    severity: 30.0,
                    description: reason.clone(),
                });
            }
        }

        let (hash, entropy, signature) = if let Some(path) = exe_path {
            if path.exists() {
                let h = crate::hash::compute_sha256(path).ok();
                let e = crate::entropy::compute_entropy(path).ok();
                let s = Some(crate::signature::verify_signature(path));

                if let Some(ref ent) = e {
                    if ent.entropy >= self.config.entropy_thresholds.critical {
                        flags.push(AuditFlag {
                            name: "CriticalEntropy".into(),
                            severity: 70.0,
                            description: format!("Critical entropy ({:.2}) — likely encrypted/packed", ent.entropy),
                        });
                    } else if ent.entropy >= self.config.entropy_thresholds.high {
                        flags.push(AuditFlag {
                            name: "HighEntropy".into(),
                            severity: 40.0,
                            description: format!("High entropy ({:.2}) — possibly packed binary", ent.entropy),
                        });
                    }
                }

                if let Some(ref sig) = s {
                    if sig.is_signed == Some(false) {
                        flags.push(AuditFlag {
                            name: "UnsignedBinary".into(),
                            severity: 20.0,
                            description: "Unsigned binary".into(),
                        });
                    }
                }

                (h, e, s)
            } else {
                flags.push(AuditFlag {
                    name: "FileNotFound".into(),
                    severity: 10.0,
                    description: "Exe path exists but file not found on disk".into(),
                });
                (None, None, None)
            }
        } else {
            (None, None, None)
        };

        let mut res = AuditResult {
            pid,
            name: name.to_string(),
            exe_path: exe_path.cloned(),
            hash,
            entropy,
            path_analysis,
            signature,
            flag_count: flags.len() as u32,
            flags,
            severity_score: 0.0,
        };
        res.compute_severity();
        res
    }
}
