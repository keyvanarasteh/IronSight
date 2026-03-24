# IronSight — Uygulama Yol Haritası

> Keyvan Arasteh · Qix Labs · 2026
>
> Her adım bir öncekinin üzerine inşa ediliyor — tıpkı güvensiz Flask sunucusunu katman katman güçlendirdiğimiz gibi.

---

## Faz 1: Temel — "Kim Çalışıyor?"

> "Task Manager ne yapıyor? Process listesi gösteriyor. Biz de oradan başlayacağız — ama çok daha fazlasını yapacağız."

### Adım 1.1: Process Enumeration Core

**Ne:** Tüm çalışan process'leri anlık olarak listele.

**Nasıl:**
- `sysinfo` crate ile cross-platform process tarama
- `ProcessInfo` struct — PID, parent PID, isim, exe yolu, cmd args, CWD, CPU%, RAM, thread sayısı, UID/GID
- `ProcessSnapshot` — bir andaki tüm process'lerin HashMap'i + sistem bellek/CPU bilgisi

**Pratik İpucu:**
> "100.000 satır doğru, 1 satır yanlış — o satır sorunu yaratıyor. `from_sysinfo` fonksiyonunda her alanı doğru map'lediğinden emin ol."

**Çıktı:** `snapshot()` çağırınca tüm sistem görüntüsü alabilme.

---

### Adım 1.2: Sıralama ve Filtreleme

**Ne:** Process'leri CPU, RAM, isim, yol, durum bazında sorgula.

**Nasıl:**
- `by_cpu()`, `by_memory()` — azalan sıralama
- `find_by_name()`, `find_by_pid()`, `find_by_path()` — arama
- `ProcessFilter` — chainable builder pattern:

```rust
ProcessFilter::new(&snapshot)
    .name_contains("chrome")
    .cpu_above(10.0)
    .memory_above_mib(100.0)
    .collect();
```

**Analoji:**
> "Polis kontrol noktası — herkesi durdurma, sadece belirli plakalıları çevir. `ProcessFilter` de böyle — kriterlerini ver, sadece uyanları getir."

---

### Adım 1.3: Process Tree & İlişkiler

**Ne:** Parent-child ilişkilerini ağaç yapısında göster.

**Nasıl:**
- `tree()` → `HashMap<u32, Vec<u32>>` — parent → children
- `children_of(pid)` — belirli bir PID'nin çocukları

**SecOps Değeri:**
> "Bir process'in kim tarafından başlatıldığını bilmek çok önemli. `notepad.exe`'yi `explorer.exe` başlattıysa normal. `cmd.exe` başlattıysa — neden?"

---

### Adım 1.4: Snapshot Diff — Ne Değişti?

**Ne:** İki snapshot arasındaki farkları bul — yeni gelen, çıkan, değişen process'ler.

**Nasıl:**
- `ProcessDiff::compute(old, new)` → `spawned`, `exited`, `changed`
- `ProcessChange` — CPU delta, memory delta, status değişimi
- Eşik: CPU >1.0% veya RAM >1MB veya status değişimi

**Senaryo:**
> "5 saniye önceki fotoğrafla şimdiki fotoğrafı karşılaştır. Yeni gelen bir process var — kim o? Nereden geldi? Bu, fileless malware'in ilk adımını yakalar."

---

### Adım 1.5: Continuous Monitoring & Events

**Ne:** Arka planda sürekli izleme, event'leri channel'a aktar.

**Nasıl:**
- `start_monitoring(interval)` — arka plan thread'i
- `crossbeam_channel` ile `SpyEvent` enum: Snapshot, Diff, ProcessSpawned, ProcessExited
- `subscribe()` — event stream'e bağlan

**Mimari İpucu:**
> "Middleware sırası gibi düşün — önce snapshot al, sonra diff hesapla, sonra event gönder. Sırayı bozma."

---

### Adım 1.6: Process Actions — Kill & Signal

**Ne:** Process'leri durdur veya sinyal gönder.

**Nasıl:**
- `kill(pid)` — SIGKILL (Unix) / TerminateProcess (Windows)
- `signal(pid, Signal)` — POSIX sinyalleri (SIGSTOP, SIGCONT, vb.)
- `wait_for_exit(pid)` — process çıkışını bekle
- `wait_for_spawn(name, timeout)` — belirli isimde process başlamasını bekle

---

## Faz 2: Güvenlik Katmanı — "Güvenilir mi?"

> "Araba çalışıyor, dışarıdan her şey normal. Ama motor kapağını açıp bakman lazım."

### Adım 2.1: Binary Integrity — Hash & Entropi

**Ne:** Process'in disk üzerindeki binary'sini doğrula.

**Nasıl:**
- `sha2` crate ile SHA-256 hesapla → VirusTotal lookup
- `entropy` crate ile Shannon entropi → 7.5+ = packed/encrypted (kırmızı bayrak)

**Analoji:**
> "Röntgen çekiyoruz — programı çalıştırmadan içerisine bakıyoruz. Hash = parmak izi, entropi = yoğunluk ölçümü."

| Entropi | Anlam | Tehlike |
|---------|-------|---------|
| 0–5.0 | Normal uygulama | ✅ Düşük |
| 5.0–7.0 | Sıkıştırılmış/obfuscated | ⚠️ Dikkat |
| 7.0–7.5 | Muhtemelen packed | 🔶 Şüpheli |
| 7.5+ | Büyük ihtimalle encrypted malware | 🔴 Tehlikeli |

---

### Adım 2.2: Signature Verification

**Ne:** Binary'nin dijital imzasını kontrol et.

**Nasıl:**
- Windows: Authenticode signature (`cross-authenticode` crate)
- macOS: Developer ID doğrulama
- Linux: PGP / distro imza kontrolü

**Soru:**
> "Niye bir sertifika 400 TL, niye bir sertifika 40.000 TL? Aynı mantık burada — imzalı binary güvenilir, imzasız binary şüpheli."

---

### Adım 2.3: Loaded Module Enumeration

**Ne:** Process'in yüklediği tüm DLL/SO/DYLIB dosyalarını listele.

**Nasıl:**
- `procmod-core` crate ile cross-platform module listing
- `/tmp/` veya `AppData/Temp` altındaki modülleri bayrakla

**Senaryo:**
> "svchost.exe çalışıyor — normal. Ama modüllerini listelediğinde, `/tmp/malicious.dll` yüklenmiş. DLL Sideloading — meşru process'e zararlı modül enjekte edilmiş."

---

### Adım 2.4: Suspicious Path Detection

**Ne:** Process'lerin çalıştırıldığı dizini analiz et.

**Kontrol Listesi:**
- `/tmp/`, `/var/tmp/` (Linux)
- `AppData\Local\Temp` (Windows)
- `Downloads/` dizini
- Boş exe yolu (fileless)

> "Burası staging alanı — saldırganlar genellikle geçici dizinlere payload bırakıyor."

---

## Faz 3: Ağ Katmanı — "Nereye Bağlanıyor?"

> "Telefon faturası geldi, hiç aramadığın numaralar var. Process'ler de böyle — soketi açıyoruz, kime bağlanıyor bakıyoruz."

### Adım 3.1: Socket → PID Mapping

**Ne:** Her network bağlantısını hangi process'in yaptığını eşle.

**Nasıl:**
- `listeners` crate — cross-platform socket enumeration
- PID + Local Address + Remote Address + Port + Protocol + State

---

### Adım 3.2: Listener Detection

**Ne:** Non-standard portlarda dinleyen process'leri tespit et.

**Kırmızı Bayraklar:**
- Standart olmayan portlar (4444, 8888, 1337)
- `LISTEN` state'inde bekleyen arka plan process'leri
- Remote bağlantıya açık servisler

> "600-700 tane kapım var — hangisi açık? Hangisi yetkisiz?"

---

### Adım 3.3: DNS Enrichment

**Ne:** Remote IP'leri domain'e çözümle.

**SecOps Değeri:**
> "IP adresi görüyorsun — 185.x.x.x. Ama domain'e çevirdiğinde `evil-c2-server.ru` çıkıyor. Artık resim netleşti."

---

## Faz 4: Bellek Katmanı — "RAM'de Ne Saklıyor?"

> "Ameliyata giriyoruz — program çalışırken, canlı canlı içine bakacağız."

### Adım 4.1: Memory Scanner — Pattern Tarama

**Ne:** Process'in RAM'inde IP, URL, shellcode gibi pattern'leri tara.

**Nasıl:**
- `procmod-core` ile readable region'ları enumerate et
- `regex::bytes` ile byte-safe pattern matching (unicode=false)
- Guard page'leri atla — okuma yapma, crash'e neden olma

**Güvenlik Kuralları:**
- SADECE `READ` izinli region'ları tara
- Guard page → atla
- Unmapped region → atla
- UTF-8 olmayan veri → `from_utf8_lossy` ile handle et

**Pattern'ler:**
```
IPv4:       \b(?:\d{1,3}\.){3}\d{1,3}\b
URL:        https?://[^\s/$.?#].[^\s]*
Shellcode:  /bin/sh|cmd\.exe|powershell\.exe
```

---

### Adım 4.2: Memory Watcher — Değişim Takibi

**Ne:** RAM bölgelerindeki değişiklikleri izle.

**3 Kritik Event:**
1. **Yeni Allocation** — `VirtualAlloc`/`mmap` ile yeni bölge oluştu
2. **Protection Transition** — `RW` → `RX` geçişi (process hollowing!)
3. **Content Modification** — Mevcut kod bölgesinde değişiklik (in-memory patching)

**Nasıl:**
- `xxhash-rust` (xxh3_64) ile hızlı region hashing
- Önceki state ile karşılaştırma → delta event'ler

**Senaryo:**
> "Bir bölge RW'den RX'e geçti — birisi data olarak yazdığı kodu artık çalıştırılabilir yaptı. Bu, process hollowing'in imzası."

| Event | Ne Anlama Geliyor? | Öncelik |
|-------|-------------------|---------|
| New Allocation (no file) | Fileless shellcode | 🔴 Kritik |
| RW → RX | Process hollowing | 🔴 Kritik |
| Code region modified | In-memory patching | 🔴 Kritik |
| New allocation (file-backed) | Yeni modül yüklendi | ⚠️ Orta |

---

## Faz 5: Kernel Katmanı — "Gerçek Zamanlı Algılama"

> "Şimdiye kadar biz gidip soruyorduk — 'bir şey oldu mu?' Artık kernel bize söyleyecek — 'evet, şu an oldu!'"

### Adım 5.1: Linux — eBPF ile Aya

**Ne:** `mprotect` ve `mmap` syscall'larını kernel seviyesinde takip et.

**Nasıl:**
- `Aya` framework ile tracepoint → `sys_enter_mprotect`
- Kernel-side eBPF programı (no_std, no_main)
- User-side Rust receiver

**Gereksinimler:**
- Linux kernel 5.x+
- `CAP_SYS_ADMIN` capability
- `bpf-linker` build dependency

---

### Adım 5.2: Windows — ETW ile ferrisetw

**Ne:** `VirtualAlloc` ve `VirtualProtect` çağrılarını izle.

**Nasıl:**
- `Microsoft-Windows-Kernel-Memory` provider
- Event ID 2 (VirtualProtect) → protection 0x40 (PAGE_EXECUTE_READWRITE) = alarm

---

### Adım 5.3: Event Dispatcher

**Ne:** Polling + Kernel event'leri tek channel'da birleştir.

| Event Türü | Kaynak | Frekans | Amaç |
|------------|--------|---------|------|
| Snapshot | Poller | Her 2s | Dashboard & tree |
| New Allocation | Kernel | Real-time | Fileless tespit |
| Protection Change | Kernel | Real-time | Hollowing tespit |

---

## Faz 6: Beyin — "Tehdit Puanı"

> "Her olayı tek tek değerlendirmek yerine, toplayıp bir puan hesaplayacağız. Tıpkı 4 katmanlı güvenlik denetimi gibi — her katman ayrı puan."

### Adım 6.1: Heuristic Scoring Engine

**Scoring Modeli (0–100):**

| Sinyal | Puan | Açıklama |
|--------|------|----------|
| İmzasız binary | +30 | Temel güven eksikliği |
| Yüksek entropi (>7.5) | +25 | Packed/encrypted binary |
| Temp dizininden çalışma | +20 | Staging area kullanımı |
| Aktif RWX bellek | +40 | Kod enjeksiyonu göstergesi |
| Ağ dinleme | +15 | Potansiyel backdoor |
| Real-time RX transition | +50 | Kernel-level tespit |

**Eşikler:**
```
0–30:   ✅ Güvenilir
31–60:  ⚠️ Şüpheli — log tut, izle
61–80:  🔶 Yüksek Risk — dondur, dump al
81–100: 🔴 Kritik — dondur, dump al, öldür
```

---

### Adım 6.2: Decaying Score

**Ne:** Zaman içinde puan düşsün — yanlış alarm azalt.

> "Anlık bir spike oldu ama sonra sessiz — belki compiler build yapıyordu. Puan zamanla düşer. Ama aynı process tekrar tetiklerse — puan yeniden çıkar."

---

## Faz 7: Kas — "Otomatik Müdahale"

> "Puanı hesapladık, artık ne yapacağımıza karar verme zamanı. Sıra çok önemli — forensic evidence yok olmadan aksiyon al."

### Adım 7.1: Response Handler

**Müdahale Sırası (Forensic Best Practice):**

```
1. DONDUR (Suspend)   → Thread'leri durdur, kanıtı koru
2. DUMP AL (Capture)  → RAM snapshot (.mdmp) kaydet  
3. ÖLDÜR (Kill)       → Process'i sonlandır
```

> "Sırayı asla bozma — önce öldürüp sonra dump alırsan, tüm heap belleği ve volatile key'ler kaybolur. Önce dondur, sonra kanıtı al, sonra öldür."

**Crate'ler:**
- `remoteprocess` — cross-platform suspend
- `minidump-writer` — forensic dump
- `nix` (Linux) / `windows` (Windows) — kill signals

---

### Adım 7.2: Exclusion List

**Ne:** False positive'leri önle — IDE'ni, compiler'ını öldürme.

> "Yüksek entropili bir binary'yi derlerken compiler'ın kendisi yüksek entropi üretiyor. Exclusion list olmazsa, kendi geliştirme ortamını kapatırsın."

---

## Faz 8: Raporlama — "SIEM Entegrasyonu"

> "Veri güzel, ama aranabilir değilse işe yaramaz. JSON formatında, SIEM'e fit halinde raporlama."

### Adım 8.1: SecurityReport Schema

**ECS/CIM uyumlu JSON:**
- UUID event ID
- Timestamp
- Process context (PID, name, exe, SHA-256, user)
- Threat score + heuristic breakdown
- Memory events log
- Action taken
- Artifact path (.mdmp dosyası)

---

### Adım 8.2: SIEM Bağlantıları

| SIEM | Yöntem |
|------|--------|
| **Splunk** | HEC (HTTP Event Collector) — `reqwest` POST |
| **Microsoft Sentinel** | Log Analytics API — CEF format |
| **Elastic** | ECS uyumlu JSON — direct index |

---

## Faz 9: Deploy — "Containerized Service"

### Adım 9.1: Multi-Stage Docker Build

```
Stage 1 (Builder): rust:1.80 + clang + bpf-linker → compile
Stage 2 (Runtime): debian:slim + libelf → run
```

### Adım 9.2: Privilege Requirements

| Capability | Neden |
|-----------|-------|
| `SYS_PTRACE` | Başka process'lerin belleğini oku |
| `SYS_ADMIN` | eBPF programları yükle |
| `NET_ADMIN` | Socket izleme |
| `--pid host` | Host PID namespace'ini gör |

### Adım 9.3: Watchdog — Kendini Koruma

> "Gelişmiş malware ilk iş güvenlik araçlarını öldürmeye çalışır. Watchdog pattern ile iki process birbirini izler — biri ölürse diğeri uyarır ve yeniden başlatır."

**3 Katman:**
1. **Docker restart: always** — container olarak respawn
2. **Peer Watchdog** — iki process birbirini izler
3. **eBPF Self-Defense** — `sys_kill` engelleyen kernel hook

---

## Faz 10: Arayüz — "Dioxus Dashboard"

> "Tüm bu sensörlerden gelen veriyi tek ekranda, gerçek zamanlı göster. Hacker blue temalı, terminal estetiğinde."

### Adım 10.1: Desktop App with Dioxus

**Özellikler:**
- Process tablosu (threat score rengine göre)
- Sistem risk endeksi göstergesi
- Canlı alert akışı
- Quick Actions (kill, dump, scan)
- Global hotkey: `Ctrl+Alt+K` → seçili process'i öldür
- System tray: renk değişimi (yeşil → kırmızı)
- Context menu: "Open in Ghidra" / "Copy SHA-256"

### Risk Endeksi Formülü

$$R = \frac{\sum_{i=1}^{n} (Score_i \times Impact_i)}{n}$$

Her yeni event geldiğinde $R$ anında güncellenir — Dioxus Signals ile reaktif.

---

## Özet — Tüm Fazlar

| Faz | Adı | Katman | Soru |
|-----|-----|--------|------|
| 1 | Process Spy Core | Temel | Kim çalışıyor? |
| 2 | Security Audit | Güvenlik | Güvenilir mi? |
| 3 | Network Mapping | Ağ | Nereye bağlanıyor? |
| 4 | Memory Analysis | Bellek | RAM'de ne saklıyor? |
| 5 | Kernel Listeners | Kernel | Ne zaman oluyor? |
| 6 | Heuristic Engine | İstihbarat | Ne kadar tehlikeli? |
| 7 | Response Handler | Aksiyon | Ne yapmalıyız? |
| 8 | SIEM Reporter | Raporlama | Nereye kayıt? |
| 9 | Docker Deploy | Operasyon | Nasıl çalıştırıyoruz? |
| 10 | Dioxus Dashboard | Arayüz | Nasıl görüyoruz? |

> "Her faz bir öncekinin üzerine inşa ediliyor. v1'de sadece process listesi var, v10'da tam teşekküllü EDR sistemi."
