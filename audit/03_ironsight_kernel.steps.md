# ironsight-kernel — Implementation Steps

> Audit: [03_ironsight_kernel.md](03_ironsight_kernel.md) · Tüm Crate Uygulanmamış (CRITICAL)

---

## STEP 1: KernelEvent Enum Tanımla

**Dosya:** `crates/ironsight-kernel/src/events.rs` [YENİ]

### Ne Yapılacak
Platform-agnostik event tipi oluştur:

```rust
use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KernelEvent {
    pub timestamp: DateTime<Utc>,
    pub pid: u32,
    pub event_type: KernelEventType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum KernelEventType {
    MprotectChange { addr: u64, len: u64, old_prot: u32, new_prot: u32 },
    MmapCreated { addr: u64, len: u64, prot: u32, fd: i32 },
    Execve { filename: String, argv: Vec<String> },
    Connect { addr: std::net::IpAddr, port: u16 },
    PtraceAttach { target_pid: u32 },
    FileOpen { path: String, flags: u32 },
}
```

### Test
```rust
#[test]
fn test_kernel_event_serialization() {
    let event = KernelEvent { ... };
    let json = serde_json::to_string(&event).unwrap();
    let restored: KernelEvent = serde_json::from_str(&json).unwrap();
    assert_eq!(event.pid, restored.pid);
}
```

---

## STEP 2: Event Dispatcher Channel

**Dosya:** `crates/ironsight-kernel/src/dispatcher.rs` [YENİ]

### Ne Yapılacak
1. `tokio::sync::broadcast` channel oluştur
2. Rate limiter (per-PID throttle) ekle
3. Event filter pipeline ekle

```rust
use tokio::sync::broadcast;

pub struct EventDispatcher {
    sender: broadcast::Sender<KernelEvent>,
    rate_limiter: HashMap<u32, RateLimiter>,
    filters: Vec<Box<dyn EventFilter>>,
}

impl EventDispatcher {
    pub fn new(capacity: usize) -> Self { ... }
    pub fn subscribe(&self) -> broadcast::Receiver<KernelEvent> { ... }
    pub fn dispatch(&self, event: KernelEvent) -> bool { ... }
}

struct RateLimiter {
    window: Duration,
    max_events: usize,
    events: VecDeque<Instant>,
}
```

### Test
```rust
#[tokio::test]
async fn test_dispatcher_broadcast() {
    let dispatcher = EventDispatcher::new(100);
    let mut rx = dispatcher.subscribe();
    dispatcher.dispatch(test_event());
    let received = rx.recv().await.unwrap();
    assert_eq!(received.pid, 123);
}

#[tokio::test]
async fn test_rate_limiter_throttle() {
    let dispatcher = EventDispatcher::new(100);
    // 100 event gönder, sadece N tanesi geçmeli
    for _ in 0..100 {
        dispatcher.dispatch(flood_event(pid: 1));
    }
    // Rate limit: max 10/saniye
}
```

---

## STEP 3: Linux eBPF Loader (Aya SDK)

**Dosya:** `crates/ironsight-kernel/src/linux/mod.rs` [YENİ]

### Bağımlılık Ekle
```toml
[target.'cfg(target_os = "linux")'.dependencies]
aya = "0.12"
aya-log = "0.2"
```

### Ne Yapılacak
1. BPF program yükleyici yazılacak
2. İlk tracepoint: `sys_enter_mprotect`
3. Perf buffer üzerinden event okuma
4. KernelEvent'e dönüştürme

```rust
#[cfg(target_os = "linux")]
pub mod linux {
    use aya::Bpf;
    use aya::programs::TracePoint;

    pub struct EbpfMonitor {
        bpf: Bpf,
        dispatcher: Arc<EventDispatcher>,
    }

    impl EbpfMonitor {
        pub async fn new(dispatcher: Arc<EventDispatcher>) -> Result<Self> {
            let mut bpf = Bpf::load(include_bytes_aligned!("../bpf/monitor.o"))?;
            // mprotect tracepoint
            let prog: &mut TracePoint = bpf.program_mut("monitor_mprotect")?.try_into()?;
            prog.load()?;
            prog.attach("syscalls", "sys_enter_mprotect")?;
            Ok(Self { bpf, dispatcher })
        }

        pub async fn run(&self) -> Result<()> {
            // Perf buffer okuma loop
        }
    }
}
```

### Test
```rust
#[cfg(target_os = "linux")]
#[tokio::test]
#[ignore]  // Root gerektirir
async fn test_ebpf_mprotect_detection() {
    let dispatcher = Arc::new(EventDispatcher::new(100));
    let monitor = EbpfMonitor::new(dispatcher.clone()).await.unwrap();
    
    // Test: mprotect çağır, event gelsin
    let mut rx = dispatcher.subscribe();
    tokio::spawn(async move { monitor.run().await });
    
    // mprotect çağrısı yap
    unsafe {
        libc::mprotect(ptr, 4096, libc::PROT_READ | libc::PROT_WRITE | libc::PROT_EXEC);
    }
    
    let event = tokio::time::timeout(Duration::from_secs(2), rx.recv()).await;
    assert!(event.is_ok());
}
```

---

## STEP 4: eBPF Tracepoint Programları

**Dosya:** `crates/ironsight-kernel/bpf/monitor.bpf.c` [YENİ]

### Ne Yapılacak
```c
// BPF C programı — Aya ile derlenir
#include "vmlinux.h"
#include <bpf/bpf_helpers.h>

struct {
    __uint(type, BPF_MAP_TYPE_PERF_EVENT_ARRAY);
} events SEC(".maps");

struct mprotect_event {
    __u32 pid;
    __u64 addr;
    __u64 len;
    __u32 prot;
};

SEC("tracepoint/syscalls/sys_enter_mprotect")
int monitor_mprotect(struct trace_event_raw_sys_enter* ctx) {
    struct mprotect_event event = {};
    event.pid = bpf_get_current_pid_tgid() >> 32;
    event.addr = ctx->args[0];
    event.len = ctx->args[1];
    event.prot = ctx->args[2];
    bpf_perf_event_output(ctx, &events, BPF_F_CURRENT_CPU, &event, sizeof(event));
    return 0;
}
```

---

## STEP 5: Windows ETW Stub

**Dosya:** `crates/ironsight-kernel/src/windows/mod.rs` [YENİ]

### Ne Yapılacak
1. Trait tanımla: `KernelMonitor`
2. Windows stub döndür `Err(Unsupported)`
3. Feature gate: `#[cfg(target_os = "windows")]`

```rust
pub trait KernelMonitor: Send + Sync {
    async fn start(&self) -> Result<()>;
    async fn stop(&self) -> Result<()>;
}

#[cfg(target_os = "windows")]
pub struct EtwMonitor;

#[cfg(target_os = "windows")]
impl KernelMonitor for EtwMonitor {
    async fn start(&self) -> Result<()> {
        Err(anyhow!("ETW monitoring not yet implemented"))
    }
}
```

---

## STEP 6: lib.rs Public API

**Dosya:** `crates/ironsight-kernel/src/lib.rs`

```rust
pub mod events;
pub mod dispatcher;

#[cfg(target_os = "linux")]
pub mod linux;

#[cfg(target_os = "windows")]
pub mod windows;

pub use events::{KernelEvent, KernelEventType};
pub use dispatcher::EventDispatcher;
```

---

## Doğrulama Planı

```bash
# Unit testler (root gerektirmez)
cargo test --package ironsight-kernel

# eBPF testleri (root gerektirir)
sudo cargo test --package ironsight-kernel -- --ignored

# BPF derleme kontrolü
cargo build --package ironsight-kernel --target x86_64-unknown-linux-gnu
```
