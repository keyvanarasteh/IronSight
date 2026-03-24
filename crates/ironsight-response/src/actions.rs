//! Response actions — the core operations that can be performed on a process.
//!
//! Follows the forensic order: **Suspend → Dump → Kill**.

use serde::{Deserialize, Serialize};

/// Result of an attempted response action.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionResult {
    pub pid: u32,
    pub action: ActionType,
    pub success: bool,
    pub message: String,
    pub timestamp: String,
}

/// Types of automated response actions.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ActionType {
    /// SIGSTOP — freeze the process.
    Suspend,
    /// SIGCONT — resume a suspended process.
    Resume,
    /// Dump process memory to disk for forensics.
    MemoryDump,
    /// SIGKILL — terminate the process.
    Kill,
    /// Full forensic sequence — suspend, dump, kill.
    SuspendDumpKill,
    /// Log the event for later review.
    LogOnly,
}

/// Suspend a process (SIGSTOP).
#[cfg(unix)]
pub fn suspend(pid: u32) -> ActionResult {
    use nix::sys::signal::{kill, Signal};
    use nix::unistd::Pid;

    let result = kill(Pid::from_raw(pid as i32), Signal::SIGSTOP);
    let now = timestamp_now();

    match result {
        Ok(()) => ActionResult {
            pid,
            action: ActionType::Suspend,
            success: true,
            message: format!("Process {pid} suspended (SIGSTOP)"),
            timestamp: now,
        },
        Err(e) => ActionResult {
            pid,
            action: ActionType::Suspend,
            success: false,
            message: format!("Failed to suspend PID {pid}: {e}"),
            timestamp: now,
        },
    }
}

/// Resume a suspended process (SIGCONT).
#[cfg(unix)]
pub fn resume(pid: u32) -> ActionResult {
    use nix::sys::signal::{kill, Signal};
    use nix::unistd::Pid;

    let result = kill(Pid::from_raw(pid as i32), Signal::SIGCONT);
    let now = timestamp_now();

    match result {
        Ok(()) => ActionResult {
            pid,
            action: ActionType::Resume,
            success: true,
            message: format!("Process {pid} resumed (SIGCONT)"),
            timestamp: now,
        },
        Err(e) => ActionResult {
            pid,
            action: ActionType::Resume,
            success: false,
            message: format!("Failed to resume PID {pid}: {e}"),
            timestamp: now,
        },
    }
}

/// Kill a process (SIGKILL).
#[cfg(unix)]
pub fn kill_process(pid: u32) -> ActionResult {
    use nix::sys::signal::{kill, Signal};
    use nix::unistd::Pid;

    let result = kill(Pid::from_raw(pid as i32), Signal::SIGKILL);
    let now = timestamp_now();

    match result {
        Ok(()) => ActionResult {
            pid,
            action: ActionType::Kill,
            success: true,
            message: format!("Process {pid} killed (SIGKILL)"),
            timestamp: now,
        },
        Err(e) => ActionResult {
            pid,
            action: ActionType::Kill,
            success: false,
            message: format!("Failed to kill PID {pid}: {e}"),
            timestamp: now,
        },
    }
}

/// Dump process memory to a file for forensic analysis.
#[cfg(target_os = "linux")]
pub fn dump_memory(pid: u32, output_dir: &str) -> ActionResult {
    let now = timestamp_now();
    let out_path = std::path::Path::new(output_dir);
    
    match ironsight_memory::dump_memory(pid, out_path) {
        Ok((dump_path, regions_dumped, total_bytes)) => ActionResult {
            pid,
            action: ActionType::MemoryDump,
            success: true,
            message: format!(
                "Dumped {regions_dumped} regions ({} bytes) to {}",
                total_bytes, dump_path.display()
            ),
            timestamp: now,
        },
        Err(e) => ActionResult {
            pid,
            action: ActionType::MemoryDump,
            success: false,
            message: format!("Failed to dump memory: {e}"),
            timestamp: now,
        }
    }
}

#[cfg(not(target_os = "linux"))]
pub fn dump_memory(pid: u32, _output_dir: &str) -> ActionResult {
    ActionResult {
        pid,
        action: ActionType::MemoryDump,
        success: false,
        message: "Memory dump is only supported on Linux".to_string(),
        timestamp: timestamp_now(),
    }
}

#[cfg(not(unix))]
pub fn suspend(pid: u32) -> ActionResult {
    ActionResult {
        pid,
        action: ActionType::Suspend,
        success: false,
        message: "Suspend is only supported on Unix".to_string(),
        timestamp: timestamp_now(),
    }
}

#[cfg(not(unix))]
pub fn resume(pid: u32) -> ActionResult {
    ActionResult {
        pid,
        action: ActionType::Resume,
        success: false,
        message: "Resume is only supported on Unix".to_string(),
        timestamp: timestamp_now(),
    }
}

#[cfg(not(unix))]
pub fn kill_process(pid: u32) -> ActionResult {
    ActionResult {
        pid,
        action: ActionType::Kill,
        success: false,
        message: "Kill is only supported on Unix".to_string(),
        timestamp: timestamp_now(),
    }
}

fn timestamp_now() -> String {
    chrono::Utc::now().format("%Y-%m-%dT%H:%M:%S%.3fZ").to_string()
}

#[cfg(unix)]
pub fn verify_process_exists(pid: u32) -> bool {
    use nix::sys::signal::kill;
    use nix::unistd::Pid;
    match kill(Pid::from_raw(pid as i32), None) {
        Ok(_) => true,
        Err(nix::errno::Errno::ESRCH) => false,
        Err(_) => true, // Other errors like EPERM indicate the process exists but is inaccessible
    }
}

#[cfg(not(unix))]
pub fn verify_process_exists(_pid: u32) -> bool {
    true
}


