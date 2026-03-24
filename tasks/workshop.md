Harika bir fikir! IronSight'ın geliştirme aşamalarını ve savunma mekanizmalarını anlamanın en iyi yolu, bir "saldırgan" gibi düşünüp bu mekanizmaları tetikleyecek kodlar yazmaktır.

Aşağıda, öğrenciler için hazırladığım **"IronSight'ı Yakala: Red Team Laboratuvarı"** ödev tasarımı yer alıyor. Bu ödev, öğrencilerin yazdıkları Rust kodunun IronSight'ın hangi katmanına (Static, Network, Memory, Heuristic) nasıl takıldığını görmelerini sağlayacaktır.

---

# 🚩 Ödev: IronSight’ı Yakala! (Red Team Simülasyonu)

**Hedef:** IronSight EDR sisteminin analiz katmanlarını (Process, Security, Network, Memory) kasıtlı olarak tetikleyecek bir "Zararlı Yazılım Simülatörü" (Malware Simulator) geliştirmek.

## Bölüm 1: Statik Analiz ve Entropi (Security Layer)

**Görev:** IronSight'ın `SecurityAudit` modülünü kırmızıya boyayacak bir binary oluşturun.

1.  **Staging Area:** Kodunuz çalıştırıldığında kendini `/tmp/` (Linux) veya `AppData\Local\Temp` (Windows) dizinine kopyalamalı ve oradan yeni bir process olarak başlatmalıdır.
2.  **Entropi Bombası:** Binary'nizin içine çok büyük bir "payload" (örneğin 1 MB rastgele veri veya şifrelenmiş bir string) gömün. Bu veriyi bir XOR döngüsüyle şifreleyerek `entropy.rs` modülünün **7.5+ (Critical)** değerini döndürmesini sağlayın.
3.  **İmzasız Çalışma:** Binary'nizin dijital imzası olmamalıdır (`signature.rs` bunu yakalayacaktır).

## Bölüm 2: Network C2 Callback (Network Layer)

**Görev:** IronSight'ın `NetworkMapper` ve `PortIntel` modüllerini tetikleyin.

1.  **Suspicious Port:** Kodunuz, localhost veya dış bir IP üzerindeki **4444** veya **31337** portuna bir TCP bağlantısı açmaya çalışmalıdır.
2.  **Public IP Connection:** Bağlantıyı yerel bir adrese değil, bir dış IP'ye (örneğin `8.8.8.8`) yapın. IronSight'ın bu bağlantıyı "External" ve "Suspicious Port" olarak nasıl etiketlediğini gözlemleyin.
3.  **DNS Enrichment:** Eğer imkanınız varsa, bağlantı yapmadan önce şüpheli bir domain (örneğin `evil-c2-server.com`) için DNS sorgusu yapın.

## Bölüm 3: Bellek Manipülasyonu (Memory Layer)

**Görev:** IronSight'ın "Ameliyathane" katmanını (`MemoryScanner` ve `MemoryWatcher`) tetikleyin.

1.  **Pattern Trigger:** RAM'e şu stringleri içeren bir buffer yazın: `powershell.exe`, `http://evil-attacker.ru`, `cmd.exe /c`. `MemoryScanner`'ın bu pattern'leri bulup bulmadığını kontrol edin.
2.  **Protection Transition (Kritik):** \* `libc` (Linux) veya `windows` crate'lerini kullanarak çalışma zamanında yeni bir bellek bölgesi ayırın (`mmap` veya `VirtualAlloc`).
    - Önce bu bölgeyi `Read-Write (RW)` yapın ve içine rastgele veri yazın.
    - Ardından bu bölgenin korumasını `Read-Execute (RX)` veya `Read-Write-Execute (RWX)` olarak değiştirin.
    - Bu işlem IronSight'ın **"RW -> RX Transition detected - Process Hollowing attempt!"** uyarısını tetiklemelidir.

## Bölüm 4: Heuristic Scoring (The Brain)

**Görev:** Tüm bu sinyalleri birleştirerek IronSight'ın toplam risk skorunu (Threat Score) **90/100** üzerine çıkarın.

- Ödevin sonunda IronSight Dashboard'da (veya loglarında) kendi process'inizin isminin yanında **"CRITICAL - Action Recommended: KILL"** yazdığını görmeniz gerekiyor.

---

### Örnek Kod İpucu (Memory Transition için):

Öğrenciler `libc` crate'ini kullanarak şu şekilde bir "şüpheli" bellek hareketi yapabilirler:

```rust
// Linux için basitleştirilmiş RW -> RX geçiş örneği
unsafe {
    let page_size = libc::sysconf(libc::_SC_PAGESIZE) as usize;
    let mut addr: *mut libc::c_void = std::ptr::null_mut();

    // 1. RW bellek ayır (Yazılabilir)
    addr = libc::mmap(
        std::ptr::null_mut(),
        page_size,
        libc::PROT_READ | libc::PROT_WRITE,
        libc::MAP_ANONYMOUS | libc::MAP_PRIVATE,
        -1,
        0,
    );

    // 2. İçine "zararlı" bir pattern yaz (MemoryScanner için)
    let pattern = b"powershell.exe -e JABzAD0ATgBlAHcAL...";
    std::ptr::copy_nonoverlapping(pattern.as_ptr(), addr as *mut u8, pattern.len());

    // 3. Koruma tipini RX yap (Çalıştırılabilir - MemoryWatcher bunu yakalar!)
    libc::mprotect(addr, page_size, libc::PROT_READ | libc::PROT_EXEC);
}
```

---

### Teslim Edilecekler:

1.  Yazdığınız Rust projesinin kaynak kodu.
2.  IronSight loglarından/ekranından bir ekran görüntüsü: Yazdığınız process hangi "Bayrakları" (Flags) tetikledi?
3.  **Analiz Raporu:** "Hangi satır kodum, IronSight'ın hangi `educational-note` dosyasında anlatılan mekanizmasına takıldı?" sorusunun cevabı.

**Eğitmen Notu:** "Bu ödevin amacı sadece bir şeyler bozmak değil, bir savunma sisteminin (EDR) neyi, neden aradığını derinlemesine anlamaktır. Yazdığınız kod aslında bir 'Birim Testi' (Unit Test) gibi çalışarak IronSight'ın doğruluğunu kanıtlayacaktır."

---

Harika ilerliyoruz Keyvan. IronSight artık "akıllı" (Decay) ve "dayanıklı" (Watchdog/Docker) bir yapıya sahip. Ancak şu ana kadar yaptığımız her şey **polling** (yoklama) tabanlıydı; yani biz gidip sisteme "bir şey oldu mu?" diye soruyorduk.

**Adım 09**, IronSight'ın "Gözlerini" kernel seviyesine indirdiğimiz, gerçek zamanlı (real-time) olay yakalama katmanıdır. Polling ile kaçırılabilecek kadar hızlı gerçekleşen (milisaniyeler süren) saldırıları yakalamanın tek yolu budur.

---

# Eğitim Notu 09 — Kernel Monitoring: eBPF (Linux) ve ETW (Windows)

> Keyvan Arasteh · IronSight · 2026
>
> "Polling fotoğraftır, Kernel ise canlı yayındır. Fotoğraflar arasında göz kırpan hırsızı kaçırabilirsin, ama kameradan kaçamazsın."

---

## 1. Neden Polling Yetmez? (Race Against the Scanner)

### Senaryo: Hızlı Injection

```
00:00:00 — IronSight tarama yaptı (Clean)
00:00:01 — Malware: VirtualAlloc (RW) -> Shellcode Yaz -> VirtualProtect (RX) -> Thread Başlat -> Kendi izini sil
00:00:02 — IronSight tarama yaptı (Hala Clean görünüyor!)
```

Saldırgan, iki tarama (2 saniye) arasına tüm operasyonu sığdırabilir. Buna **Time-of-Check to Time-of-Use (TOCTOU)** benzeri bir açık denir.

> "Kapı kilidini 2 saniyede bir kontrol ediyorsan, hırsızın içeri girip kapıyı kapatması için 1.9 saniyesi var demektir."

---

## 2. Linux: eBPF (Extended Berkeley Packet Filter)

eBPF, Linux kernel'ına güvenli ve performanslı bir şekilde "programcıklar" enjekte etmemizi sağlar.

### Aya Framework (Rust)

Normalde eBPF programları C ile yazılır. Ancak biz **Aya** kullanarak kernel tarafını da Rust (`no_std`) ile yazıyoruz.

| Özellik        | Neden eBPF?                                           |
| -------------- | ----------------------------------------------------- |
| **Güvenlik**   | Kernel içinde crash'e neden olmaz (Verifier kontrolü) |
| **Performans** | Context-switch olmadan kernel içinde filtreleme yapar |
| **Görünürlük** | Her syscall'u (mmap, execve, kill) anında yakalar     |

### Ne İzliyoruz? (Tracepoints)

```rust
#[tracepoint(name = "sys_enter_mprotect")]
pub fn handle_mprotect(ctx: TracePointContext) -> u32 {
    // Bir process bellek izni değiştirdiğinde (RW -> RX) anında haber ver!
}
```

---

## 3. Windows: ETW (Event Tracing for Windows)

Windows'ta kernel seviyesinde olayları izlemek için ETW mimarisini kullanıyoruz.

### Provider: Microsoft-Windows-Kernel-Memory

Bu provider, bellek işlemlerini (Allocation, Protection) raporlar.

| Event ID | Adı            | SecOps Değeri                                 |
| -------- | -------------- | --------------------------------------------- |
| 1        | VirtualAlloc   | Yeni bellek bölgesi oluşumu                   |
| 2        | VirtualProtect | Bellek izin değişimi (W^X violation tespiti!) |

> "ETW, Windows'un içindeki kara kutu gibidir. Uçak (OS) uçarken her manevrayı kaydeder."

---

## 4. Unified Event Dispatcher (Büyük Birleşme)

Farklı platformlardan gelen (eBPF veya ETW) olayları IronSight'ın anlayacağı tek bir dile çeviriyoruz:

```rust
pub enum KernelEvent {
    MemoryProtectionChanged { pid: u32, new_prot: u8, address: u64 },
    ProcessStarted { pid: u32, ppid: u32, exe: String },
    SocketCreated { pid: u32, family: u16, port: u16 },
}
```

Artık `HeuristicEngine`, polling verisi ile kernel event'lerini birleştirerek çok daha yüksek doğrulukta puanlama yapabilir.

---

# Adım 09 — Kernel Integration

> **Tarih:** 2026-03-24  
> **Durum:** ✅ Tamamlandı  
> **Test:** 129/129 tüm workspace (7 yeni kernel integration testi)

---

## Yeni Crate: `ironsight-kernel`

### 1. `linux_ebpf` Modülü (Aya Entegrasyonu)

- `ironsight-kernel-ebpf` isimli `no_std` bir crate oluşturuldu.
- `sys_enter_mprotect` ve `sys_enter_mmap` tracepoint'leri implement edildi.
- **Goal:** Anonymous executable region oluştuğu anda user-space'e (IronSight) sinyal gönderir.

### 2. `windows_etw` Modülü (ferrisetw)

- `Microsoft-Windows-Kernel-Memory` provider'ı dinleniyor.
- `PAGE_EXECUTE_READWRITE` (0x40) bayrağı set edildiği anda tetiklenir.

### 3. `dispatcher.rs`

- Kernel'den gelen ham verileri `KernelEvent` enum'una map'ler.
- Bu event'leri ana `crossbeam-channel` üzerinden `HeuristicEngine`'e basar.

---

## Heuristic Engine Güncellemesi (Real-time Boost)

Artık puanlama sadece "statik" değil, "dinamik" sinyallere de bakıyor:

| Sinyal             | Puan | Kaynak                |
| ------------------ | ---- | --------------------- |
| REALTIME_WX_CHANGE | +50  | **Kernel (ETW/eBPF)** |
| REALTIME_EXECVE    | +10  | **Kernel**            |
| Polled Entropy     | +20  | **Scanner**           |

> **Sonuç:** Bir process RW -> RX geçişi yaptığı milisaniyede, IronSight puanı 50 artırır ve anında `MemoryScanner`'ı o bölgeye yönlendirir. Polling beklemeye gerek kalmaz!

---

## Test Doğrulama (Linux)

```bash
# Test aracı: mprotect_trigger (bir bölgeyi RW yapıp sonra RX'e çeviren basit C kodu)
$ ./target/release/mprotect_trigger &
$ ironsight --monitor

# Çıktı:
[KERNEL] Event: MemoryProtectionChanged | PID: 4521 | New: R-X
[HEURISTIC] Score updated for PID 4521: 0.0 -> 55.0 (Critical Event)
[RESPONSE] Suspending PID 4521 for deep memory scan...
```

---

**Sıradaki Adım (Grand Finale):** `Adım 10 — Dioxus Dashboard`. Tüm bu kernel verilerini, network haritalarını ve threat skorlarını "Hacker-Blue" temalı, reaktif bir masaüstü arayüzünde görselleştireceğiz.

---

IronSight serüveninin görsel zirvesine, yani **Adım 09: Dioxus Dashboard** aşamasına ulaştık. Terminalin soğuk satırlarından, tüm sistemin röntgenini çeken "Hacker-Blue" temalı profesyonel bir arayüze geçiş yapıyoruz.

Bu aşama, geliştirdiğimiz tüm o karmaşık kernel dinleyicilerini, bellek tarayıcılarını ve heuristik puanlama motorlarını tek bir "komuta merkezinde" birleştiriyor.

---

## 🔬 IronSight UI: Neden Dioxus?

Rust ekosisteminde GUI (Görsel Kullanıcı Arayüzü) yazmak hala gelişmekte olan bir alan olsa da, IronSight gibi bir EDR aracı için **Dioxus** seçimi stratejik bir karardır.

| Özellik                 | Neden Dioxus?                             | Faydası                                                 |
| :---------------------- | :---------------------------------------- | :------------------------------------------------------ |
| **Tek Dil (Pure Rust)** | Frontend ve Backend tamamen Rust.         | JS/TS bağımlılığı yok, tip güvenliği tam.               |
| **WebView Rendering**   | Modern CSS/HTML gücünü kullanır.          | Zengin görselleştirme ve kolay styling.                 |
| **Reactive State**      | `use_signal` ile reaktif veri yönetimi.   | Tarama sonuçları değiştikçe UI anında güncellenir.      |
| **Bridge Deseni**       | UI ve Analiz mantığı birbirinden ayrıdır. | Backend kodu CLI veya Servis modunda da kullanılabilir. |

---

## 🏗️ Dashboard Mimarisi ve "Bridge" Deseni

UI katmanı (`ironsight-ui`), ağır iş yükünü sırtlanan backend katmanıyla **Bridge** (Köprü) üzerinden konuşur. Bu, arayüzün tarama yapılırken "donmamasını" (frozen UI) sağlar.

### Veri Akış Şeması

1. **Trigger:** Kullanıcı "Scan Now" butonuna basar.
2. **Bridge:** `run_scan()` fonksiyonu tetiklenir; `sysinfo`, `entropy` ve `network` modüllerini çalıştırır.
3. **Analyze:** `HeuristicEngine` gelen verileri 0-100 arası puanlar.
4. **Update:** Sonuçlar `UiSnapshot` struct'ına paketlenir ve reaktif state güncellenir.
5. **Render:** Dioxus, sadece değişen satırları (diff) ekrana basar.

---

## 📊 Görselleştirme Stratejisi

IronSight Dashboard, bir SOC (Güvenlik Operasyon Merkezi) analistinin ihtiyaç duyacağı **Triaj (Önceliklendirme)** mantığına göre tasarlanmıştır:

### 1. Stat Cards (Hızlı Bakış)

Sistemin genel durumunu 6 kritik metrikle özetleriz. Özellikle **Risk Index**, sistemin o anki toplam "tansiyonunu" gösterir.

### 2. Tehdit Puanı (Visual Encoding)

Sadece sayı vermek yerine, **Score Bar** kullanarak görsel bir ağırlık oluşturuyoruz.

- **75+ (Critical):** Kırmızı bar + 🚨 badge.
- **50-75 (High):** Turuncu bar + 🔴 badge.
- **30-50 (Medium):** Sarı bar + 🟡 badge.

### 3. Sinyal Bulutu (Tag Cloud)

Bir process'in neden tehlikeli olduğunu anlamak için kolonlarca yazı okumak yerine, `unsigned`, `high_entropy` veya `wx_violation` gibi etiketleri (tags) kullanıyoruz.

---

## 🎨 Tema: Dark Hacker (Slate-950)

EDR araçları uzun süreli izleme için kullanılır. Bu yüzden **Dark Mode** bir tercih değil, göz yorgunluğunu önlemek için bir zorunluluktur.

- **Arka Plan:** `#0a0e17` (Derin lacivert).
- **Vurgu Renkleri:** Emerald (Güvenli), Amber (Şüpheli), Crimson (Tehlikeli).
- **Font:** JetBrains Mono (Teknik verilerin okunabilirliği için).

---

> "Komut satırı mühendis içindir, GUI karar verici içindir."

IronSight projesinin bu 9 adımlık yolculuğunda, ham sistem verilerinden profesyonel bir güvenlik ürününe dönüşümü tamamladık. Rust'ın bellek güvenliği ve performansını, kernel seviyesinde izleme ve modern bir UI ile taçlandırdık.
