# Security Policy

IronSight is security software that runs with elevated privileges. We take security reports seriously.

## Reporting a Vulnerability

**Do not open a public issue for security vulnerabilities.**

Report vulnerabilities through one of these channels:

1. **GitHub Security Advisories** (preferred): [Report a vulnerability](https://github.com/keyvanarasteh/IronSight/security/advisories/new)
2. **Email**: Contact the maintainer directly via GitHub

### Required in Reports

1. **Title** — Clear, concise summary
2. **Severity Assessment** — Your evaluation of impact (Critical/High/Medium/Low)
3. **Affected Component** — Which crate(s) and function(s) are involved
4. **Technical Reproduction** — Step-by-step to reproduce the issue
5. **Impact** — What an attacker could achieve
6. **Environment** — OS, Rust version, IronSight version/commit
7. **Remediation Advice** — Suggested fix if you have one

Reports without reproduction steps will be deprioritized.

## Supported Versions

| Version | Supported |
|---------|-----------|
| `main` branch | ✅ Yes |
| Latest release | ✅ Yes |
| Older releases | ❌ No |

## Scope

### In Scope

- **Privilege escalation** — Bypasses that allow unprivileged code to gain IronSight's elevated capabilities
- **Process escape** — A monitored process evading detection or killing the EDR
- **Memory safety** — Buffer overflows, use-after-free, or other memory corruption in IronSight itself
- **Configuration injection** — Malicious TOML config that leads to arbitrary code execution
- **Report tampering** — Ability to modify or forge incident reports
- **Watchdog bypass** — Anti-tamper sentinel circumvention
- **Dependency vulnerabilities** — Critical CVEs in direct dependencies that affect IronSight

### Out of Scope

- **Intentional privileged operations** — IronSight is designed to suspend and kill processes; this is expected behavior when configured to do so
- **Root/Administrator access attacks** — If an attacker already has root, IronSight's security boundary is already breached
- **Denial of service via resource exhaustion** — The EDR requires system resources by design
- **Known limitations** — Platform-specific documented limitations (e.g., no `/proc` on macOS/Windows)
- **Third-party tool issues** — Bugs in Docker, Grafana, or other monitoring stack components

## Trust Model

IronSight operates with the following assumptions:

- **The EDR runs as root/Administrator** — It requires elevated privileges for process inspection, memory reading, and signal sending
- **Configuration is trusted** — The TOML configuration file is assumed to be controlled by the system administrator
- **The host OS is trusted** — IronSight does not defend against a compromised kernel or bootloader
- **Report storage is trusted** — Output directories (`report_dir`, `dump_dir`) are assumed to have proper filesystem permissions

## Disclosure Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 7 days
- **Fix development**: Best effort, targeting 30 days for critical issues
- **Public disclosure**: After a fix is available, or 90 days, whichever comes first

## Security Best Practices

When deploying IronSight:

1. **Least privilege**: Use Linux capabilities (`CAP_SYS_PTRACE`, `CAP_KILL`, `CAP_DAC_READ_SEARCH`) instead of running as root when possible
2. **Protect configuration**: Ensure `ironsight.toml` is readable only by root (`chmod 600`)
3. **Secure dump directory**: Memory dumps contain sensitive data. Set `chmod 700` on `dump_dir`
4. **Network exposure**: If using SIEM export, ensure TLS is configured for Splunk HEC endpoints
5. **Audit dependencies**: Run `cargo audit` regularly to check for known vulnerabilities in dependencies

```bash
# Install cargo-audit
cargo install cargo-audit

# Check for vulnerabilities
cargo audit

# Check for unsafe code usage
cargo clippy --workspace -- -W clippy::undocumented_unsafe_blocks
```
