# Kernel Monitor — Sayfa Spesifikasyonu

> Route: `/kernel` · Kısayol: `K`

---

## Amaç

eBPF/ETW kernel olaylarını gerçek zamanlı izleme, syscall istatistikleri ve tracepoint yapılandırması.

---

## Layout

```
┌──────────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│ │Events│ │/sec  │ │Alert │ │Traces│         Row 1    │
│ │ 14.2K│ │  847 │ │   3  │ │   6  │                │
│ └──────┘ └──────┘ └──────┘ └──────┘                │
├──────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐   │
│ │ EVENT STREAM (canlı terminal benzeri)           │   │
│ │ 10:05:23.142 mprotect PID:666 rwx→r-x [ALERT] │R2 │
│ │ 10:05:23.145 connect  PID:888 →93.184.216.34   │   │
│ │ 10:05:23.201 execve   PID:1201 /tmp/payload    │   │
│ │ ...                                             │   │
│ └────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────┐ ┌──────────────────────┐    │
│ │ SYSCALL DISTRIBUTION │ │ HOT PROCESSES        │ R3 │
│ │ (bar chart)          │ │ (top event emitters) │    │
│ └──────────────────────┘ └──────────────────────┘    │
├──────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐   │
│ │ TRACEPOINT CONFIG                              │R4 │
│ │ ☑ mprotect  ☑ execve  ☑ connect  ☐ write      │   │
│ └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

---

## Event Stream

Terminal benzeri canlı akış:
- Her satır: `timestamp · syscall_name · PID:name · args · [status]`
- Renkler: mprotect=kırmızı, execve=turuncu, connect=mavi, normal=gri
- `[ALERT]` badge'i — şüpheli olay
- Filtre: PID, syscall tipi, sadece alert'ler
- Pause/Resume butonu
- "Son 1000 olay" buffer

## Syscall Distribution

Son 5 dakikadaki syscall dağılımı bar chart:
- mprotect: ████ 23
- execve: ██████ 45
- connect: ████████ 67
- ptrace: █ 2 (⚠️)

## Hot Processes

En çok kernel olayı üreten process'ler — potansiyel davranış anomalileri:

| PID | Name | Events/min | Top Syscall | Alert |
|-----|------|-----------|-------------|-------|

## Tracepoint Config

Aktif/pasif tracepoint'lerin checkbox listesi ile yönetimi:
- ☑ sys_enter_mprotect
- ☑ sys_enter_execve
- ☑ sys_enter_connect
- ☐ sys_enter_write (event flood riski)
- ☐ sys_enter_read (event flood riski)
