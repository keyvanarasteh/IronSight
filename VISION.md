# IronSight — Vision

## Mission

IronSight aims to be a **production-grade, open-source Endpoint Detection & Response (EDR) system** built entirely in Rust. It provides real-time process monitoring, behavioral threat analysis, memory forensics, network intelligence, and automated response — all in a single, modular binary.

## Core Principles

- **Memory Safety First** — Rust's ownership model eliminates entire classes of vulnerabilities (buffer overflows, use-after-free, data races) that plague traditional security tooling.
- **Modular Architecture** — Each detection capability lives in its own crate. Enable or disable features at compile time. Deploy only what you need.
- **Cross-Platform** — Linux (primary), macOS, and Windows support from the same codebase with platform-specific adapters.
- **Zero Trust, Full Transparency** — The EDR itself must be auditable. Open-source code means defenders can verify exactly what runs on their endpoints.
- **Performance** — Minimal CPU/memory footprint in the steady state. Async I/O via Tokio for concurrent scanning without blocking.

## Current Capabilities (v0.1)

- **Process Intelligence** — Full process tree monitoring with CPU, memory, file path, and user context
- **Heuristic Engine** — 6-category threat scoring with time-decay for transient anomalies
- **Memory Forensics** — W^X violation detection, anonymous executable region scanning via `/proc` maps
- **Network Analysis** — Socket-to-PID mapping, suspicious port detection, DNS resolution
- **Binary Security** — SHA-256 integrity, Shannon entropy analysis, signature verification
- **Automated Response** — Forensic-safe pipeline: Suspend → Memory Dump → Kill
- **Reporting** — JSON/Text incident reports with SIEM export (Splunk HEC, Azure Sentinel)
- **Watchdog** — Anti-tamper sentinel process with heartbeat monitoring

## Short-Term Roadmap

- [ ] **Kernel Module** — eBPF tracepoints (Linux) and ETW integration (Windows) for syscall-level visibility
- [ ] **Desktop Dashboard** — Complete the Dioxus/Tauri-based real-time monitoring UI
- [ ] **YARA Integration** — Pattern-based malware signature matching
- [ ] **Threat Intel Feeds** — External IOC (Indicators of Compromise) feed consumption
- [ ] **Systemd/launchd Integration** — First-class daemon management on Linux and macOS

## Long-Term Vision

- [ ] **ML-Based Detection** — Anomaly detection using lightweight on-device models for behavior profiling
- [ ] **Cloud Dashboard** — Centralized multi-endpoint monitoring and alerting
- [ ] **Plugin System** — Third-party detection modules and response actions
- [ ] **Compliance Reporting** — Automated compliance checks (CIS benchmarks, NIST guidelines)
- [ ] **Container Security** — Docker/Kubernetes pod-level endpoint monitoring
- [ ] **Incident Playbooks** — Automated, configurable response chains with rollback

## Academic Context

IronSight is developed as part of cybersecurity research at **İstinye University** by Keyvan Arasteh. The project serves both as a practical security tool and as a teaching platform for systems programming, operating system internals, and security engineering.

## License

MIT — See [LICENSE](LICENSE)
