# Response Center — Sayfa Spesifikasyonu

> Route: `/response` · Kısayol: `R`

---

## Amaç

Otomatik ve manuel müdahale aksiyonlarını yönetme, forensik dump'ları inceleme ve exclusion listesini düzenleme.

---

## Layout

```
┌──────────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│ │Suspen│ │Killed│ │Dumped│ │Exclud│          Row 1   │
│ │  12  │ │   5  │ │   8  │ │  34  │                │
│ └──────┘ └──────┘ └──────┘ └──────┘                │
├──────────────────────────────────────────────────────┤
│ [Actions] [Exclusions] [Dumps] [Timeline]       Tabs │
├──────────────────────────────────────────────────────┤
│ Tab içeriği burada                                   │
└──────────────────────────────────────────────────────┘
```

---

## Tab: Actions (Aksiyon Geçmişi)

| Kolon | Açıklama |
|-------|----------|
| Zaman | Aksiyon timestamp'i |
| PID | Hedef process |
| Name | Process ismi |
| Action | Suspend / Kill / Dump / ForensicKill |
| Result | ✅ Başarılı / ❌ Başarısız |
| Detay | Hata mesajı veya özet |
| Undo | 🔄 Resume (sadece Suspend için) |

## Tab: Exclusions (Korumalı Process'ler)

İki bölüm:

### System Defaults (Salt okunur)
init, systemd, sshd, gdm, Xorg — değiştirilemez.

### Custom Exclusions (Düzenlenebilir)
| Tip | Değer | Ekleme Tarihi | ⚡ |
|-----|-------|-------------|---|
| Name | nginx | 2026-03-20 | 🗑️ |
| PID | 12345 | 2026-03-21 | 🗑️ |
| Path | /opt/myapp/* | 2026-03-22 | 🗑️ |

`+ Yeni Exclusion Ekle` butonu → modal form.

## Tab: Dumps (Forensik Dump'lar)

| Kolon | Açıklama |
|-------|----------|
| Tarih | Dump zamanı |
| PID | Dump alınan process |
| Name | Process ismi |
| Boyut | Dump dosya boyutu |
| Bölge Sayısı | Dump'taki bellek bölgesi sayısı |
| Path | Dosya yolu |
| ⬇️ | İndir / 🗑️ Sil |

## Tab: Timeline

Tüm aksiyonların zaman çizelgesi görselleştirmesi:
```
10:05 ─── 🔒 PID:666 Suspended
10:05 ─── 📸 PID:666 Memory Dumped (128MB)
10:06 ─── ❌ PID:666 Killed
10:15 ─── 🔒 PID:888 Suspended
10:16 ─── 🔄 PID:888 Resumed (false positive)
```
