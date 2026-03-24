# Contributing to IronSight

Welcome! IronSight is an open-source EDR (Endpoint Detection & Response) system built in Rust. We appreciate contributions of all kinds.

## Quick Links

- **GitHub:** https://github.com/keyvanarasteh/IronSight
- **Vision:** [`VISION.md`](VISION.md)
- **Security:** [`SECURITY.md`](SECURITY.md)

## Maintainers

- **Keyvan Arasteh** — Project Lead
  - GitHub: [@keyvanarasteh](https://github.com/keyvanarasteh)
  - Affiliation: İstinye University

## How to Contribute

1. **Bugs & small fixes** → Open a PR directly
2. **New features / architecture changes** → Open an issue first to discuss the design
3. **Documentation** → Always welcome, no issue needed
4. **Security vulnerabilities** → See [SECURITY.md](SECURITY.md) for responsible disclosure

## Before You PR

- Build and test locally:
  ```bash
  cargo build --workspace
  cargo test --workspace
  cargo clippy --workspace -- -D warnings
  cargo fmt --all -- --check
  ```
- Ensure CI checks pass
- Keep PRs focused — one feature or fix per PR; do not mix unrelated changes
- Describe **what** changed and **why**
- Include test output or screenshots for UI/behavioral changes

## Development Setup

### Prerequisites

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **Rust** | 1.82.0 | nightly (edition 2024) |
| **Cargo** | Included with Rust | — |
| **Git** | 2.0+ | Latest |

### Platform-Specific Dependencies

**Linux (Debian/Ubuntu):**
```bash
sudo apt install -y build-essential pkg-config libssl-dev cmake
# Optional (eBPF/kernel module):
sudo apt install -y clang llvm libbpf-dev linux-headers-$(uname -r)
```

**macOS:**
```bash
xcode-select --install
brew install openssl@3 pkg-config cmake
```

**Windows:**
- Visual Studio Build Tools with "Desktop development with C++" workload
- `choco install git cmake openssl`

### Building

```bash
# Full workspace build
cargo build --workspace

# Release build (service binary only)
cargo build --release --package ironsight-service

# Run tests
cargo test --workspace

# Lint
cargo clippy --workspace -- -D warnings

# Format
cargo fmt --all
```

## Project Structure

```
crates/
├── ironsight-core       # Process spy, snapshot, control
├── ironsight-heuristic  # Threat scoring, decay engine
├── ironsight-kernel     # eBPF/ETW kernel monitoring (🚧 WIP)
├── ironsight-memory     # /proc/PID/maps, W^X detection
├── ironsight-network    # Socket mapping, DNS enrichment
├── ironsight-report     # Incident reports, SIEM export
├── ironsight-response   # Suspend → Dump → Kill pipeline
├── ironsight-security   # Hash, entropy, signature audit
├── ironsight-service    # Main orchestrator, config, CLI
└── ironsight-ui         # Dioxus/Tauri desktop dashboard (🚧 WIP)
```

### Crate Status

| Crate | Status | Notes |
|-------|--------|-------|
| `ironsight-core` | ✅ Stable | Core process monitoring |
| `ironsight-heuristic` | ✅ Stable | Scoring and decay engine |
| `ironsight-memory` | ✅ Stable | Memory forensics |
| `ironsight-network` | ✅ Stable | Network analysis |
| `ironsight-report` | ✅ Stable | Reporting and SIEM export |
| `ironsight-response` | ✅ Stable | Automated response pipeline |
| `ironsight-security` | ✅ Stable | Binary security analysis |
| `ironsight-service` | ✅ Stable | CLI orchestrator |
| `ironsight-kernel` | 🚧 WIP | eBPF/ETW implementation in progress |
| `ironsight-ui` | 🚧 WIP | Dioxus desktop dashboard |

## Coding Guidelines

- **Language:** Rust (Edition 2024). Use strict typing; avoid `unsafe` unless absolutely necessary and document the reason.
- **Error handling:** Use `thiserror` for library errors, `anyhow` for application-level errors in the service crate.
- **Logging:** Use `tracing` macros (`info!`, `warn!`, `error!`, `debug!`, `trace!`). Add context with structured fields.
- **Dependencies:** Prefer workspace-level dependencies in the root `Cargo.toml`. Do not add per-crate duplicates.
- **Tests:** Place unit tests in the same file (`#[cfg(test)]` module). Integration tests go in `tests/` directories.
- **Cross-platform:** Always consider Linux, macOS, and Windows. Use `cfg(target_os)` gates where platform-specific code is needed.
- **Documentation:** Document public APIs with `///` doc comments. Include examples where helpful.

## Commit Messages

Follow concise, action-oriented commit messages:

```
core: add CPU spike detection to process snapshot
heuristic: fix decay calculation for idle processes
security: implement macOS code signature verification
```

Format: `<crate>: <action> <description>`

## AI-Assisted PRs Welcome! 🤖

Built with AI tools? Great — just be transparent:

- Mark as AI-assisted in the PR description
- Note the degree of testing (untested / lightly tested / fully tested)
- Confirm you understand what the code does

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold a welcoming, inclusive community.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
