# Security Audit — Sayfa Spesifikasyonu

> Route: `/security` · Kısayol: `S`

---

## Amaç

Binary bütünlük analizi: hash doğrulama, entropy görselleştirme, imza durumu ve path analizi.

---

## Layout

```
┌──────────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│ │Audite│ │Flaggd│ │Unsign│ │SuspPa│          Row 1   │
│ │ 342  │ │  18  │ │  45  │ │  12  │                │
│ └──────┘ └──────┘ └──────┘ └──────┘                │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────┐ ┌──────────────────────┐    │
│ │ ENTROPY DISTRIBUTION │ │ SIGNATURE STATUS     │ R2 │
│ │ (histogram)          │ │ (pie chart)          │    │
│ └──────────────────────┘ └──────────────────────┘    │
├──────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐   │
│ │ AUDIT RESULTS TABLE                            │R3 │
│ │ PID · Name · Hash · Entropy · Signed · Path   │   │
│ │ · Flags                                        │   │
│ └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

---

## Bölüm 2: Görselleştirmeler

### Entropy Distribution (Histogram)
- X: Entropy değeri (0–8)
- Y: Process sayısı
- Renk bantları: 0-5 yeşil, 5-7 sarı, 7-7.5 turuncu, 7.5+ kırmızı
- Dağılım normalse çoğu process yeşil bölgede olmalı

### Signature Status (Pie Chart)
- ✅ Signed: X process
- ❌ Unsigned: Y process
- ❓ Unknown: Z process

## Bölüm 3: Audit Results Table

| Kolon | Açıklama |
|-------|----------|
| PID | Process ID |
| Name | Binary ismi |
| SHA-256 | Hash (kısaltılmış, tooltip: full) |
| Entropy | Sayı + risk badge (Low/Med/High/Crit) |
| Signed | ✅/❌/❓ badge |
| Path | Exe path + suspicious uyarısı |
| Flags | Flag sayısı + flag chip'leri |
| ⚡ | Detay butonu |

Satır rengi flag_count'a göre: 0=normal, 1-2=sarı arka plan, 3+=kırmızı arka plan.
