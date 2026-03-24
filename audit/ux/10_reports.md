# Reports — Sayfa Spesifikasyonu

> Route: `/reports` · Kısayol: `O`

---

## Amaç

Olay raporlarını görüntüleme, yeni rapor oluşturma, SIEM export yapılandırma ve zamanlanmış raporları yönetme.

---

## Layout

```
┌──────────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│ │Total │ │Today │ │Crit  │ │Export│          Row 1   │
│ │ 156  │ │  12  │ │   3  │ │   2  │                │
│ └──────┘ └──────┘ └──────┘ └──────┘                │
├──────────────────────────────────────────────────────┤
│ [Reports] [Create] [Export Config] [Scheduled]  Tabs │
├──────────────────────────────────────────────────────┤
│ Tab içeriği                                          │
└──────────────────────────────────────────────────────┘
```

---

## Tab: Reports (Rapor Listesi)

| Kolon | Açıklama |
|-------|----------|
| ID | UUID (kısaltılmış) |
| Tarih | Oluşturma zamanı |
| PID | İlgili process |
| Threat Level | Badge |
| Score | Sayı |
| Actions Taken | Alınan aksiyonlar listesi |
| Format | JSON / Text |
| ⬇️ | İndir / 👁️ Görüntüle |

Satır tıkla → rapor detay sayfası (`/reports/:id`).

## Tab: Create (Yeni Rapor)

Form:
- **Hedef:** Specific PID / All threats / System summary
- **Format:** JSON (compact) / JSON (pretty) / Text / CSV
- **Min Level:** Clean / Low / Medium / High / Critical
- **Include:** ☑ Process info ☑ Signals ☑ Network ☑ Memory ☑ Actions
- `[Generate Report]` butonu

## Tab: Export Config (SIEM Entegrasyonu)

### Splunk HEC
- Endpoint URL: `https://splunk.example.com:8088`
- HEC Token: `••••••••`
- Index: `ironsight_events`
- `[Test Connection]` `[Save]`

### Microsoft Sentinel
- Workspace ID: `...`
- Shared Key: `••••••••`
- Log Type: `IronSight_Incidents`
- `[Test Connection]` `[Save]`

### Syslog (CEF)
- Server: `syslog.example.com`
- Port: `514`
- Protocol: TCP / UDP
- `[Test Connection]` `[Save]`

## Tab: Scheduled (Zamanlanmış Raporlar)

| Rapor | Sıklık | Format | Export | Durum | ⚡ |
|-------|--------|--------|-------|-------|---|
| Daily Summary | Her gün 06:00 | JSON | Splunk | ✅ Aktif | ✏️ 🗑️ |
| Weekly Threat | Her Pzt 09:00 | Text | Email | ✅ Aktif | ✏️ 🗑️ |

`+ Yeni Zamanlanmış Rapor` butonu.
