# Configuration — Sayfa Spesifikasyonu

> Route: `/config` · Kısayol: `C`

---

## Amaç

Tüm tarama parametrelerini, eşik değerlerini, watchdog ayarlarını ve sistem bilgisini tek yerden yönetme.

---

## Layout — Tab Bazlı

```
┌──────────────────────────────────────────────────────┐
│ [Thresholds] [Scan] [Watchdog] [System]         Tabs │
├──────────────────────────────────────────────────────┤
│ Tab içeriği                                          │
│ [Save Changes] [Reset to Defaults] [Export Config]   │
└──────────────────────────────────────────────────────┘
```

---

## Tab: Thresholds (Eşik Değerleri)

| Ayar | Tip | Default | Açıklama |
|------|-----|---------|----------|
| low_score | Slider (0-100) | 10 | Low threat eşiği |
| medium_score | Slider | 30 | Medium threat eşiği |
| high_score | Slider | 50 | High threat eşiği |
| critical_score | Slider | 70 | Critical threat eşiği |
| export_min_score | Slider | 10 | Rapor oluşturma min skoru |
| auto_response | Toggle | OFF | Otomatik müdahale |
| auto_response_min | Slider | 70 | Otomatik müdahale min skoru |

Slider'ların yanında renk bantlı preview bar.

## Tab: Scan (Tarama Ayarları)

| Ayar | Tip | Default | Açıklama |
|------|-----|---------|----------|
| interval_secs | Number | 300 | Tarama aralığı (saniye) |
| daemon_mode | Toggle | OFF | Sürekli çalışma modu |
| max_threads | Number | 4 | Paralel tarama sayısı |
| scan_network | Toggle | ON | Ağ taraması |
| scan_memory | Toggle | ON | Bellek taraması |
| scan_security | Toggle | ON | Güvenlik analizi |
| scan_kernel | Toggle | ON | Kernel izleme |
| memory_max_region_mb | Number | 64 | Maks bellek bölge boyutu |
| network_dns_lookup | Toggle | ON | DNS zenginleştirme |

## Tab: Watchdog

| Ayar | Tip | Default | Açıklama |
|------|-----|---------|----------|
| enabled | Toggle | ON | Watchdog aktif |
| heartbeat_interval | Number | 10 | Heartbeat aralığı (sn) |
| restart_delay | Number | 5 | Yeniden başlatma bekleme |
| max_restarts | Number | 3 | Maks yeniden başlatma |
| sentinel_log | Text | /var/log/ironsight-watchdog.log | Log dosyası |

## Tab: System

Salt okunur sistem bilgileri:

| Bilgi | Değer |
|-------|-------|
| Hostname | `sec-ops-01` |
| OS | Linux 6.8.0-amd64 |
| Uptime | 14d 6h 23m |
| Rust Version | 1.78.0 |
| IronSight Version | 0.1.0 |
| Config Path | /etc/ironsight/config.toml |
| Report Dir | /var/lib/ironsight/reports |
| Dump Dir | /var/lib/ironsight/dumps |

### Privileges

| Yetki | Durum |
|-------|-------|
| CAP_SYS_PTRACE | ✅ Var |
| CAP_KILL | ✅ Var |
| NET_READ | ✅ Var |
| PROC_MAPS | ✅ Var |
| Root Access | ❌ Yok |

`[Privilege Escalation Guide]` butonu → yetki yükseltme talimatları.
