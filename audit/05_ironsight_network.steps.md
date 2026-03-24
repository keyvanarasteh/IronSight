# ironsight-network — Implementation Steps

> Audit: [05_ironsight_network.md](05_ironsight_network.md) · 10 Issues (4 High, 6 Medium)

---

## STEP 1: Async DNS Resolution _(High #1)_

**Dosya:** `crates/ironsight-network/src/dns.rs`

### Bağımlılık Ekle
```toml
hickory-resolver = "0.24"
tokio = { workspace = true }
```

### Ne Yapılacak
1. `std::process::Command("host")` → `hickory-resolver` ile değiştir
2. Async resolver + timeout ekle
3. DNS cache ekle

```rust
use hickory_resolver::TokioAsyncResolver;
use hickory_resolver::config::*;

pub struct AsyncDnsResolver {
    resolver: TokioAsyncResolver,
    cache: HashMap<IpAddr, DnsEntry>,
    timeout: Duration,
}

impl AsyncDnsResolver {
    pub async fn new() -> Result<Self> {
        let resolver = TokioAsyncResolver::tokio(
            ResolverConfig::default(),
            ResolverOpts::default(),
        );
        Ok(Self { resolver, cache: HashMap::new(), timeout: Duration::from_secs(5) })
    }

    pub async fn reverse_lookup(&mut self, ip: IpAddr) -> Option<String> {
        if let Some(cached) = self.cache.get(&ip) {
            return cached.hostname.clone();
        }
        match tokio::time::timeout(self.timeout, self.resolver.reverse_lookup(ip)).await {
            Ok(Ok(names)) => { /* ... */ }
            _ => None,
        }
    }
}
```

### Test
```rust
#[tokio::test]
async fn test_async_dns_localhost() {
    let mut resolver = AsyncDnsResolver::new().await.unwrap();
    let result = resolver.reverse_lookup("127.0.0.1".parse().unwrap()).await;
    assert!(result.is_some());
}

#[tokio::test]
async fn test_dns_timeout() {
    let mut resolver = AsyncDnsResolver::new().await.unwrap();
    // Non-routable IP — should timeout
    let result = resolver.reverse_lookup("192.0.2.1".parse().unwrap()).await;
    // Should not hang
}
```

---

## STEP 2: Network Scan Caching _(High #3)_

**Dosya:** `crates/ironsight-network/src/audit.rs`

### Ne Yapılacak
1. `NetworkAuditCache` struct: socket scan sonuçlarını sakla
2. `scan_all()` → tek sefer, `get_for_pid()` → filtrele

```rust
pub struct NetworkAuditCache {
    sockets: Vec<SocketEntry>,
    inode_map: HashMap<u64, u32>, // inode → PID
    scanned_at: DateTime<Utc>,
}

impl NetworkAuditCache {
    pub fn scan_all() -> Result<Self> {
        let sockets = SocketMapper::scan_all()?;
        let inode_map = SocketMapper::build_inode_map()?;
        Ok(Self { sockets, inode_map, scanned_at: Utc::now() })
    }

    pub fn get_for_pid(&self, pid: u32) -> Vec<&SocketEntry> {
        self.sockets.iter().filter(|s| s.pid == Some(pid)).collect()
    }

    pub fn is_stale(&self, max_age: Duration) -> bool {
        Utc::now() - self.scanned_at > chrono::Duration::from_std(max_age).unwrap()
    }
}
```

### Test
```rust
#[test]
fn test_cached_scan_faster_than_per_pid() {
    let start = Instant::now();
    let cache = NetworkAuditCache::scan_all().unwrap();
    let scan_time = start.elapsed();
    
    let start2 = Instant::now();
    for pid in [1, 2, 3, 4, 5] {
        let _ = cache.get_for_pid(pid);
    }
    let filter_time = start2.elapsed();
    
    assert!(filter_time < scan_time / 10);
}
```

---

## STEP 3: IPv6 Byte Order Fix _(High #2)_

**Dosya:** `crates/ironsight-network/src/socket_mapper.rs`

### Ne Yapılacak
```rust
// ÖNCE (manual reversal — big-endian'da yanlış):
octets[base] = bytes[3];
octets[base + 1] = bytes[2];

// SONRA (endian-safe):
fn parse_ipv6_group(hex: &str) -> [u8; 4] {
    let val = u32::from_str_radix(hex, 16).unwrap();
    val.to_be_bytes()  // Network byte order
}
```

### Test
```rust
#[test]
fn test_ipv6_loopback_parsing() {
    let hex = "00000000000000000000000001000000";
    let addr = parse_ipv6(hex);
    assert_eq!(addr, Ipv6Addr::LOCALHOST);
}
```

---

## STEP 4: Suspicious Port Genişletme _(High #4)_

**Dosya:** `crates/ironsight-network/src/dns.rs`

### Ne Yapılacak
```rust
pub fn suspicious_ports() -> Vec<PortIntel> {
    vec![
        // Mevcut
        PortIntel::new(4444, "Metasploit Default"),
        PortIntel::new(5555, "Android Debug Bridge"),
        PortIntel::new(6667, "IRC (C2 Channel)"),
        PortIntel::new(9050, "Tor SOCKS Proxy"),
        PortIntel::new(1080, "SOCKS Proxy"),
        PortIntel::new(31337, "Back Orifice"),
        PortIntel::new(8080, "HTTP Proxy / C2"),
        // YENİ
        PortIntel::new(2222, "SSH Backdoor"),
        PortIntel::new(3389, "RDP (outbound suspicious)"),
        PortIntel::new(12345, "NetBus Trojan"),
        PortIntel::new(27374, "SubSeven Trojan"),
        PortIntel::new(65535, "Overflow Indicator"),
        PortIntel::new(1337, "Hacker Convention"),
        PortIntel::new(6666, "IRC Alt / DDoS"),
        PortIntel::new(6668, "IRC Alt"),
        PortIntel::new(6669, "IRC Alt"),
        PortIntel::new(7777, "Common C2"),
        PortIntel::new(9999, "Common Backdoor"),
        PortIntel::new(1234, "Common Test / Backdoor"),
    ]
}
```

Config'den de yükleme ekle:
```rust
pub fn from_config(ports: &[u16], custom: &[(u16, String)]) -> Vec<PortIntel> { ... }
```

---

## STEP 5: IPv6 Private Range _(Medium #6)_

```rust
pub fn is_private_ipv6(addr: &Ipv6Addr) -> bool {
    addr.is_loopback()
        || addr.is_unspecified()
        || is_unique_local(addr)      // fc00::/7
        || is_link_local_v6(addr)     // fe80::/10
        || is_ipv4_mapped(addr)       // ::ffff:0:0/96
}

fn is_unique_local(addr: &Ipv6Addr) -> bool {
    (addr.segments()[0] & 0xfe00) == 0xfc00
}
```

---

## STEP 6: Connection Timeline _(Medium #5)_

```rust
pub struct ConnectionTimeline {
    snapshots: VecDeque<(DateTime<Utc>, Vec<SocketEntry>)>,
    max_history: usize,
}

impl ConnectionTimeline {
    pub fn record(&mut self, entries: Vec<SocketEntry>) { ... }
    pub fn new_connections_since(&self, since: DateTime<Utc>) -> Vec<&SocketEntry> { ... }
    pub fn closed_connections_since(&self, since: DateTime<Utc>) -> Vec<&SocketEntry> { ... }
    pub fn detect_beaconing(&self, pid: u32) -> Option<BeaconPattern> { ... }
}
```

---

## Doğrulama Planı

```bash
cargo test --package ironsight-network
cargo test --package ironsight-network -- dns::tests
cargo test --package ironsight-network -- socket_mapper::tests
```
