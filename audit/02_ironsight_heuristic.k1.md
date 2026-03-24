# ironsight-heuristic — K1 Açıklama

> Bu doküman `02_ironsight_heuristic.md` dosyasının Türkçe derinlemesine açıklamasıdır.

---

## Bu Crate Ne Yapıyor?

Heuristic crate projenin **beyni.** Diğer crate'lerden gelen sinyalleri (yüksek entropy, şüpheli port, W^X ihlali vs.) topluyor, ağırlıklı puanlama yapıyor ve sonuç veriyor: "Bu process Clean mi, Low mu, High mı, Critical mi?"

Bir doktor gibi düşün: hastanın ateşi var (sinyal 1), öksürüyor (sinyal 2), röntgende bir şey var (sinyal 3). Her birinin ağırlığı farklı — doktor hepsini değerlendirip "gribi var" ya da "zatürrei var" diyor. Bu crate aynısını process'ler için yapıyor.

## İyi Olan Ne?

- **Signal mimarisi temiz** — Her signal'in adı, kategorisi, ağırlığı, açıklaması, kanıtı var
- **10 hazır signal factory** — `high_entropy()`, `suspicious_port()`, `wx_violation()` gibi
- **Decay engine** matematiksel olarak doğru — `score × e^(−λt)` formülü ile zaman bazlı skor azaltma
- **20+ test** — Her threat level'ı, decay matematiğini, kategori skorlamasını test ediyor
- **ThreatLevel sıralaması** doğru — `PartialOrd`/`Ord` implement edilmiş

## Yüksek Sorunlar

### Decay Engine Hiç Kullanılmıyor!
Bu en büyük sorun. Decay engine **tamamen yazılmış ve test edilmiş** — ama `main.rs` hiç çağırmıyor. Proje tek seferlik tarama yapıyor, zamana bağlı skor yazışması yok.

Bu niye kötü? CPU spike'ı 2 saniye süren bir derleme işlemi ile **sürekli yüksek CPU kullanan** bir kripto madenci aynı skoru alıyor. Decay engine tam olarak bunu çözmek için var — geçici spike'ları zamanla düşürüyor, kalıcı tehditleri yüksek tutuyor.

### Configurable Weight Yok
Engine'in eşikleri hardcoded. Her deployment farklı — bir sunucuda 70 skor "Critical" olmalı, bir masaüstünde 85 olabilir. Ama değiştiremiyorsun.

### Signal Ağırlığı Valide Edilmiyor
`Signal::new()` negatif ağırlık kabul ediyor. Negatif ağırlık = tehdit skorunu **düşürür.** Bu kötüye kullanılabilir.

### Signal Deduplication Yok
Aynı signal iki kez eklenirse skor ikiye katlanıyor. `high_entropy()` iki kez çağrılırsa entropy skoru çift sayılıyor — yanlış alarm.

## Eksikler

Configurable threshold'lar, signal korelasyonu (iki signal birlikte gelince daha tehlikeli), ML-bazlı puanlama, tarihsel trend analizi — hepsi eksik. Engine çalışıyor ama **tek boyutlu.** Gerçek EDR ürünlerinin heuristic engine'i çok daha karmaşık.
