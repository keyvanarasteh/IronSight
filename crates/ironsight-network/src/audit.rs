//! Network audit — combines socket mapping, DNS enrichment, and suspicious port detection
//! into a comprehensive network posture report.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::VecDeque;

use crate::dns::{AsyncDnsResolver, DnsEntry, PortIntel, port_intel};
use crate::socket_mapper::{self, SocketInfo, SocketMapper};

/// Full network audit result.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkAudit {
    pub total_sockets: usize,
    pub listeners: Vec<ListenerInfo>,
    pub suspicious_connections: Vec<SuspiciousConnection>,
    pub external_connections: Vec<ExternalConnection>,
    pub flag_count: u32,
    pub flags: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ListenerInfo {
    pub port: u16,
    pub protocol: crate::socket_mapper::Protocol,
    pub pid: Option<u32>,
    pub process_name: Option<String>,
    pub bind_address: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SuspiciousConnection {
    pub socket: SocketInfo,
    pub intel: PortIntel,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExternalConnection {
    pub socket: SocketInfo,
    pub dns: DnsEntry,
}

pub struct NetworkAuditCache {
    sockets: Vec<SocketInfo>,
    scanned_at: DateTime<Utc>,
}

impl NetworkAuditCache {
    pub fn scan_all() -> Self {
        let sockets = SocketMapper::scan();
        Self {
            sockets,
            scanned_at: Utc::now(),
        }
    }

    pub fn get_for_pid(&self, pid: u32) -> Vec<SocketInfo> {
        self.sockets
            .iter()
            .filter(|s| s.pid == Some(pid))
            .cloned()
            .collect()
    }

    pub fn is_stale(&self, max_age: std::time::Duration) -> bool {
        Utc::now() - self.scanned_at > chrono::Duration::from_std(max_age).unwrap()
    }
}

pub struct ConnectionTimeline {
    snapshots: VecDeque<(DateTime<Utc>, Vec<SocketInfo>)>,
    max_history: usize,
}

impl ConnectionTimeline {
    pub fn new(max_history: usize) -> Self {
        Self {
            snapshots: VecDeque::new(),
            max_history,
        }
    }

    pub fn record(&mut self, entries: Vec<SocketInfo>) {
        if self.snapshots.len() >= self.max_history {
            self.snapshots.pop_front();
        }
        self.snapshots.push_back((Utc::now(), entries));
    }

    pub fn new_connections_since(&self, _since: DateTime<Utc>) -> Vec<SocketInfo> {
        let mut new_conns: Vec<SocketInfo> = Vec::new();
        // Return connections present in newer snapshots but excluded in older ones
        // Simplified mockup implementation for tracking purposes.
        if let Some((_, latest)) = self.snapshots.back() {
            new_conns = latest.clone();
        }
        new_conns
    }
}

impl NetworkAudit {
    pub async fn scan_async_pid(
        target_pid: u32,
        cache: &NetworkAuditCache,
        resolver: &mut AsyncDnsResolver,
    ) -> Self {
        let pid_sockets = cache.get_for_pid(target_pid);
        let mut flags: Vec<String> = Vec::new();

        let listeners: Vec<ListenerInfo> = socket_mapper::listeners(&pid_sockets)
            .into_iter()
            .map(|s| ListenerInfo {
                port: s.local_port,
                protocol: s.protocol,
                pid: s.pid,
                process_name: s.process_name.clone(),
                bind_address: s.local_addr.to_string(),
            })
            .collect();

        let mut suspicious_connections = Vec::new();
        for sock in &pid_sockets {
            if let Some(intel) = port_intel(sock.remote_port) {
                flags.push(format!(
                    "PID {} connecting to suspicious port {} ({})",
                    target_pid, sock.remote_port, intel.service
                ));
                suspicious_connections.push(SuspiciousConnection {
                    socket: sock.clone(),
                    intel,
                });
            }
        }

        let mut external_connections = Vec::new();
        for s in socket_mapper::established(&pid_sockets) {
            let dns = resolver.lookup_entry(s.remote_addr).await;
            if !dns.is_private {
                external_connections.push(ExternalConnection {
                    socket: s.clone(),
                    dns,
                });
            }
        }

        let total = pid_sockets.len();

        NetworkAudit {
            total_sockets: total,
            listeners,
            suspicious_connections,
            external_connections,
            flag_count: flags.len() as u32,
            flags,
        }
    }
}
