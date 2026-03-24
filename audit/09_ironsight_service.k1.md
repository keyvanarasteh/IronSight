# ironsight-service — K1 Açıklama

> Bu doküman `09_ironsight_service.md` dosyasının Türkçe derinlemesine açıklamasıdır.

---

## Bu Crate Ne Yapıyor?

Service crate **orkestra şefi.** Tüm diğer crate'leri bir araya getirip çalıştırıyor: config oku → yetki kontrol et → process'leri tara → güvenlik analizi yap → ağ analizi yap → bellek analizi yap → heuristic puanla → rapor yaz.

Bu projenin `main()` fonksiyonu burada. Kullanıcı `ironsight` komutunu çalıştırdığında bu crate devreye giriyor.

## İyi Olan Ne?

- **Tam pipeline entegrasyonu** — Config'den rapora kadar her aşama bağlı
- **TOML config auto-discovery** — `./ironsight.toml`, `/etc/ironsight/config.toml`, `~/.config/ironsight/config.toml` sırayla aranıyor
- **Akıllı default'lar** — Her config alanının mantıklı varsayılan değeri var
- **Privilege report** — Hangi yetkiler var/yok, net gösteriyor
- **Watchdog sentinel** — Eş process izleme, otomatik yeniden başlatma
- **CLI argüman desteği** — `--pid`, `--top`, `--config`, `--generate-config`, `--check-privileges`

## Kritik Sorunlar

### Tokio Var Ama Kullanılmıyor
`tokio = { features = ["full"] }` dependency'de var ama `main()` senkron. `#[tokio::main]` yok, hiçbir async operasyon yok. 500 process'i sırayla tarıyor — her biri bloklayıcı. Concurrent tarama yapılsa çok daha hızlı olurdu.

### Her Process İçin /proc/net Baştan Taraniyor
`NetworkAudit::scan_pid()` çağrılıyor ve bu fonksiyon tüm `/proc/net/tcp`, `tcp6`, `udp`, `udp6` dosyalarını okuyor. 500 process = ~2000 dosya okuması. Bir kez tarayıp cache'lemek yeterli.

### auto_response Ayarı Ölü Kod
Config'de `auto_response: bool` var ama `main.rs` bunu **hiç kontrol etmiyor.** Response handler hiç çağrılmıyor. Kritik tehditler raporlanıyor ama hiçbir otomatik aksiyon alınmıyor.

### report.min_level Ölü Kod
Config'de `min_level: String` var ama kullanılmıyor. Raporlama `thresholds.export_min_score` ile çalışıyor. İki ayrı mekanizma tanımlı, birisi bağsız.

## Yüksek Sorunlar

### Daemon Modu Yok
Tek sefer tarayıp çıkıyor. `interval_secs` config'de tanımlı ama döngü modu yok. `--daemon` flag'i yok, systemd service dosyası yok.

### Memory Pattern Scanning Entegre Değil
`ironsight_memory::scanner::scan_process()` **hiç çağrılmıyor.** Bellek analizi sadece W^X ihlali kontrolü yapıyor, shellcode/C2 string kalıp taraması atlanıyor.

### Decay Engine Entegre Değil
Decay engine tamamen yazılmış ve test edilmiş ama service crate hiç kullanmıyor. Tek seferlik tarama yapıldığı için zaman bazlı skor azaltma anlamsız.

### truncate() Multi-Byte UTF-8'de Panic Yapıyor
`&s[..max - 1]` byte sınırında kesiyor. Türkçe, Çince veya emoji içeren process isimleri **panic** veriyor. `s.chars().take(max)` kullanılmalı.

### Watchdog Yeni PID'i İzlemiyor
Sentinel main process'i yeniden başlattığında yeni PID alıyor ama **eski PID'i izlemeye devam ediyor.** Yeni process'in kendini kaydetme mekanizması yok.

## Eksikler

Async/concurrent tarama, daemon modu, auto-response, decay entegrasyonu, memory pattern scanning, sinyal yönetimi (SIGTERM), systemd service, JSON stdout, REST API, ağ tarama cache, clap CLI parsing, log dosyası, watchdog heartbeat, config hot-reload — **büyük bir eksik listesi.** Proje çalışıyor ama "professional service" olması için ciddi mühendislik gerekiyor.
