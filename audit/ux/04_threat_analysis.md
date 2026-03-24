# Threat Analysis — Sayfa Spesifikasyonu

> Route: `/threats` · Kısayol: `T`

---

## Amaç

Heuristic engine sonuçlarını görselleştirme, signal breakdown, decay timeline ve tehdit korelasyonu.

---

## Layout

```
┌──────────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │Clean │ │ Low  │ │ Med  │ │ High │ │Crit  │ Row 1  │
│ │ 280  │ │  42  │ │  12  │ │   5  │ │   2  │       │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────┐ ┌──────────────────────┐    │
│ │ THREAT DISTRIBUTION  │ │ CATEGORY BREAKDOWN   │ R2 │
│ │ (donut chart)        │ │ (horizontal bars)    │    │
│ └──────────────────────┘ └──────────────────────┘    │
├──────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐   │
│ │ DECAY TIMELINE (son 24 saat)                   │R3 │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│ └────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐   │
│ │ SIGNAL CATALOG (tüm aktif sinyaller)           │R4 │
│ └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

---

## Bölüm 1: Level Dağılımı (5 StatCard)

Her tehdit seviyesi için renk kodlu sayaç kartı. Tıklanabilir → o seviyeye filtrele.

## Bölüm 2: Görselleştirmeler

### Donut Chart — Threat Distribution
- 5 dilim: Clean, Low, Medium, High, Critical
- Ortada toplam process sayısı
- Hover → yüzde ve sayı

### Horizontal Bars — Category Breakdown
Her `SignalCategory` için toplam ağırlık:
- ProcessBehavior: ██████████ 45
- NetworkAnomaly: ████████ 38
- MemoryAnomaly: ██████ 28
- StaticAnalysis: █████ 25
- FilesystemAnomaly: ██ 12

## Bölüm 3: Decay Timeline

Zaman serisi grafiği:
- X: son 24 saat (veya configurable)
- Y: toplam threat skoru / aktif tehdit sayısı
- Renk bantları: arka planda yeşil/sarı/kırmızı zone'lar
- Her process'in skor çizgisi (hover için)
- Decay etkisi görselleştirilmiş — skor zamanla düşüyor

## Bölüm 4: Signal Catalog

Tüm aktif sinyallerin grouped listesi:

| Signal | Category | Weight | Active | Açıklama |
|--------|----------|--------|--------|----------|
| HIGH_ENTROPY | StaticAnalysis | 30 | 3 process | Packed/encrypted binary |
| SUSPICIOUS_PORT | NetworkAnomaly | 25 | 1 process | Known malicious port |
| WX_VIOLATION | MemoryAnomaly | 35 | 2 process | W^X policy violation |
| ... | ... | ... | ... | ... |

Tıkla → o sinyali veren tüm process'leri filtrele.
