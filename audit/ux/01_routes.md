# IronSight UX — Route Haritası

> Tüm sayfa ve alt-route tanımları.

---

## Ana Route'lar

```
/                          → Dashboard Home
/processes                 → Process Monitor
/processes/:pid            → Process Detay
/processes/:pid/tree       → Process Tree (child'lar)
/processes/:pid/memory     → Process Memory Map
/processes/:pid/network    → Process Network
/threats                   → Threat Analysis (tüm tehditler)
/threats/:pid              → Tek Process Tehdit Detayı
/threats/timeline          → Decay Timeline (zaman bazlı)
/threats/signals           → Signal Kataloğu
/network                   → Network Intelligence
/network/connections       → Aktif Bağlantılar
/network/listeners         → Listener'lar
/network/dns               → DNS Zenginleştirme
/network/topology          → Ağ Topoloji Grafiği
/memory                    → Memory Forensics
/memory/:pid               → Tek Process Memory Analizi
/memory/scanner            → Pattern Scanner Sonuçları
/memory/watcher            → Memory Change Watcher
/security                  → Security Audit
/security/:pid             → Tek Process Güvenlik Analizi
/security/hashes           → Hash Veritabanı
/security/entropy          → Entropy Dashboard
/kernel                    → Kernel Monitor
/kernel/events             → eBPF Event Stream
/kernel/syscalls           → Syscall İstatistikleri
/kernel/tracepoints        → Tracepoint Yapılandırması
/response                  → Response Center
/response/actions          → Aksiyon Geçmişi
/response/exclusions       → Exclusion Listesi Yönetimi
/response/dumps            → Forensik Dump Yönetimi
/reports                   → Reports
/reports/:id               → Tek Rapor Detayı
/reports/export            → SIEM Export Yapılandırması
/reports/scheduled         → Zamanlanmış Raporlar
/config                    → Configuration
/config/thresholds         → Eşik Değerleri
/config/scan               → Tarama Ayarları
/config/watchdog           → Watchdog Yapılandırması
/config/system             → Sistem Bilgisi & Privilege
```

## Route Yapısı Diyagramı

```
ironsight/
├── / (Dashboard Home)
├── /processes
│   ├── /:pid
│   │   ├── /tree
│   │   ├── /memory
│   │   └── /network
│   └── (liste görünümü)
├── /threats
│   ├── /:pid
│   ├── /timeline
│   └── /signals
├── /network
│   ├── /connections
│   ├── /listeners
│   ├── /dns
│   └── /topology
├── /memory
│   ├── /:pid
│   ├── /scanner
│   └── /watcher
├── /security
│   ├── /:pid
│   ├── /hashes
│   └── /entropy
├── /kernel
│   ├── /events
│   ├── /syscalls
│   └── /tracepoints
├── /response
│   ├── /actions
│   ├── /exclusions
│   └── /dumps
├── /reports
│   ├── /:id
│   ├── /export
│   └── /scheduled
└── /config
    ├── /thresholds
    ├── /scan
    ├── /watchdog
    └── /system
```

## Sayfa Geçiş Haritası

| Kaynak | Hedef | Tetikleyici |
|--------|-------|-------------|
| Dashboard → Process Monitor | Threat tablosunda PID tıkla | Process detayına git |
| Dashboard → Threat Analysis | Threat gauge tıkla | Tüm tehditler listesi |
| Process Monitor → Memory | Process satırında "Memory" butonu | O PID'in bellek haritası |
| Process Monitor → Network | Process satırında "Network" butonu | O PID'in ağ bağlantıları |
| Threat Analysis → Response | "Take Action" butonu | Aksiyon alma sayfası |
| Any Page → Reports | Rapor oluştur butonu | Yeni rapor sayfası |
| Network → Threat Analysis | Şüpheli bağlantı tıkla | İlgili process'in tehdit detayı |
| Memory → Threat Analysis | W^X ihlali tıkla | İlgili signal'in detayı |
