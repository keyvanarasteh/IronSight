# Memory Forensics — Sayfa Spesifikasyonu

> Route: `/memory` · Kısayol: `M`

---

## Amaç

Process bellek bölgelerini görselleştirme, W^X ihlallerini tespit etme, pattern tarama sonuçlarını gösterme ve bellek değişikliklerini izleme.

---

## Layout

```
┌──────────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│ │Region│ │ W^X  │ │AnonEx│ │Patter│          Row 1   │
│ │ 1842 │ │   4  │ │   7  │ │  12  │                 │
│ └──────┘ └──────┘ └──────┘ └──────┘                │
├──────────────────────────────────────────────────────┤
│ [Process Picker ▾ PID:666 evil_payload]              │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐ │
│ │ MEMORY MAP VISUALIZATION                         │ │
│ │ ┌────┐┌──┐┌────────────┐┌──┐┌────┐┌──────┐     │ │
│ │ │.text││.d││   heap     ││li││stac││[anon]│     │ │
│ │ │r-x  ││rw││   rw-      ││r-││rw- ││ rwx ⚠│    │ │
│ │ └────┘└──┘└────────────┘└──┘└────┘└──────┘     │ │
│ └──────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────┤
│ [Regions] [Violations] [Patterns] [Changes]     Tabs │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐ │
│ │ DETAIL TABLE                                     │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## Bölüm: Memory Map Visualization

Horizontal bar chart olarak bellek bölgeleri:
- Her bölge **genişliği size'a orantılı** dikdörtgen
- Renk kodları:
  - `r--` Mavi (okuma)
  - `rw-` Yeşil (normal)
  - `r-x` Sarı (çalıştırılabilir)
  - `rwx` **Kırmızı** (W^X ihlali — ⚠️ ikon)
- Hover → bölge detayı (adres, izinler, pathname)
- Tıkla → o bölgenin pattern tarama sonuçları

## Tabs

### Regions
Tüm bellek bölgelerinin tablosu:
| Adres Aralığı | İzinler | Boyut | Pathname | Flags |
|---|---|---|---|---|

### Violations  
Sadece W^X ihlalleri ve anonim çalıştırılabilir bölgeler — kırmızı vurgu.

### Patterns
Pattern tarama sonuçları:
| Kalıp | Bölge | Offset | Bağlam (hex+ASCII) | Tehlike |
|---|---|---|---|---|

### Changes (Watcher)
İki tarama arasındaki bellek değişiklikleri:
- 🟢 Yeni bölge eklendi
- 🔴 Bölge silindi
- 🟠 İzin değişti (özellikle rw- → rwx ⚠️)
- 🔵 Boyut değişti
