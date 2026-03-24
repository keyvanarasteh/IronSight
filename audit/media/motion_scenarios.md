# IronSight — Motion / Animasyon Açıklamaları

> Keyvan Arasteh · İstinye Üniversitesi
>
> Her logic akışı için görsel animasyon senaryoları — eğitim videoları ve sunum materyalleri için.

---

## 🎬 Motion 1: Ana Tarama Pipeline'ı

**Süre:** 45 saniye  
**Stil:** Blueprint üzerinde adım adım ilerleyen ışık çizgisi

**Sahne:**

```
[0s-3s]
Karanlık ekran. Ortada "IRONSIGHT" yazısı yavaşça electric blue ile yanıyor.
Alt yazı: "Tarama Pipeline'ı" beliriyor.

[3s-8s]
Sol tarafta bir config dosyası ikonu beliriyor → TOML dosyası açılıyor.
Bir ışık çizgisi config'den sağa doğru ilerliyor.
Metin: "1. Config Yükle — Ayarları oku, eşikleri belirle"

[8s-13s]
Işık çizgisi "Yetki Kontrol" kutusuna ulaşıyor.
Bir kalkan ikonu yanıp sönüyor → yeşil onay çıkıyor.
Metin: "2. Yetki Kontrol — CAP_SYS_PTRACE, CAP_KILL var mı?"

[13s-20s]
Işık çizgisi "Process Snapshot" kutusuna ulaşıyor.
Bir kamera flash yanıyor → process listesi beliriyor (PID'ler satır satır kayıyor).
Metin: "3. Anlık Fotoğraf — Tüm process'lerin durumu kaydediliyor"

[20s-30s]
Snapshot kutusundan ÜÇ kol ayrılıyor — paralel:
  → Mavi kol: "🔒 Security" (hash hesaplanıyor, entropy gauge dönüyor)
  → Yeşil kol: "🌐 Network" (IP adresleri bağlanıyor, portlar taranıyor)
  → Turuncu kol: "🧠 Memory" (bellek blokları renkli beliriyor)
Her biri kendi animasyonunu yapıp merkeze dönüyor.
Metin: "4. Paralel Analiz — Güvenlik, Ağ, Bellek eşzamanlı taranıyor"

[30s-38s]
Üç kol tek noktada birleşiyor → "Heuristic Engine" gauge'u dönmeye başlıyor.
Sinyal ikonları tek tek gauge'a düşüyor, ibre yükseliyor.
Gauge renk değiştiriyor: yeşil → sarı → turuncu → KIRMIZI.
Metin: "5. Heuristic Engine — Tüm sinyaller puanlanıyor"

[38s-45s]
Çatallanma: 
  → Skor düşükse (yeşil): ✅ "Clean" yazısı, checkmark animasyonu
  → Skor yüksekse (kırmızı): 🚨 ALARM — rapor dosyası oluşturuluyor,
    response handler devreye giriyor (dondur → dump → öldür animasyonu hızlı)
Metin: "6. Karar — Temiz mi, tehdit mi?"
```

---

## 🎬 Motion 2: Heuristic Puanlama

**Süre:** 30 saniye  
**Stil:** Merkezi gauge etrafında dönen sinyaller

**Sahne:**

```
[0s-5s]
Boş bir threat gauge beliriyor, ibre 0'da. Etrafı karanlık.
Alt yazı: "Heuristik Puanlama Motoru"

[5s-10s]
Sol taraftan ilk sinyal geliyor — turuncu bir top:
"HIGH_ENTROPY: 30 puan"
Topa vurulmuş gibi gauge'a çarpıyor, ibre 30'a atlıyor.
Gauge yeşilden sarıya geçiyor.

[10s-15s]
İkinci sinyal — kırmızı top:
"W^X VIOLATION: 35 puan"
İbre 65'e atlıyor. Gauge turuncuya dönüyor.

[15s-20s]
Üçüncü sinyal — mavi top:
"SUSPICIOUS_PORT: 25 puan"
İbre 90'a çıkıyor → skor 100'de cap'leniyor.
Gauge KIRMIZI — "CRITICAL" badge'i yanıp sönüyor.

[20s-25s]
Gauge'un altında kategori çubukları beliriyor:
  ProcessBehavior: ████████ 
  NetworkAnomaly: ██████
  MemoryAnomaly: ████████
  StaticAnalysis: ██████
Çubuklar soldan sağa doluyorlar.

[25s-30s]
Sonuç kartı beliriyor:
  Score: 100 · Level: CRITICAL
  Recommended: SUSPEND → DUMP → KILL
Kart kırmızı pulse efektiyle yanıp sönüyor.
```

---

## 🎬 Motion 3: Decay Engine — Zamanla Skor Düşüşü

**Süre:** 25 saniye  
**Stil:** Zaman çizelgesi üzerinde düşen çizgi grafiği

**Sahne:**

```
[0s-3s]
X ekseni: Zaman (0 → 4 saat). Y ekseni: Skor (0 → 100).
Boş grafik beliriyor. Arka planda renk bantları:
  0-30: yeşil zona, 30-50: sarı, 50-70: turuncu, 70-100: kırmızı.

[3s-8s]
t=0'da nokta beliriyor: Skor 85 (kırmızı zone).
"CPU spike algılandı — ilk skor: 85"
pulse efektiyle kırmızı nokta atıyor.

[8s-12s]
Çizgi yavaşça düşmeye başlıyor — eksponansiyel eğri.
t=30dk: Skor 60 (turuncu zone'a geçiyor)
"30 dakika sonra — spike geçiciydi, skor düşüyor"

[12s-16s]  
t=1sa: Skor 42 (sarı zone)
t=2sa: Skor 21 (yeşil zone'a yaklaşıyor)
"Decay formülü: score × e^(−λt)"
Çizgi smooth bir şekilde düşmeye devam ediyor.

[16s-20s]
t=4sa: Skor 5 → "🟢 Clean"
Yeşil zone'da sabitlniyor.
"Geçici tehdit — zamanla temizlendi"

[20s-25s]
KARŞILAŞTIRMA: İkinci çizgi beliriyor (kırmızı, düz çizgi):
"Kripto madenci — sürekli yüksek CPU"
Bu çizgi 85'te sabit kalıyor, DÜŞMİYOR.
"Kalıcı tehdit — decay düşüremez"
Metin: "Decay Engine: Geçici spike'ları filtreler, gerçek tehditleri yakalar"
```

---

## 🎬 Motion 4: Forensik Müdahale Sırası

**Süre:** 20 saniye  
**Stil:** Üç aşamalı animasyonlu sekans

**Sahne:**

```
[0s-3s]
Bir process ikonu ekranda — kırmızı glow ile yanıyor.
Üstünde "⚠️ CRITICAL — Score: 92"
Alt yazı: "Forensik Müdahale Sırası"

[3s-8s]
ADIM 1: ❄️ Buz kristali animasyonu.
Process ikonunun etrafı buz ile kaplıyor.
"SIGSTOP → Process donduruldu"
"Neden? Kanıtları korumak için — önce dur, sonra incele"
Process ikonun hareket durur, mavi glow.

[8s-13s]
ADIM 2: 📸 Kamera flash animasyonu.
Process'in bellek bölgeleri (renkli bloklar) bir dosyaya kopyalanıyor.
Bloklar tek tek dosya ikonuna akıyor.
"Memory Dump → /var/lib/ironsight/dumps/"
"128 MB bellek kanıtı güvenli kaydedildi ✅"

[13s-18s]
ADIM 3: 💀 Kafatası animasyonu, kırmızı flash.
Process ikonu kırılıyor / parçalanıyor.
"SIGKILL → Process sonlandırıldı"
"Tehdit etkisiz hale getirildi"

[18s-20s]
Üç adım yan yana mini ikonlarla gösteriliyor:
❄️ → 📸 → 💀
"Sıra ÖNEMLİ: Önce dondur, sonra kanıt al, sonra öldür"
"Sırayı karıştırırsan kanıt kaybedersin"
```

---

## 🎬 Motion 5: W^X — Bellek İzin İhlali Tespiti

**Süre:** 25 saniye  
**Stil:** Bellek haritası üzerinde tarama animasyonu

**Sahne:**

```
[0s-5s]
Horizontal bellek haritası beliriyor — renkli bloklar:
  🟢 [rw-] 🟢 [rw-] 🔵 [r-x] 🟢 [rw-] 🔵 [r-x] 🟢 [rw-]
Her blok bir bellek bölgesini temsil ediyor.
Altında adres aralıkları: 0x7f000000 - 0x7f040000

[5s-10s]
Tarayıcı — soldan sağa ilerleyen mavi bir lazer çizgi.
Her bloğun üstünden geçerken izinleri kontrol ediyor.
rw- → ✅ yeşil onay
r-x → ✅ mavi onay
"Normal izinler — yazma ve çalıştırma ayrı ayrı"

[10s-16s]
Lazer yeni bir bloğa ulaşıyor:
  🔴 [rwx] — HEM yazılabilir HEM çalıştırılabilir!
Blok kırmızı yanıp sönmeye başlıyor.
Alarm sesi efekti (görsel wave).
"⚠️ W^X İHLALİ! Bu bölge hem yazılabilir hem çalıştırılabilir"
"Saldırgan buraya shellcode enjekte etmiş olabilir"

[16s-20s]
Kırmızı bloğun içine zoom:
Hex veriler beliriyor: 48 8b 05 ... /bin/sh ... wget ...
Suspicious pattern'lar sarı vurgulanıyor.
"Pattern Scanning: Şüpheli string'ler bulundu"

[20s-25s]
Sinyal oluşturuluyor:
"🎯 Signal: WX_VIOLATION — Weight: 35"
"🎯 Signal: SUSPICIOUS_PATTERN — Weight: 20"
Sinyaller heuristic gauge'a ekleniyor.
```

---

## 🎬 Motion 6: Ağ Socket Haritalama

**Süre:** 30 saniye  
**Stil:** Ağ düğümleri arasında akan veri paketleri

**Sahne:**

```
[0s-5s]
Merkezi bir sunucu ikonu beliriyor.
Etrafında process ikonları: nginx, chrome, python, ???
Alt yazı: "Ağ İstihbaratı — Socket Haritalama"

[5s-12s]
/proc/net/tcp dosyası açılıyor — satır satır socket verisi akıyor.
Her satır bir bağlantıya dönüşüyor:
  Yeşil çizgiler: nginx → internal (port 80) ✅
  Yeşil çizgiler: chrome → google.com (port 443) ✅
Çizgiler pulsing animasyonuyla data akışını gösteriyor.

[12s-18s]
Aniden KIrmızı çizgi beliriyor:
  ??? process → 93.184.216.34:4444 🔴
Port numarası büyüyüyor: "4444 — Metasploit Default Port"
Alarm animasyonu — çizgi kırmızı pulse.

[18s-24s]
Socket-to-PID eşleştirme animasyonu:
  /proc/net/tcp → inode bulunuyor (magic number beliriyor)
  /proc/PID/fd taranıyor → inode eşleşiyor
  PID: 666 → "evil_payload" ‼️
"Socket sahibi bulundu — PID 666: evil_payload"

[24s-30s]
DNS zenginleştirme:
  IP: 93.184.216.34 → reverse DNS → "malware-c2.evil.com"
  GeoIP: 🏴 "Known malicious origin"
Tüm bilgiler bir rapor kartına toplanıyor.
"Tehdit: C2 bağlantısı tespit edildi"
```

---

## 🎬 Motion 7: Watchdog Sentinel — Nöbetçi Sistemi

**Süre:** 20 saniye  
**Stil:** İki süreç arasında heartbeat monitörü

**Sahne:**

```
[0s-5s]
İki process ikonu beliriyor:
  Sol: "🔍 Ana Scanner" (mavi, aktif)
  Sağ: "🛡️ Sentinel" (yeşil, izliyor)
Aralarında heartbeat çizgisi — kalp atışı gibi pulse.
"Watchdog: Sentinel, ana process'i izliyor"

[5s-10s]
Ana Scanner taramaya devam ediyor (spinning animation).
Sentinel her 10 saniyede ping atıyor:
  "kill(pid, 0) → Canlı mı?"
  Ana Scanner: "✅ Cevap: Canlıyım"
Heartbeat çizgisi düzenli atıyor.

[10s-15s]
OLAY! Ana Scanner ikonu kırılıyor / donuyor.
"💀 Ana process öldü — tamper veya crash"
Heartbeat çizgisi düzleşiyor — flat line 📉

[15s-20s]
Sentinel ALARM veriyor — kırmızı pulse.
"⚠️ ALARM: Ana process yanıt vermiyor!"
Sentinel yeni bir Ana Scanner başlatıyor:
  Yeni ikon beliriyor, mavi renkte başlıyor.
  "🔄 Yeniden başlatıldı — koruma devam ediyor"
Heartbeat çizgisi tekrar atmeya başlıyor.
"Anti-Tamper: Saldırgan IronSight'ı öldürse bile geri geliyor"
```

---

## 🎬 Motion 8: Security Audit — 4 Katman Analiz

**Süre:** 25 saniye  
**Stil:** Dört sütunlu analiz paneli

**Sahne:**

```
[0s-3s]
Bir binary dosya ikonu beliriyor — "suspicious.exe"
Alt yazı: "Güvenlik Denetimi — 4 Katman"

[3s-8s]
KATMAN 1: SHA-256 Hash
Hash hesaplanıyor — hex karakterleri hızla akıyor.
Sonuç: "a1b2c3d4e5f6..."
VirusTotal veri tabanı ikonu → ❌ "Bilinen zararlı hash!"
Kırmızı bayrak kaldırılıyor.

[8s-13s]
KATMAN 2: Shannon Entropy
Entropy gauge'u beliriyor (0-8 arası).
İbre hızla 7.8'e çıkıyor — kırmızı zone.
"Entropy: 7.8 → Packed/Encrypted binary"
Normal dosya: ~4.5. Bu dosya: 7.8 → çok yüksek.
İkinci kırmızı bayrak.

[13s-18s]
KATMAN 3: İmza Doğrulama 
Sertifika ikonu beliriyor.
Doğrulama animasyonu — sertifika zinciri kontrol ediliyor.
❌ "İmza yok — unsigned binary"
Üçüncü kırmızı bayrak.

[18s-22s]
KATMAN 4: Path Analizi
Dosya yolu beliriyor: "/tmp/downloaded/suspicious.exe"
/tmp/ kırmızı vurgulanıyor — "Şüpheli dizin"
"Downloads" kırmızı vurgulanıyor — "Kullanıcı indirmesi"
Dördüncü kırmızı bayrak.

[22s-25s]
Sonuç kartı:
  Flag Count: 4
  Entropy: CRITICAL
  Signed: NO
  Path: SUSPICIOUS
  "🔴 Binary bütünlük analizi: BAŞARISIZ"
Tüm bayraklar sol tarafta sıralanıyor.
```

---

## 🎬 Motion 9: Dashboard Navigasyon Akışı

**Süre:** 20 saniye  
**Stil:** Ekran geçişleri ile sayfa turu

**Sahne:**

```
[0s-4s]
Dashboard Home açılıyor:
  StatCard'lar animasyonla beliriyor (sayılar counting up).
  ThreatGauge dönüyor, 87'de duruyor.
  Top Threats tablosu satır satır yükleniyor.

[4s-8s]
Kullanıcı bir process satırına tıklıyor.
Smooth geçiş → Process Monitor açılıyor.
Sağdaki Detail Panel slide-in oluyor.
CPU grafiği canlı çizilmeye başlıyor.

[8s-12s]
"Memory" tab'ına tıklıyor.
Geçiş → Memory Forensics sayfası.
Bellek haritası horizontal bar olarak beliriyor.
Kırmızı W^X bloğu yanıp sönüyor.

[12s-16s]
W^X bloğuna tıklıyor.
Geçiş → Threat Analysis.
Signal detayı açılıyor, decay timeline çiziliyor.
"Take Action" butonuna tıklıyor.

[16s-20s]
Geçiş → Response Center.
Forensik müdahale timeline'ı gösteriliyor:
  ❄️ Suspended → 📸 Dumped → ❌ Killed
Son kare: "Tehdit etkisiz — Sistem güvende ✅"
IronSight logosu beliriyor.
```

---

## 🎬 Motion 10: Config → Scan → Detect → Report Tam Döngüsü

**Süre:** 35 saniye  
**Stil:** Circular flow — sonsuz döngü animasyonu

**Sahne:**

```
[0s-5s]
Dairesel bir akış diyagramı beliriyor:
  CONFIG → SCAN → ANALYZE → DECIDE → REPORT/RESPOND → tekrar CONFIG
Her adım bir düğüm, aralarında oklar.

[5s-10s]
CONFIG düğümü yanıyor:
  TOML dosyası açılıyor, eşikler okunuyor.
  interval: 300s, critical: 70, auto_response: true
  "Eşikler yüklendi — 5 dakikada bir tarama"

[10s-15s]
SCAN düğümü yanıyor:
  Process listesi akıyor (342 process).
  Her process için: security ✓ network ✓ memory ✓
  "Tüm process'ler tarandı"

[15s-20s]
ANALYZE düğümü yanıyor:
  Sinyaller toplanıyor, gauge dönüyor.
  5 process yüksek skor: 72, 85, 91, 45, 38
  "Heuristic puanlama tamamlandı"

[20s-25s]
DECIDE düğümü yanıyor:
  Çatallanma: 
    337 process → ✅ Clean (yeşil akış)
    3 process → 🟡 Medium (sarı akış, sadece rapor)
    2 process → 🔴 Critical (kırmızı akış, müdahale!)

[25s-30s]
REPORT/RESPOND düğümü yanıyor:
  JSON dosyaları oluşturuluyor.
  Critical process'ler: Suspend → Dump → Kill animasyonu.
  Splunk'a data akışı: ──────► SIEM

[30s-35s]
Ok tekrar CONFIG'e dönüyor.
"5 dakika sonra tekrar tarama — 7/24 koruma"
"Daemon Mode: Hiç durmaz, sürekli izler"
Döngü animasyonu sonsuz dönmeye devam ediyor.
```
