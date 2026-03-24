# IronSightPro AI & Copilot Developer Instructions

Welcome AI Assistant. When generating code for IronSightPro, please adhere strictly to these architectural guidelines and coding standards.

## Project Context
IronSightPro is a robust, modular Endpoint Detection & Response (EDR) system built in Rust 2024.
The workspace consists of 10 primary crates, each with a specialized role:

- `ironsight-core`: Process spy, snapshotting, and process control.
- `ironsight-heuristic`: Threat scoring, weighted analysis, and decay engine.
- `ironsight-kernel`: eBPF (Linux) and ETW (Windows) kernel monitoring.
- `ironsight-memory`: Memory forensics (/proc/PID/maps, W^X detection, thread stomping).
- `ironsight-network`: Socket mapping and DNS enrichment.
- `ironsight-report`: Incident reports and SIEM (Splunk HEC, Syslog) export.
- `ironsight-response`: Mitigation pipeline (Suspend → Dump → Kill).
- `ironsight-security`: Binary analysis, hashing (SHA-256), entropy, and signature audits.
- `ironsight-service`: The main orchestrator, configuration loader, and CLI.
- `ironsight-ui`: Dioxus/Tauri-based cross-platform desktop dashboard.

## Code Standards
- **Edition:** Rust 2024. Use new syntax where applicable.
- **Safety:** Avoid `unsafe` blocks unless interfacing with FFI, eBPF, or low-level OS APIs. If `unsafe` is used, it MUST be accompanied by a `// SAFETY: ...` comment.
- **Errors:**
  - Library crates (`core`, `security`, `network`, etc.): Use `thiserror` to define precise error enums.
  - Binaries / Service (`service`, `ui`): Use `anyhow` for top-level bubbling and context.
- **Logging:** Use the `tracing` ecosystem (`info!`, `warn!`, `error!`, `debug!`, `trace!`). Provide structured fields for context (e.g., `info!(pid = pid, "process opened")`).
- **Dependencies:** Never add a dependency to an individual crate's `Cargo.toml` if it's broadly applicable. Instead, define it in the `[workspace.dependencies]` block in the root `Cargo.toml` and reference it (e.g., `tokio = { workspace = true }`).

## Cross-Platform Constraints
The EDR targets Windows, macOS, and Linux.
- Conditionally compile OS-specific logic using `#[cfg(target_os = "...")]`.
- Do not make assumptions about default paths (e.g., `/etc` vs `C:\Windows`) unless explicitly scoped by a `cfg` attribute.
- Prefer cross-platform abstractions (like the `nix` crate where applicable for Unix) and explicitly encapsulate OS-specific syscalls.

## Workflow Commands
To build, test, and vet the workspace, advise the user to run:
- **Build:** `cargo build --workspace`
- **Test:** `cargo test --workspace`
- **Lint:** `cargo clippy --workspace --all-targets -- -D warnings`
- **Format:** `cargo fmt --all -- --check`
