# Process Monitor — Sayfa Spesifikasyonu

> Route: `/processes` · Kısayol: `P`

---

## Amaç

Sistemdeki tüm process'leri **canlı izleme**, filtreleme, tree görünümü ve detaylı inceleme. SOC analistinin "bu sistemde ne çalışıyor?" sorusuna tam cevap.

---

## Layout

```
┌──────────────────────────────────────────────────────┐
│ [🔍 Ara...] [Filter▾] [View: List | Tree] [⟳ Auto]  │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ ┌──────────┐│
│ │  PROCESS TABLE / TREE VIEW           │ │ DETAIL   ││
│ │                                      │ │ PANEL    ││
│ │  PID  NAME    CPU  MEM  SCORE  SIG   │ │          ││
│ │  ───  ─────   ───  ───  ─────  ───   │ │ Process  ││
│ │  142  nginx   2.1  120M  0    ─      │ │ Info     ││
│ │  666  evil    95.0 128M  85   🔴     │ │          ││
│ │  ├ 667 child  12.0  32M  40   🟠     │ │ Signals  ││
│ │  789  chrome  45.0 512M  10   🟢     │ │          ││
│ │  ...                                 │ │ Actions  ││
│ └──────────────────────────────────────┘ └──────────┘│
├──────────────────────────────────────────────────────┤
│ Status: 342 processes · Last scan: 2s ago · Auto: ON │
└──────────────────────────────────────────────────────┘
```

---

## Toolbar

| Element | Tip | Açıklama |
|---------|-----|----------|
| Arama | Text input | PID, isim, path ile filtrele |
| Filter | Dropdown | Level (Clean/Low/Medium/High/Critical), CPU range, Memory range |
| View Toggle | Segmented | List view ↔ Tree view (parent-child) |
| Auto Refresh | Toggle | 5s/10s/30s/Off seçenekleri |

---

## Process Table Kolonları

| Kolon | Genişlik | Sıralanabilir | Açıklama |
|-------|----------|:---:|----------|
| ☐ | 40px | - | Çoklu seçim checkbox |
| PID | 80px | ✅ | Process ID, link → `/processes/:pid` |
| Name | 180px | ✅ | Process ismi, truncate |
| User | 100px | ✅ | uid:1000 formatı |
| CPU % | 80px | ✅ | Progress bar + sayı |
| Memory | 100px | ✅ | Formatlanmış (MB/GB) |
| Score | 80px | ✅ | Renk kodlu sayı (0-100) |
| Level | 100px | ✅ | Badge |
| Exe Path | flex | - | Truncate, tooltip ile full path |
| ⚡ | 40px | - | Quick action menu |

---

## Tree View

Parent-child ilişkisi ağaç olarak gösterilir:
```
▾ systemd (1)
  ├── sshd (450)
  │   └── bash (1200)
  │       └── python (1201)
  ├── nginx (142)
  │   ├── worker (143)
  │   └── worker (144)
  └── cron (300)
```

Aynı kolonlar + indent level.

---

## Detail Panel (Sağ Kenar)

Process satırı tıklandığında sağda açılır:

### Tab 1: Overview
- Process adı, PID, PPID, user, start time
- CPU/Memory canlı mini grafik (son 5dk)
- Command line (tam metin)
- Exe path, CWD

### Tab 2: Signals
- Aktif sinyal listesi (ikon + ağırlık + açıklama)
- Toplam skor ve level badge

### Tab 3: Network
- O PID'in aktif socket'ları (mini tablo)
- Listener'lar, external bağlantılar

### Tab 4: Memory
- Bellek bölge özeti (toplam, W^X, anonim)
- Mini memory map görselleştirmesi

### Tab 5: Actions
- 🔒 Suspend · 📸 Dump Memory · ❌ Kill
- ➕ Exclusion'a Ekle
- 📊 Rapor Oluştur

---

## Batch Actions (Çoklu Seçim)

Checkbox ile birden fazla process seçildiğinde toolbar'da:
- `Suspend Selected (3)`
- `Kill Selected (3)`
- `Export Selected`
- `Add to Exclusions`
