# Component Library — Paylaşılan Bileşenler

> Tüm sayfalarda kullanılan ortak UI bileşenleri.

---

## StatCard

Özet sayısal bilgi kartı.

```
Props:
  icon: string        ("🔴", "👁️" vs.)
  title: string       ("Total Processes")
  value: number       (342)
  subtitle: string    ("aktif process")
  trend?: number      (+5% veya -3%)
  color?: string      (primary/success/warning/danger)
  onClick?: () => void

Layout:
  ┌──────────────────┐
  │ 🔴 Total Threats │
  │      42          │
  │ aktif process ▲5%│
  └──────────────────┘
```

---

## ThreatGauge

Dairesel tehdit skoru göstergesi.

```
Props:
  score: number (0-100)
  level: ThreatLevel
  size?: "sm" | "md" | "lg"

Layout:
       ╭──────╮
      ╱  87   ╲
     ╱  LOW    ╲
     ╲         ╱
      ╲       ╱
       ╰──────╯
```

---

## DataTable

Sıralanabilir, filtrelenebilir, sayfalanabilir tablo.

```
Props:
  columns: Column[]
  data: Row[]
  searchable?: boolean
  sortable?: boolean
  selectable?: boolean
  pagination?: { pageSize: number }
  onRowClick?: (row) => void
  emptyMessage?: string
  rowClassName?: (row) => string
```

---

## ThreatBadge

Tehdit seviyesi renkli etiket.

```
Props:
  level: "Clean" | "Low" | "Medium" | "High" | "Critical"

Render:
  Clean    → 🟢 yeşil badge
  Low      → 🔵 mavi badge
  Medium   → 🟡 sarı badge
  High     → 🟠 turuncu badge
  Critical → 🔴 kırmızı badge
```

---

## SignalChip

Tek bir heuristic signal'i gösteren chip.

```
Props:
  name: string
  category: SignalCategory
  weight: number

Render:
  [🔒 HIGH_ENTROPY: 30]
```

---

## MemoryMapBar

Horizontal bellek bölge görselleştirmesi.

```
Props:
  regions: MemoryRegion[]
  onRegionClick?: (region) => void
  highlightViolations?: boolean
```

---

## EventStream

Terminal benzeri canlı olay akışı.

```
Props:
  events: KernelEvent[]
  maxBuffer?: number (default: 1000)
  filters?: EventFilter
  paused?: boolean
  onEventClick?: (event) => void
```

---

## TimelineChart

Zaman serisi çizgi grafiği.

```
Props:
  data: TimePoint[]
  xLabel?: string
  yLabel?: string
  zones?: { from: number; to: number; color: string }[]
  timeRange?: "1h" | "6h" | "24h" | "7d"
```

---

## TopologyGraph

Force-directed ağ topoloji grafiği.

```
Props:
  nodes: NetworkNode[]
  edges: Connection[]
  onNodeClick?: (node) => void
  highlightSuspicious?: boolean
```

---

## ActionButton

Kontekst menülü aksiyon butonu.

```
Props:
  actions: Action[]  // [{label, icon, onClick, danger?}]
  
Render:
  ⚡ ▾ → Dropdown: Suspend, Dump, Kill, Export
```

---

## ConfigSlider

Eşik değeri slider'ı (renk bantlı).

```
Props:
  min: number
  max: number
  value: number
  onChange: (v) => void
  zones?: { from: n; to: n; color: string }[]
  label: string
```

---

## NotificationBell

Bildirim merkezi.

```
Props:
  notifications: Notification[]
  unreadCount: number
  onNotificationClick?: (n) => void

Types:
  - THREAT_DETECTED (kırmızı)
  - SCAN_COMPLETE (mavi)
  - ACTION_TAKEN (yeşil)
  - CONFIG_CHANGED (gri)
  - WATCHDOG_ALERT (turuncu)
```

---

## Modal

Genel amaçlı modal dialog.

```
Props:
  title: string
  open: boolean
  onClose: () => void
  size?: "sm" | "md" | "lg" | "full"
  children: ReactNode
  footer?: ReactNode
```

---

## SearchBar

Global arama bileşeni.

```
Props:
  placeholder?: string
  onSearch: (query) => void
  suggestions?: Suggestion[]
  shortcut?: string (default: "/")
```
