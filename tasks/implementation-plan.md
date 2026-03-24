# IronSight — Kapsamlı Uygulama Planı ve Görevler

> Keyvan Arasteh · Qix Labs · 2026
>
> Bu doküman, IronSight'ın her modülünü detaylı teknik spesifikasyonlar, bağımlılık listesi, dosya yapısı ve test stratejisiyle tanımlar.

---

## Proje Yapısı

```
ironsight/
├── Cargo.toml                          # Workspace root
├── crates/
│   ├── ironsight-core/                 # ProcessSpy, Snapshot, Diff, Filter
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── process_info.rs         # ProcessInfo, ProcStatus
│   │   │   ├── snapshot.rs             # ProcessSnapshot
│   │   │   ├── diff.rs                 # ProcessDiff, ProcessChange
│   │   │   ├── filter.rs              # ProcessFilter builder
│   │   │   ├── spy.rs                 # ProcessSpy facade
│   │   │   ├── system_info.rs         # SystemInfo
│   │   │   └── error.rs              # SuiteError
│   │   └── Cargo.toml
│   │
│   ├── ironsight-security/             # SecurityAudit, Hash, Entropy, Signature
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── audit.rs              # SecurityAudit struct + audit()
│   │   │   ├── hash.rs               # SHA-256 computation
│   │   │   ├── entropy.rs            # Shannon entropy
│   │   │   ├── signature.rs          # Binary signature verification
│   │   │   ├── modules.rs            # Loaded module enumeration
│   │   │   └── path_analysis.rs      # Suspicious path detection
│   │   └── Cargo.toml
│   │
│   ├── ironsight-network/              # Socket mapping, DNS enrichment
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── socket_mapper.rs       # PID → socket correlation
│   │   │   ├── listener_detector.rs   # Non-standard port detection
│   │   │   └── dns_resolver.rs        # IP → domain resolution
│   │   └── Cargo.toml
│   │
│   ├── ironsight-memory/               # MemoryScanner, MemoryWatcher
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── scanner.rs            # Pattern scanning in process memory
│   │   │   ├── watcher.rs            # Region diff + protection monitoring
│   │   │   ├── region.rs             # RegionState, MemoryEvent
│   │   │   └── patterns.rs           # Default suspicious regex patterns
│   │   └── Cargo.toml
│   │
│   ├── ironsight-kernel/               # eBPF (Linux), ETW (Windows)
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── dispatcher.rs          # Unified event dispatcher
│   │   │   ├── linux_ebpf.rs          # Aya tracepoint integration
│   │   │   └── windows_etw.rs         # ferrisetw integration
│   │   └── Cargo.toml
│   │
│   ├── ironsight-kernel-ebpf/          # eBPF bytecode (no_std)
│   │   ├── src/main.rs                # Tracepoint handler
│   │   └── Cargo.toml
│   │
│   ├── ironsight-heuristic/            # ThreatScore, HeuristicEngine
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── engine.rs             # Scoring logic
│   │   │   ├── signals.rs            # Signal definitions + weights
│   │   │   └── decay.rs              # Time-decay scoring
│   │   └── Cargo.toml
│   │
│   ├── ironsight-response/             # ResponseHandler, forensics
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── handler.rs            # Threshold-based escalation
│   │   │   ├── suspend.rs            # Cross-platform freeze
│   │   │   ├── dump.rs               # Minidump generation
│   │   │   ├── kill.rs               # Cross-platform terminate
│   │   │   └── exclusion.rs          # Whitelist/exclusion list
│   │   └── Cargo.toml
│   │
│   ├── ironsight-report/               # SIEM-ready JSON reports
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── schema.rs             # SecurityReport, ProcessContext
│   │   │   ├── generator.rs          # Report builder
│   │   │   └── exporters/
│   │   │       ├── json_file.rs       # Local JSON export
│   │   │       ├── splunk_hec.rs      # Splunk HTTP Event Collector
│   │   │       └── sentinel.rs        # Microsoft Sentinel
│   │   └── Cargo.toml
│   │
│   ├── ironsight-service/              # Orchestrator / main.rs
│   │   ├── src/
│   │   │   ├── main.rs               # Tokio service loop
│   │   │   ├── config.rs             # Runtime configuration
│   │   │   ├── privilege.rs          # OS privilege escalation
│   │   │   └── watchdog.rs           # Peer monitoring
│   │   └── Cargo.toml
│   │
│   └── ironsight-ui/                   # Dioxus desktop dashboard
│       ├── src/
│       │   ├── main.rs               # Window init
│       │   ├── app.rs                # Root component
│       │   ├── components/
│       │   │   ├── process_table.rs   # Live process list
│       │   │   ├── threat_gauge.rs    # System risk index
│       │   │   ├── alert_feed.rs      # Real-time alert stream
│       │   │   └── quick_actions.rs   # Kill/Dump/Scan buttons
│       │   └── bridge.rs             # Backend ↔ UI channel
│       ├── assets/
│       │   └── tailwind.css          # Dark hacker theme
│       └── Cargo.toml
│
├── docker/
│   ├── Dockerfile                     # Multi-stage build
│   └── docker-compose.yml            # Privileged deployment
│
└── docs/
    ├── process_spy.rs                 # Original reference code
    └── process_spy_addons.md          # Research document
```

---

## Bağımlılık Haritası

### Core Crate'ler

| Crate | Versiyon (2026) | Kullanım |
|-------|----------------|----------|
| `sysinfo` | ^0.32 | Process/system enumeration |
| `crossbeam-channel` | ^0.5 | Event channel |
| `serde` + `serde_json` | ^1.0 | Serialization |
| `chrono` | ^0.4 | Timestamps |
| `tracing` + `tracing-subscriber` | ^0.3 | Structured logging |
| `tokio` | ^1.0 | Async runtime |
| `anyhow` | ^1.0 | Error handling |

### Security Crate'ler

| Crate | Versiyon | Kullanım |
|-------|---------|----------|
| `sha2` | ^0.10 | SHA-256 hash |
| `hex` | ^0.4 | Hash formatting |
| `entropy` | ^0.4 | Shannon entropy |
| `cross-authenticode` | ^1.0 | Windows signature verification |

### Memory/RE Crate'ler

| Crate | Versiyon | Kullanım |
|-------|---------|----------|
| `procmod-core` | ^1.0 | Cross-platform memory access |
| `regex` | ^1.0 | Byte-level pattern matching |
| `xxhash-rust` | ^0.8 | Fast region hashing |
| `remoteprocess` | ^0.4 | Process suspend/attach |
| `minidump-writer` | ^0.9 | Forensic dumps |

### Network Crate'ler

| Crate | Versiyon | Kullanım |
|-------|---------|----------|
| `listeners` | ^0.4 | Socket ↔ PID mapping |
| `trust-dns-resolver` | ^0.24 | DNS resolution |

### Kernel Crate'ler

| Crate | Versiyon | Kullanım |
|-------|---------|----------|
| `aya` | ^0.13 | eBPF (Linux) |
| `aya-ebpf` | ^0.1 | eBPF kernel-side |
| `ferrisetw` | ^1.0 | ETW (Windows) |

### UI Crate'ler

| Crate | Versiyon | Kullanım |
|-------|---------|----------|
| `dioxus` | ^0.6 | Desktop UI framework |
| `dioxus-desktop` | ^0.6 | Native window |

### Utility

| Crate | Versiyon | Kullanım |
|-------|---------|----------|
| `uuid` | ^1.0 | Event tracking IDs |
| `whoami` | ^1.5 | Hostname detection |
| `reqwest` | ^0.12 | HTTP client (SIEM export) |
| `nix` | ^0.29 | Unix-specific APIs |
| `windows` | ^0.58 | Windows-specific APIs |

---

## Görev Listesi — Sprint Bazlı

### Sprint 1: Foundation (Hafta 1–2)

- [ ] **T-001:** Workspace Cargo.toml oluştur (tüm crate'ler)
- [ ] **T-002:** `ironsight-core/error.rs` — `SuiteError` enum tanımla
- [ ] **T-003:** `ironsight-core/process_info.rs` — `ProcessInfo`, `ProcStatus` struct/enum
- [ ] **T-004:** `ironsight-core/snapshot.rs` — `ProcessSnapshot` + `build_snapshot()` helper
- [ ] **T-005:** `ironsight-core/snapshot.rs` — `by_cpu()`, `by_memory()`, `find_by_*()`, `tree()`, `children_of()`
- [ ] **T-006:** `ironsight-core/diff.rs` — `ProcessDiff::compute()` + eşik mantığı
- [ ] **T-007:** `ironsight-core/filter.rs` — `ProcessFilter` chainable builder
- [ ] **T-008:** `ironsight-core/spy.rs` — `ProcessSpy::new()`, `snapshot()`, `system_info()`
- [ ] **T-009:** `ironsight-core/spy.rs` — `start_monitoring()`, `subscribe()`, `try_recv()`
- [ ] **T-010:** `ironsight-core/spy.rs` — `kill()`, `signal()`, `wait_for_exit()`, `wait_for_spawn()`
- [ ] **T-011:** `ironsight-core/spy.rs` — `env_vars()`, `fd_count()` (Linux)
- [ ] **T-012:** Sprint 1 unit test'leri — snapshot, diff, filter

### Sprint 2: Security Layer (Hafta 3–4)

- [ ] **T-013:** `ironsight-security/hash.rs` — SHA-256 computation with file reading
- [ ] **T-014:** `ironsight-security/entropy.rs` — Shannon entropy calculation
- [ ] **T-015:** `ironsight-security/signature.rs` — Authenticode (Windows), placeholder (Linux/macOS)
- [ ] **T-016:** `ironsight-security/modules.rs` — procmod-core module listing
- [ ] **T-017:** `ironsight-security/path_analysis.rs` — suspicious directory checks
- [ ] **T-018:** `ironsight-security/audit.rs` — `SecurityAudit` struct + `audit()` orchestrator
- [ ] **T-019:** Sprint 2 unit test'leri + integration test (hash + entropy + path)

### Sprint 3: Network Layer (Hafta 5)

- [ ] **T-020:** `ironsight-network/socket_mapper.rs` — `listeners` crate ile PID↔socket
- [ ] **T-021:** `ironsight-network/listener_detector.rs` — non-standard port flagging
- [ ] **T-022:** `ironsight-network/dns_resolver.rs` — async DNS resolution
- [ ] **T-023:** Sprint 3 integration test'leri

### Sprint 4: Memory Analysis (Hafta 6–7)

- [ ] **T-024:** `ironsight-memory/region.rs` — `RegionState`, `MemoryEvent` enum
- [ ] **T-025:** `ironsight-memory/patterns.rs` — default regex pattern set
- [ ] **T-026:** `ironsight-memory/scanner.rs` — `MemoryScanner::new()` + `scan()`
  - Region enumeration, READ-only filter, guard page skip
  - Byte-safe regex matching (unicode=false)
- [ ] **T-027:** `ironsight-memory/watcher.rs` — `MemoryWatcher::new()` + `update()`
  - xxh3 hashing per region
  - Delta detection: new, modified, protection changed
- [ ] **T-028:** Sprint 4 test'leri (mock process ile scanner test)

### Sprint 5: Kernel Integration (Hafta 8–9)

- [ ] **T-029:** `ironsight-kernel-ebpf/` — no_std eBPF tracepoint (mprotect)
- [ ] **T-030:** `ironsight-kernel/linux_ebpf.rs` — Aya loader + user-side receiver
- [ ] **T-031:** `ironsight-kernel/windows_etw.rs` — ferrisetw provider + callback
- [ ] **T-032:** `ironsight-kernel/dispatcher.rs` — unified channel dispatcher
- [ ] **T-033:** Sprint 5 integration test'leri (Linux VM & Windows VM)

### Sprint 6: Intelligence (Hafta 10)

- [ ] **T-034:** `ironsight-heuristic/signals.rs` — signal definitions + weight constants
- [ ] **T-035:** `ironsight-heuristic/engine.rs` — `HeuristicEngine::evaluate()`
- [ ] **T-036:** `ironsight-heuristic/decay.rs` — time-decay scoring algorithm
- [ ] **T-037:** Sprint 6 unit test'leri (edge case: compiler false positive)

### Sprint 7: Response (Hafta 11)

- [ ] **T-038:** `ironsight-response/suspend.rs` — SIGSTOP (Unix), SuspendThread (Windows)
- [ ] **T-039:** `ironsight-response/dump.rs` — MinidumpWriter integration
- [ ] **T-040:** `ironsight-response/kill.rs` — SIGKILL (Unix), TerminateProcess (Windows)
- [ ] **T-041:** `ironsight-response/exclusion.rs` — whitelist config file
- [ ] **T-042:** `ironsight-response/handler.rs` — threshold escalation: None→Alert→Suspend→Dump→Kill
- [ ] **T-043:** Sprint 7 test'leri (mock process ile suspend/kill test)

### Sprint 8: Reporting (Hafta 12)

- [ ] **T-044:** `ironsight-report/schema.rs` — `SecurityReport`, `ProcessContext` structs
- [ ] **T-045:** `ironsight-report/generator.rs` — report builder from audit + score + events
- [ ] **T-046:** `ironsight-report/exporters/json_file.rs` — local file export
- [ ] **T-047:** `ironsight-report/exporters/splunk_hec.rs` — HTTP Event Collector
- [ ] **T-048:** `ironsight-report/exporters/sentinel.rs` — Log Analytics API
- [ ] **T-049:** Sprint 8 test'leri (JSON schema validation)

### Sprint 9: Service Orchestration (Hafta 13–14)

- [ ] **T-050:** `ironsight-service/config.rs` — TOML/YAML config loading
- [ ] **T-051:** `ironsight-service/privilege.rs` — SeDebugPrivilege (Windows), CAP_SYS_PTRACE check (Linux)
- [ ] **T-052:** `ironsight-service/main.rs` — tokio event loop:
  - Kernel listener task
  - Polling task (2s interval)
  - Audit + score + response orchestration
- [ ] **T-053:** `ironsight-service/watchdog.rs` — peer process monitoring
- [ ] **T-054:** `docker/Dockerfile` — multi-stage build
- [ ] **T-055:** `docker/docker-compose.yml` — privileged deployment + volumes
- [ ] **T-056:** Sprint 9 integration test'leri (Docker build + health check)

### Sprint 10: Desktop UI (Hafta 15–16)

- [ ] **T-057:** `ironsight-ui/` — Dioxus project init
- [ ] **T-058:** `ironsight-ui/bridge.rs` — tokio mpsc channel between backend and UI
- [ ] **T-059:** `ironsight-ui/components/process_table.rs` — sortable, color-coded table
- [ ] **T-060:** `ironsight-ui/components/threat_gauge.rs` — system risk index widget
- [ ] **T-061:** `ironsight-ui/components/alert_feed.rs` — real-time event log
- [ ] **T-062:** `ironsight-ui/components/quick_actions.rs` — kill/dump/scan buttons
- [ ] **T-063:** `ironsight-ui/assets/tailwind.css` — dark hacker theme (slate-950, emerald-500)
- [ ] **T-064:** `ironsight-ui/app.rs` — root layout (grid: 8+4 columns)
- [ ] **T-065:** System tray integration + global hotkey
- [ ] **T-066:** Sprint 10 manual test + screenshot'lar

---

## Platform-Specific Notlar

### Linux Requirements
- Kernel 5.x+ (eBPF)
- `CAP_SYS_PTRACE` + `CAP_SYS_ADMIN` + `CAP_NET_ADMIN`
- `bpf-linker` (build-time)
- `libelf-dev` (runtime)

### Windows Requirements
- Administrator rights
- `SeDebugPrivilege` activation
- ETW session permissions
- Process-isolated containers (not Hyper-V)

### macOS Requirements
- `com.apple.security.cs.debugger` entitlement
- `sudo` for `task_for_pid` access
- Notarization for distribution

---

## Test Stratejisi

| Seviye | Araç | Kapsam |
|--------|------|--------|
| Unit | `cargo test` | Her crate'in iç logic'i |
| Integration | `cargo test --features integration` | Crate-arası iletişim |
| Platform | CI matrix (Linux, Windows, macOS) | Platform-specific kodlar |
| Docker | `docker compose up --build` | Container deployment |
| E2E | Manual + script | Tam akış: detect → score → respond → report |

### Test Senaryoları

| Senaryo | Beklenen Davranış |
|---------|------------------|
| Normal "ls" process | Score: 0, Action: None |
| Unsigned high-entropy binary from /tmp | Score: 75+, Action: Suspend+Dump |
| Process with RW→RX transition | Score: 90+, Action: Suspend+Dump+Kill |
| IDE/Compiler (excluded) | Score: N/A, Action: Skip |
| Already-dead PID kill attempt | Graceful error, no crash |

---

## Öncelik Sırası

```
[KRİTİK]  Sprint 1-2: Core + Security     → Temel altyapı
[YÜKSEK]  Sprint 3-4: Network + Memory    → Analiz kapasitesi
[YÜKSEK]  Sprint 5-6: Kernel + Heuristic  → Gerçek zamanlı istihbarat
[ORTA]    Sprint 7-8: Response + Report    → Aksiyon ve kayıt
[ORTA]    Sprint 9:   Service + Docker     → Deployment
[DÜŞÜK]   Sprint 10:  UI                   → Görselleştirme
```

> "Önce temel çalışsın, sonra katman katman ekle. v1'de bile tek başına kullanılabilir olmalı — terminal'den `snapshot | grep chrome` yapabilmeli."
