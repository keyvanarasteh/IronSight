# ironsight-kernel — Deep Audit Report

**Description:** Kernel-level monitoring — eBPF (Linux), ETW (Windows), unified event dispatcher  
**Dependencies:** ironsight-core, tokio, tracing, thiserror, anyhow  
**Files:** lib.rs (9 lines total)

---

## 🔴 CRITICAL: Entire Crate is Unimplemented

The crate consists of a single file (`lib.rs`) containing only a doc comment and a `// TODO: Implement in Sprint 5` marker.

```rust
//! # IronSight Kernel
//!
//! Kernel-level real-time monitoring:
//! - Linux: eBPF tracepoints via Aya (mprotect, mmap)
//! - Windows: ETW via ferrisetw (VirtualAlloc, VirtualProtect)
//! - Unified event dispatcher channel

// TODO: Implement in Sprint 5
```

---

## ❌ Everything is Missing

### Linux eBPF Layer (High Priority)

| Component | Status | Description |
|---|---|---|
| eBPF loader | ❌ | Load BPF programs via Aya SDK |
| mprotect tracepoint | ❌ | Detect memory protection changes in real-time |
| mmap tracepoint | ❌ | Detect new memory mappings |
| execve tracepoint | ❌ | Detect process execution |
| connect tracepoint | ❌ | Detect outbound connections |
| ptrace tracepoint | ❌ | Detect debugging/injection attempts |
| Event ring buffer | ❌ | Perf/ringbuf for kernel→userspace events |
| BPF map management | ❌ | PID filter maps, rate limiting |

### Windows ETW Layer

| Component | Status | Description |
|---|---|---|
| ETW session manager | ❌ | Create/manage ETW trace sessions |
| VirtualAlloc tracking | ❌ | Memory allocation monitoring |
| VirtualProtect tracking | ❌ | Memory protection changes |
| Process/Thread events | ❌ | CreateProcess, CreateThread |
| Network events | ❌ | TCP/UDP connection events |
| File I/O events | ❌ | Suspicious file operations |

### Unified Dispatcher

| Component | Status | Description |
|---|---|---|
| `KernelEvent` enum | ❌ | Platform-agnostic event type |
| Event channel | ❌ | crossbeam/tokio channel to consumers |
| Event deduplication | ❌ | Prevent flood from noisy tracepoints |
| Rate limiter | ❌ | Per-PID event throttling |
| Filter pipeline | ❌ | Configurable event filtering |

---

## 📋 Required Dependencies (Not Yet Added)

```toml
# Linux eBPF
aya = "0.12"
aya-log = "0.2"

# Windows ETW
# ferrisetw = "1.0"  # Windows only

# Shared
bytes = "1"
```

---

## 🏗️ Suggested Implementation Plan

1. **Define `KernelEvent` enum** — Platform-agnostic event types
2. **Implement eBPF loader** — Use Aya SDK to load BPF programs
3. **Create tracepoint programs** — Start with `mprotect` and `execve`
4. **Build event dispatcher** — Channel-based event delivery
5. **Add rate limiting** — Per-PID throttling to prevent DoS
6. **Integration tests** — Requires root privileges for eBPF

---

## Impact Assessment

Without this crate, IronSight relies entirely on periodic polling via sysinfo and /proc parsing. This means:
- **No real-time detection** — Threats are only discovered at scan intervals
- **Race condition window** — A fast-acting threat can execute and clean up between scans
- **No kernel-level visibility** — Cannot detect mprotect calls, syscall patterns, or rootkit activity
- **Significantly reduced detection capability** compared to commercial EDR products
