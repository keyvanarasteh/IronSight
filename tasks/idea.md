# IronSight — Process Spy: Fikir Dokümanı

> Keyvan Arasteh · Qix Labs · 2026

---

## Neden Önemli?

Her gün duyuyoruz — şu şirket hacklendi, şu altyapı çöktü, veriler sızdı. Ama saldırının %90'ı bir **process** ile başlıyor. Birisi bir binary çalıştırıyor, o binary RAM'de payload açıyor, ağa bağlanıyor, veri gönderiyor. 

> "Sence bir saldırgan sisteme girdiğinde ilk ne yapar?"

Cevap basit — bir **process** başlatır. O process'i yakalayamazsanız, kaybettiniz.

---

## Gerçek Hayatta Ne Olur?

### Senaryo 1: Fileless Malware

Saldırgan sisteme giriyor. Diske hiçbir şey yazmıyor. RAM'de buffer açıyor, o buffer'a shellcode yazıyor, protection'ı `RW` → `RX` yapıyor — artık kod çalışıyor. Antivirüs? Dosya yok ki tarasın.

> "Röntgen çekmek yetmez burada — ameliyata girmemiz lazım. Program çalışırken, RAM'in içine bakacağız."

### Senaryo 2: DLL Sideloading

Meşru bir process — `svchost.exe`. Herkes güveniyor. Ama içine zararlı bir DLL yüklenmiş. Task Manager'da normal görünüyor. Process listesine bakıyorsun — sorun yok gibi. Ama modülleri listelediğinde, `/tmp/` altından yüklenmiş bir `.dll` var.

> "Araba çalışıyor, dışarıdan bakınca her şey normal. Ama motor kapağını açtığında, birisi motor bloğuna bir cihaz bağlamış."

### Senaryo 3: C2 Callback

Bir process arka planda çalışıyor. CPU %0.1, RAM 5 MB — dikkat çekmiyor. Ama network'e bakıyorsun — her 30 saniyede bir Rusya'daki bir IP'ye bağlanıyor. Neden? **Command & Control** sunucusundan komut bekliyor.

> "Telefon faturası geldi, hiç aramadığın numaralar var. Birisi telefonunu kullanmış — ama kim?"

---

## Nasıl Yapacağız?

Basit bir process monitor'den başlıyoruz. Sonra katman katman ekliyoruz — tıpkı güvensiz Flask sunucusunu adım adım güvenli hale getirdiğimiz gibi:

```
v1: Process Spy         → Kim çalışıyor? (PID, CPU, RAM, ağaç yapısı)
v2: + Security Audit    → Güvenilir mi? (Hash, entropi, imza kontrolü)
v3: + Network Mapping   → Nereye bağlanıyor? (Socket → PID eşleştirme)
v4: + Memory Scanner    → RAM'de ne saklıyor? (IP, URL, shellcode tarama)
v5: + Memory Watcher    → RAM'de ne değişti? (RW→RX geçişi, yeni allocation)
v6: + Kernel Listener   → Gerçek zamanlı! (eBPF Linux, ETW Windows)
v7: + Heuristic Engine  → Tehdit puanı (0-100 skorlama)
v8: + Response Handler  → Otomatik müdahale (Dondur→Dump→Öldür)
v9: + SIEM Reporter     → Raporlama (JSON → Splunk/Sentinel)
v10: + Dioxus Dashboard → Görsel komuta merkezi
```

---

## Teknik Altyapı — Neden Rust?

| Özellik | Neden Rust? |
|---------|-------------|
| **Performans** | C seviyesinde hız — sysinfo ile binlerce process'i milisaniyede tarama |
| **Bellek Güvenliği** | Buffer overflow yok — güvenlik aracı kendisi güvenli olmalı |
| **Cross-Platform** | Tek codebase → Windows + macOS + Linux |
| **eBPF Desteği** | Aya framework ile kernel seviyesinde monitor |
| **Serde Ekosistemi** | JSON/SIEM raporlama doğal |
| **Async Runtime** | Tokio ile çoklu sensör yönetimi |

> "Telegram neden C kullanıyor? Performans. Biz neden Rust kullanıyoruz? Performans + güvenlik. C'nin buffer overflow riskini almıyoruz."

---

## Modüler Mimari — Parçalara Böl

> "İşlemleri parçalara bölüp modül modül yapmanız lazım. Her modülü test edip kilitlemeniz lazım."

| Modül | Sorumluluğu | SecOps Değeri | RE Değeri |
|-------|-------------|---------------|-----------|
| **ProcessSpy** | Snapshot, diff, ağaç, filtre | Yeni/çıkan process tespiti | Process ilişki analizi |
| **SecurityAudit** | SHA-256, entropi, imza | VirusTotal eşleşme | Packed binary tespiti |
| **NetworkMapper** | Socket→PID eşleme | C2 callback yakalama | API davranış haritalama |
| **MemoryScanner** | RAM string tarama | Deobfuscated artifact bulma | In-memory config çıkarma |
| **MemoryWatcher** | Region diff, hash | RW→RX geçiş algılama | Injection noktası bulma |
| **KernelListener** | eBPF/ETW hook | Gerçek zamanlı alert | Syscall izleme |
| **HeuristicEngine** | Ağırlıklı puanlama | Zero-day teknik tespiti | Attribution analizi |
| **ResponseHandler** | Dondur/Dump/Kill | Data exfil önleme | Debugger bağlantısı |
| **ReportGenerator** | SIEM JSON | SOC timeline | Forensic kanıt |
| **DioxusUI** | Masaüstü dashboard | Komuta merkezi | Görsel analiz |

---

## Karşılaştırma — IronSight vs Mevcut Araçlar

| Özellik | Task Manager | htop | IronSight |
|---------|-------------|------|-----------|
| Process listesi | ✅ | ✅ | ✅ |
| CPU/RAM izleme | ✅ | ✅ | ✅ |
| Process ağacı | ❌ | ✅ | ✅ |
| Diff (yeni/çıkan) | ❌ | ❌ | ✅ |
| Hash doğrulama | ❌ | ❌ | ✅ |
| Entropi analizi | ❌ | ❌ | ✅ |
| Socket → PID | ❌ | ❌ | ✅ |
| RAM string tarama | ❌ | ❌ | ✅ |
| RW→RX algılama | ❌ | ❌ | ✅ |
| Kernel hookları | ❌ | ❌ | ✅ |
| Tehdit puanı | ❌ | ❌ | ✅ |
| Otomatik müdahale | ❌ | ❌ | ✅ |
| SIEM entegrasyonu | ❌ | ❌ | ✅ |
| Masaüstü UI | ❌ | ❌ | ✅ |

> "Task Manager ne yapıyor? Kim çalışıyor gösteriyor. IronSight ne yapıyor? Kim çalışıyor, güvenilir mi, nereye bağlanıyor, RAM'de ne saklıyor, tehlikeli mi, ne yapmalıyız — hepsini otomatik söylüyor."

---

## Sonuç

IronSight sadece bir process monitor değil — **Rust tabanlı, modüler, cross-platform bir EDR (Endpoint Detection & Response) sistemi**. 

Katman katman inşa ediyoruz:
1. **Algılama** → ProcessSpy + Kernel Listener
2. **Analiz** → MemoryScanner + MemoryWatcher
3. **İstihbarat** → HeuristicEngine
4. **Aksiyon** → ResponseHandler (Dondur→Dump→Kill)
5. **Raporlama** → SIEM-ready JSON
6. **Görselleştirme** → Dioxus masaüstü dashboard

> "Bir güvenlik aracı yapıyoruz — ama o aracın kendisi de güvenli olacak. Rust bize bunu garanti ediyor."
