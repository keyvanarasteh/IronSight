# Network Intelligence — Sayfa Spesifikasyonu

> Route: `/network` · Kısayol: `N`

---

## Amaç

Tüm ağ bağlantılarını görselleştirme, şüpheli bağlantıları tespit etme, DNS zenginleştirme ve ağ topoloji haritası.

---

## Layout

```
┌──────────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│ │Total │ │Listen│ │Extern│ │Suspic│          Row 1   │
│ │ 156  │ │  12  │ │  34  │ │   3  │                │
│ └──────┘ └──────┘ └──────┘ └──────┘                │
├──────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐   │
│ │ NETWORK TOPOLOGY MAP                           │R2 │
│ │ (force-directed graph)                         │   │
│ │    [Process] ──── [Remote IP] ──── [Port]      │   │
│ └────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────┤
│ [Connections] [Listeners] [Suspicious] [DNS]    Tabs │
├──────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐   │
│ │ CONNECTION TABLE (filtered by tab)             │R3 │
│ │ PID · Name · Local · Remote · State · Intel    │   │
│ └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

---

## Bölüm 1: Ağ Özeti StatCard'lar

| Kart | Açıklama |
|------|----------|
| Total Sockets | Tüm aktif socket sayısı |
| Listeners | LISTEN durumundaki portlar |
| External | Dış IP'lere bağlantılar |
| Suspicious | Şüpheli port/IP bağlantıları (🔴) |

## Bölüm 2: Network Topology Map

Force-directed graph:
- **Mavi düğümler:** Process'ler (PID + isim)
- **Yeşil düğümler:** Local IP:Port (listener'lar)
- **Turuncu düğümler:** Remote IP'ler (external)
- **Kırmızı düğümler:** Suspicious bağlantılar
- **Kenarlar:** Bağlantı çizgileri (kalınlık = paket sayısı)

Hover → bağlantı detayı, Click → filtreleme.

## Bölüm 3: Tab'lı Bağlantı Tabloları

### Tab: All Connections

| Kolon | Açıklama |
|-------|----------|
| PID | Process ID |
| Name | Process ismi |
| Proto | TCP/UDP |
| Local Addr | Local IP:Port |
| Remote Addr | Remote IP:Port |
| State | ESTABLISHED, LISTEN, TIME_WAIT... |
| DNS | Reverse DNS (varsa) |
| Intel | Suspicious port bilgisi |

### Tab: Listeners
Sadece LISTEN durumundaki socket'lar — "hangi portlar açık?"

### Tab: Suspicious
Kırmızı uyarılı — bilinen kötü portlara bağlantılar.

### Tab: DNS
DNS zenginleştirme sonuçları — IP→hostname çözümlemeleri.
