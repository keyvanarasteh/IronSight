//! Peer watchdog — two processes monitor each other.
//!
//! Anti-tamper pattern: advanced malware kills security tools first.
//! The watchdog spawns a sentinel process that monitors the main process.
//! If either dies, the survivor restarts the other.

use std::process::Command;
use std::time::{Duration, Instant};



/// Check if a PID is still alive.
pub fn is_pid_alive(pid: u32) -> bool {
    #[cfg(unix)]
    {
        // kill(pid, 0) checks existence without sending a signal
        nix::sys::signal::kill(
            nix::unistd::Pid::from_raw(pid as i32),
            None, // Signal 0 = existence check
        )
        .is_ok()
    }
    #[cfg(not(unix))]
    {
        let _ = pid;
        false
    }
}

/// Spawn a sentinel process that monitors the given PID.
pub fn spawn_sentinel(main_pid: u32, check_interval: Duration) -> Result<u32, std::io::Error> {
    let exe = std::env::current_exe()?;
    let child = Command::new(exe)
        .arg("--watchdog-sentinel")
        .arg("--watch-pid")
        .arg(main_pid.to_string())
        .arg("--watch-interval")
        .arg(check_interval.as_secs().to_string())
        .spawn()?;
    Ok(child.id())
}

/// Run the sentinel loop — monitors a peer PID and restarts it if dead.
/// This is the entry point when `--watchdog-sentinel` is passed.
pub fn run_sentinel_loop(mut watch_pid: u32, interval: Duration, max_restarts: u32) {
    tracing::info!(
        "🐕 Watchdog sentinel started — monitoring PID {watch_pid} every {}s",
        interval.as_secs()
    );

    let mut restarts = 0u32;
    let mut last_alive = Instant::now();

    loop {
        std::thread::sleep(interval);

        if is_pid_alive(watch_pid) {
            last_alive = Instant::now();
            tracing::debug!("Watchdog: PID {watch_pid} alive");
        } else {
            let dead_duration = last_alive.elapsed();
            tracing::warn!(
                "🚨 Watchdog: PID {watch_pid} is DEAD (missing for {:.1}s)",
                dead_duration.as_secs_f64()
            );

            if restarts >= max_restarts {
                tracing::error!(
                    "Watchdog: Max restarts ({max_restarts}) exceeded — giving up"
                );
                break;
            }

            // Attempt restart
            match restart_main_process() {
                Ok(new_pid) => {
                    restarts += 1;
                    tracing::info!(
                        "Watchdog: Restarted main process as PID {new_pid} (restart #{restarts})"
                    );
                    // Continue monitoring the new PID
                    watch_pid = new_pid;
                    last_alive = Instant::now();
                }
                Err(e) => {
                    tracing::error!("Watchdog: Failed to restart: {e}");
                    break;
                }
            }
        }
    }
}

/// Restart the main IronSight process.
fn restart_main_process() -> Result<u32, std::io::Error> {
    let exe = std::env::current_exe()?;
    let child = Command::new(exe).spawn()?;
    Ok(child.id())
}



#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn own_pid_is_alive() {
        let pid = std::process::id();
        assert!(is_pid_alive(pid));
    }

    #[test]
    fn dead_pid_is_not_alive() {
        // PID 99999999 almost certainly doesn't exist
        assert!(!is_pid_alive(99_999_999));
    }


}
