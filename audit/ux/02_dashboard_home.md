# Dashboard Home — Sayfa Spesifikasyonu

> Route: `/` · Kısayol: `D`

---

## Amaç

SOC analistinin **ilk baktığında** sistem durumunu anlaması. Bir saniyede: kaç process var, kaç tehdit algılandı, sistem sağlığı nasıl.

---

## Bölüm Düzeni (Layout)

```
┌──────────────────────────────────────────────────────────┐
│ TOPBAR: Logo · Arama · Bildirimler · Son Tarama · Priv   │
├──────────┬───────────────────────────────────────────────┤
│          │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│ SIDEBAR  │ │ Stat │ │ Stat │ │ Stat │ │ Stat │  Row 1  │
│          │ └──────┘ └──────┘ └──────┘ └──────┘         │
│  🏠 ◀── │ ┌────────────────────┐ ┌──────────────┐      │
│  👁️     │ │  THREAT GAUGE      │ │  SCAN STATUS │ Row 2 │
│  🎯     │ │  (büyük daire)     │ │  (timeline)  │      │
│  🌐     │ └────────────────────┘ └──────────────┘      │
│  🧠     │ ┌────────────────────────────────────────┐    │
│  🔒     │ │  TOP THREATS TABLE                     │ R3 │
│  ⚡     │ │  PID · Name · Score · Level · Signals  │    │
│  🛡️     │ │  ...                                   │    │
│  📊     │ └────────────────────────────────────────┘    │
│  ⚙️     │ ┌──────────────┐ ┌──────────────┐            │
│          │ │ RECENT ACTS  │ │ SYSTEM INFO  │      Row 4 │
│          │ └──────────────┘ └──────────────┘            │
└──────────┴───────────────────────────────────────────────┘
```

---

## Bölüm 1: Özet İstatistikler (Row 1)

**4 StatCard** yan yana:

| Kart | İkon | Değer Örneği | Alt Metin |
|------|------|-------------|-----------|
| Total Processes | 👁️ | 342 | "aktif process" |
| Threats Found | 🚨 | 7 | "son taramada" |
| Critical | 🔴 | 2 | "acil müdahale" |
| System Score | ✅ | 87/100 | "genel güvenlik puanı" |

**Bileşen:** `<StatCard icon title value subtitle trend />`

---

## Bölüm 2: Threat Gauge + Scan Status (Row 2)

### Sol: ThreatGauge
- **Büyük daire gauge** (0–100 arası)
- Renk: 0-30 yeşil, 30-60 sarı, 60-80 turuncu, 80-100 kırmızı
- Ortasında büyük skor sayısı
- Altında: "Clean | Low | Medium | High | Critical" badge'i

**Bileşen:** `<ThreatGauge score={87} level="Low" />`

### Sağ: Scan Timeline
- Son 24 saatteki tarama sonuçları mini çizgi grafiği
- X: zaman, Y: algılanan tehdit sayısı
- Renk bantları: yeşil/sarı/kırmızı bölgeler

**Bileşen:** `<ScanTimeline data={last24h} />`

---

## Bölüm 3: Top Threats Table (Row 3)

**DataTable** — en tehlikeli process'ler skor sırasıyla:

| Kolon | Genişlik | Tip |
|-------|----------|-----|
| PID | 80px | Sayı, tıklanabilir → `/processes/:pid` |
| Name | 200px | Metin, truncate |
| Score | 100px | Progress bar + sayı |
| Level | 100px | Badge (Clean/Low/Medium/High/Critical) |
| Signals | flex | Chip listesi |
| Aksiyonlar | 120px | 🔍 Detay · ⚡ Aksiyon |

**Bileşen:** `<ThreatTable data={assessments} limit={10} onRowClick={goToProcess} />`

---

## Bölüm 4: Recent Actions + System Info (Row 4)

### Sol: Recent Actions
Son 5 otomatik aksiyon:
- `✅ PID 1234 suspended — 2 dk önce`
- `❌ PID 5678 kill failed — 5 dk önce`

### Sağ: System Info
- Hostname, OS, uptime
- Privilege Level badge
- Watchdog durumu
- Son config yükleme zamanı

---

## Quick Actions (Floating)

Sağ alt köşede **FAB (Floating Action Button)**:
- 🔄 Yeni Tarama Başlat
- 📊 Rapor Oluştur
- ⚙️ Hızlı Ayarlar
