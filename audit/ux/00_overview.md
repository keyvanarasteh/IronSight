# IronSight UX — Genel Mimari

> Tüm denetim bulguları düzeltilmiş varsayılarak tasarlanan kapsamlı EDR dashboard mimarisi.

---

## Tasarım Felsefesi

IronSight dashboard'u **SOC analisti perspektifinden** tasarlanmıştır:
- İlk bakışta sistem durumunu görmek (Dashboard Home)
- Derine inmek istediğinde tek tıkla detaya ulaşmak (Drill-down)
- Kritik aksiyonları hızlı almak (Quick Actions)
- 7/24 izleme için göz yorgunluğu düşük dark theme

## Uygulama Katmanları

```
┌─────────────────────────────────────────────────────┐
│  Shell (Sidebar + TopBar + NotificationCenter)      │
├─────────────────────────────────────────────────────┤
│  Router → Page Views                                │
│  ┌─────────────────────────────────────────────────┐│
│  │  Page → Sections → Widgets/Cards/Tables         ││
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐     ││
│  │  │ StatCard  │ │ DataTable │ │ LiveChart │     ││
│  │  └───────────┘ └───────────┘ └───────────┘     ││
│  └─────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│  Backend Services (Rust/Tokio)                      │
│  ┌──────┐ ┌──────────┐ ┌────────┐ ┌──────────┐    │
│  │ Core │ │ Heuristic│ │ Memory │ │ Network  │    │
│  └──────┘ └──────────┘ └────────┘ └──────────┘    │
│  ┌──────┐ ┌──────────┐ ┌────────┐ ┌──────────┐    │
│  │Kernel│ │ Security │ │Response│ │  Report  │    │
│  └──────┘ └──────────┘ └────────┘ └──────────┘    │
└─────────────────────────────────────────────────────┘
```

## Navigasyon Yapısı

### Sidebar (Sol Panel — Sabit)

| İkon | Etiket | Route | Kısayol |
|------|--------|-------|---------|
| 🏠 | Dashboard | `/` | `D` |
| 👁️ | Process Monitor | `/processes` | `P` |
| 🎯 | Threat Analysis | `/threats` | `T` |
| 🌐 | Network Intel | `/network` | `N` |
| 🧠 | Memory Forensics | `/memory` | `M` |
| 🔒 | Security Audit | `/security` | `S` |
| ⚡ | Kernel Monitor | `/kernel` | `K` |
| 🛡️ | Response Center | `/response` | `R` |
| 📊 | Reports | `/reports` | `O` |
| ⚙️ | Configuration | `/config` | `C` |

### TopBar (Üst Panel)

- **Sol:** IronSight logosu + sistem durumu badge
- **Orta:** Global arama (`/` kısayolu)
- **Sağ:** Bildirim çanı (sayaç), Son tarama zamanı, Privilege durumu

## Renk Paleti (Dark Theme)

| Kullanım | Renk | Hex |
|----------|------|-----|
| Background | Koyu Lacivert | `#0a0e1a` |
| Card BG | Derin Gri | `#111827` |
| Card Border | Çelik Mavi | `#1e293b` |
| Primary | Electric Mavi | `#3b82f6` |
| Success/Clean | Zümrüt | `#10b981` |
| Warning/Medium | Amber | `#f59e0b` |
| Danger/Critical | Kızıl | `#ef4444` |
| Text Primary | Beyaz | `#f1f5f9` |
| Text Secondary | Gri | `#94a3b8` |

## Sayfa Listesi (11 Sayfa)

1. **Dashboard Home** — Sistem genel bakış, canlı threat gauge, özet istatistikler
2. **Process Monitor** — Canlı process listesi, tree view, detay paneli
3. **Threat Analysis** — Heuristic puanlama, signal breakdown, decay timeline
4. **Network Intelligence** — Socket haritası, bağlantı grafiği, DNS zenginleştirme
5. **Memory Forensics** — Bellek haritası, W^X tespiti, pattern tarama sonuçları
6. **Security Audit** — Binary bütünlük analizi, entropy grafiği, imza durumu
7. **Kernel Monitor** — eBPF event stream, syscall istatistikleri, gerçek zamanlı uyarılar
8. **Response Center** — Aksiyon geçmişi, forensik dump yönetimi, exclusion listesi
9. **Reports** — Olay raporları, SIEM export, rapor takvimi
10. **Configuration** — Eşikler, tarama ayarları, watchdog, genel ayarlar
11. **Component Library** — Paylaşılan UI bileşenleri (StatCard, ThreatGauge, DataTable vb.)
