# ironsight-network — Deep Audit Report

**Description:** Network analysis — socket-to-PID mapping, listener detection, DNS enrichment  
**Dependencies:** ironsight-core, serde, tracing, thiserror  
**Files:** lib.rs, audit.rs, dns.rs, socket_mapper.rs

---

## ✅ What Works Well

- **Complete /proc/net parser** — Handles TCP v4, TCP v6, UDP v4, UDP v6
- **Socket-to-PID mapping** — Inode-based mapping via /proc/PID/fd scanning
- **Suspicious port database** — 7 known-bad ports (Metasploit, Back Orifice, IRC, Tor, etc.)
- **Network audit orchestration** — `NetworkAudit::scan()` and `scan_pid()` combine all subsystems
- **Private IP detection** — Correctly handles IPv4 private ranges, loopback, link-local
- **Good test coverage** — 12+ tests covering parsing, filtering, port intel

---

## 🟠 High Issues

### 1. DNS Reverse Lookup Shells Out to `host` Command

**File:** `dns.rs:54-69`  
```rust
let output = std::process::Command::new("host")
    .arg(ip.to_string())
    .output();
```
**Issue:** 
- Spawns a child process for every DNS lookup — extremely slow for bulk audits
- `host` command may not be installed on all systems
- No timeout on the subprocess, can hang indefinitely
- Command injection risk if IP is somehow malformed (mitigated by IpAddr validation)
- Blocking call in what should be async code

**Fix Required:** Use a proper DNS library (e.g., `trust-dns-resolver` or `hickory-dns`).

### 2. IPv6 Parsing Byte Order May Be Wrong

**File:** `socket_mapper.rs:274-289`  
**Issue:** IPv6 addresses in /proc/net are stored in a complex byte order (4 groups of 4 bytes, each in native endianness). The current implementation:
```rust
octets[base] = bytes[3];
octets[base + 1] = bytes[2];
octets[base + 2] = bytes[1];
octets[base + 3] = bytes[0];
```
This reverses each 4-byte group, which is correct for little-endian systems but **wrong on big-endian systems**. Should use `u32::from_be()` instead of manual reversal.

### 3. NetworkAudit::scan() Scans All PIDs Redundantly

**File:** `audit.rs:46-120`  
**Issue:** `scan()` builds the full inode→PID map and then scans all /proc/net files. When called per-process from `main.rs`, this entire operation repeats for every process. With 500 processes, this means 500 full /proc scans.

**Fix Required:** Cache the socket scan results and filter by PID at the caller level.

### 4. Suspicious Port List is Too Small

**File:** `dns.rs:94-132`  
**Issue:** Only 7 suspicious ports defined. Missing critical ports:
- 2222 (SSH backdoor)
- 3389 (RDP, shouldn't be outbound)
- 8080 (commonly used by C2)
- 12345 (NetBus)
- 27374 (SubSeven)
- 65535 (overflow indicator)
- Dynamic port ranges used by reverse shells

---

## 🟡 Medium Issues

### 5. No Connection History/Timeline

**Issue:** `SocketMapper::scan()` is a point-in-time snapshot. No tracking of connection establishment/teardown over time, which is critical for detecting short-lived C2 beaconing.

### 6. DnsEntry::is_private_ip Missing IPv6 Ranges

**File:** `dns.rs:38`  
**Issue:** IPv6 private range detection only checks `is_loopback()` and `is_unspecified()`. Missing:
- `fc00::/7` (unique local addresses)
- `fe80::/10` (link-local)
- `::ffff:0:0/96` (IPv4-mapped)

### 7. No UDP State Handling

**Issue:** UDP sockets have no concept of TCP states, but the code assigns `TcpState` to UDP entries from `from_hex()`. This is semantically incorrect — UDP entries in `/proc/net/udp` have state field but it's not a TCP state.

### 8. No Thread Safety for SocketMapper

**Issue:** `SocketMapper` is a stateless struct with static methods. While this works, the scan operation is expensive and results should be cached in a thread-safe manner for concurrent consumers.

### 9. No GeoIP Integration

**Issue:** External connections are detected but there's no GeoIP lookup to correlate with known-malicious regions or unexpected geographic origins.

### 10. No Bandwidth/Rate Monitoring

**Issue:** Socket enumeration shows connections but not data volume. A process with a single connection transferring large amounts of data (exfiltration) would not be flagged.

---

## ❌ Missing Implementations

| Feature | Status | Notes |
|---|---|---|
| Async DNS resolution | ❌ | Shells out to `host` |
| Connection timeline | ❌ | Point-in-time only |
| IPv6 private range detection | ❌ | Partial |
| GeoIP lookups | ❌ | No geographic intelligence |
| Bandwidth monitoring | ❌ | No data volume tracking |
| Scan result caching | ❌ | Full rescan per call |
| Configurable suspicious ports | ❌ | Hardcoded list |
| Windows socket enumeration | ❌ | Returns empty |
| macOS socket enumeration | ❌ | Returns empty |
| PCAP integration | ❌ | No packet capture |
| TLS certificate inspection | ❌ | No certificate analysis |
| Connection rate detection | ❌ | No beaconing detection |

---

## 🧪 Test Coverage

| Area | Tested | Notes |
|---|---|---|
| TCP state parsing | ✅ | All states from hex |
| IPv4 address parsing | ✅ | Localhost, zero |
| IPv6 address parsing | ❌ | Not tested |
| Full scan (live) | ✅ | Requires Linux |
| Listener filtering | ✅ | Mock data |
| Established filtering | ✅ | Mock data |
| PID filtering | ✅ | Mock data |
| Remote port filtering | ✅ | Mock data |
| Private IP detection | ✅ | v4 and v6 |
| Suspicious port intel | ✅ | Known ports |
| DNS lookup | ✅ | Localhost only |
| Network audit | ❌ | No test coverage |
| Concurrent scanning | ❌ | Not tested |
