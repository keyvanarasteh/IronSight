# IronSight — Mermaid Diyagramları

> Tüm temel mantık akışlarının görsel açıklamaları.

---

## 1. Ana Tarama Pipeline'ı

```mermaid
flowchart TD
    A["⚙️ Config Yükle"] --> B["🔑 Yetki Kontrol"]
    B --> C["📸 Process Snapshot"]
    C --> D["🔒 Security Audit"]
    C --> E["🌐 Network Audit"]
    C --> F["🧠 Memory Audit"]
    D --> G["🎯 Heuristic Engine"]
    E --> G
    F --> G
    G --> H{"Skor >= Eşik?"}
    H -->|Evet| I["📊 Rapor Oluştur"]
    H -->|Hayır| J["✅ Clean — Logla"]
    I --> K{"Auto Response?"}
    K -->|Evet| L["🛡️ Response Handler"]
    K -->|Hayır| M["📋 Sadece Raporla"]
    L --> N["🔒 Suspend"]
    N --> O["📸 Memory Dump"]
    O --> P["❌ Kill"]

    style A fill:#3b82f6,color:#fff
    style G fill:#f59e0b,color:#000
    style L fill:#ef4444,color:#fff
    style J fill:#10b981,color:#fff
```

---

## 2. Heuristic Puanlama Akışı

```mermaid
flowchart LR
    S1["🔒 High Entropy\nw: 30"] --> E["🎯 Heuristic\nEngine"]
    S2["🌐 Suspicious Port\nw: 25"] --> E
    S3["🧠 W^X Violation\nw: 35"] --> E
    S4["📁 Temp Path\nw: 15"] --> E
    S5["❓ Unsigned\nw: 20"] --> E
    
    E --> SC["Toplam Skor\n125 → cap 100"]
    SC --> TL{"Threat Level"}
    TL -->|0-10| C["🟢 Clean"]
    TL -->|11-30| L["🔵 Low"]
    TL -->|31-50| M["🟡 Medium"]
    TL -->|51-70| H["🟠 High"]
    TL -->|71-100| CR["🔴 Critical"]
    
    CR --> RA["Recommended:\nSuspend+Dump+Kill"]

    style E fill:#f59e0b,color:#000
    style CR fill:#ef4444,color:#fff
```

---

## 3. Decay Engine Mantığı

```mermaid
flowchart TD
    T0["t=0: Skor = 85\n🔴 Critical"] --> T1["t=30dk: Skor = 60\n🟠 High"]
    T1 --> T2["t=1sa: Skor = 42\n🟡 Medium"]
    T2 --> T3["t=2sa: Skor = 21\n🔵 Low"]
    T3 --> T4["t=4sa: Skor = 5\n🟢 Clean"]

    T0 -.->|"Sürekli yüksek CPU"| P["Skor düşmez!\nGerçek tehdit."]

    style T0 fill:#ef4444,color:#fff
    style T1 fill:#f97316,color:#fff
    style T2 fill:#f59e0b,color:#000
    style T3 fill:#3b82f6,color:#fff
    style T4 fill:#10b981,color:#fff
    style P fill:#ef4444,color:#fff
```

---

## 4. Forensik Müdahale Sırası

```mermaid
sequenceDiagram
    participant D as 🎯 Detector
    participant R as 🛡️ Response
    participant P as 💀 Process
    participant F as 📁 Filesystem

    D->>R: Threat Detected (Score: 85)
    R->>R: Check Exclusion List
    Note over R: Process excluded değil

    R->>P: SIGSTOP (Suspend)
    Note over P: Process donduruldu ❄️
    
    R->>P: /proc/PID/mem oku
    P-->>F: Memory dump yazılıyor
    F-->>R: Dump tamamlandı (128MB)
    Note over F: Kanıt güvende ✅
    
    R->>P: SIGKILL (Kill)
    Note over P: Process sonlandırıldı 💀
    
    R->>F: Rapor oluştur
    Note over F: incident_666.json
```

---

## 5. Bellek W^X İhlal Tespiti

```mermaid
flowchart TD
    A["/proc/PID/maps oku"] --> B["Bölgeleri parse et"]
    B --> C{"Her bölge için"}
    C --> D{"İzinler?"}
    D -->|"r--"| OK1["✅ Normal okuma"]
    D -->|"rw-"| OK2["✅ Normal yazma"]
    D -->|"r-x"| OK3["✅ Normal çalıştırma"]
    D -->|"rwx"| ALERT["⚠️ W^X İHLALİ!\nHem yazılabilir\nhem çalıştırılabilir"]
    
    C --> E{"Anonim + exec?"}
    E -->|"Evet"| ANON["⚠️ Anonim\nÇalıştırılabilir\nFileless malware?"]
    E -->|"Hayır"| SAFE["✅ Normal"]

    ALERT --> SIG["🎯 Signal: WX_VIOLATION\nWeight: 35"]
    ANON --> SIG2["🎯 Signal: ANON_EXEC\nWeight: 25"]

    style ALERT fill:#ef4444,color:#fff
    style ANON fill:#f97316,color:#fff
```

---

## 6. Ağ Socket Haritalama

```mermaid
flowchart TD
    A["📂 /proc/net/tcp oku"] --> B["Socket entry'leri parse et"]
    A2["📂 /proc/net/tcp6 oku"] --> B
    A3["📂 /proc/net/udp oku"] --> B
    
    B --> C["🔗 Inode → Socket map"]
    
    D["📂 /proc/PID/fd tara"] --> E["FD → Inode map"]
    
    C --> F["🗺️ Socket ↔ PID\nEşleştirmesi"]
    E --> F
    
    F --> G{"Port kontrol"}
    G -->|"4444, 6667..."| H["🔴 Suspicious Port"]
    G -->|"Normal"| I["External IP kontrol"]
    
    I --> J{"Private IP mi?"}
    J -->|"Hayır"| K["🌐 DNS Lookup"]
    J -->|"Evet"| L["✅ Internal"]

    style H fill:#ef4444,color:#fff
    style K fill:#3b82f6,color:#fff
```

---

## 7. Watchdog Sentinel Döngüsü

```mermaid
flowchart TD
    A["🚀 ironsight başlat"] --> B{"Watchdog\naktif mi?"}
    B -->|Hayır| C["Normal tarama"]
    B -->|Evet| D["Fork: Sentinel process"]
    
    D --> E["Ana process: Tarama"]
    D --> F["Sentinel: İzleme"]
    
    F --> G{"Ana process\ncanlı mı?"}
    G -->|"Evet"| H["⏱️ 10sn bekle"]
    H --> G
    G -->|"Hayır"| I["⚠️ ALARM!\nProcess öldü"]
    I --> J["🔄 Yeniden başlat"]
    J --> E
    
    E --> K{"Anti-tamper\nkontrol"}
    K -->|"Sentinel canlı"| E
    K -->|"Sentinel öldü"| L["⚠️ Tamper detected!"]

    style I fill:#ef4444,color:#fff
    style L fill:#ef4444,color:#fff
```

---

## 8. Dashboard Sayfa Navigasyonu

```mermaid
flowchart TD
    HOME["🏠 Dashboard"] --> PROC["👁️ Process Monitor"]
    HOME --> THREAT["🎯 Threat Analysis"]
    HOME --> NET["🌐 Network Intel"]
    
    PROC --> PROC_D["📋 Process Detay"]
    PROC_D --> MEM["🧠 Memory"]
    PROC_D --> NET2["🌐 Network"]
    PROC_D --> SEC["🔒 Security"]
    
    THREAT --> DECAY["📈 Decay Timeline"]
    THREAT --> SIGNALS["📡 Signal Catalog"]
    THREAT --> RESP["🛡️ Response Center"]
    
    NET --> TOPO["🗺️ Topology"]
    NET --> DNS["🔍 DNS"]
    
    RESP --> ACTIONS["⚡ Actions"]
    RESP --> EXCL["📋 Exclusions"]
    RESP --> DUMPS["💾 Dumps"]
    
    HOME --> REPORT["📊 Reports"]
    HOME --> CONFIG["⚙️ Config"]
    
    REPORT --> SIEM["📤 SIEM Export"]
    CONFIG --> PRIV["🔑 Privileges"]

    style HOME fill:#3b82f6,color:#fff
```
