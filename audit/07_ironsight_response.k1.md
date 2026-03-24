# ironsight-response — K1 Açıklama

> Bu doküman `07_ironsight_response.md` dosyasının Türkçe derinlemesine açıklamasıdır.

---

## Bu Crate Ne Yapıyor?

Response crate tehdit algılandığında **otomatik müdahale** yapıyor. Forensik sırayla: önce process'i dondur (Suspend/SIGSTOP), sonra bellek dump'ını al, sonra öldür (Kill/SIGKILL).

Bir banka soyguncusunu düşün: önce **kapıları kilitle** (kaçamasın), sonra **kamera kayıtlarını al** (kanıt), sonra **polisi çağır** (etkisiz hale getir). Sıra önemli — önce öldürürsen kanıt kaybedersin.

## İyi Olan Ne?

- **Forensik sıra korunmuş** — Suspend → Dump → Kill
- **Exclusion list** var — init, systemd, sshd gibi kritik process'ler korunuyor
- **Path bazlı exclusion** — `/usr/sbin/` altındakilere dokunma
- **Cross-platform fallback** — Unix olmayan platformlarda "desteklenmiyor" dönüyor

## Kritik Sorunlar

### Memory Dump /tmp/ Altına Yazılıyor
Forensik dump'lar `/tmp/ironsight-reports` altına yazılıyor — **herkes okuyabilir.** Process belleğinde şifreler, session token'lar, encryption key'ler olabilir. Bunlar dünya-okuyabilir bir dizine yazılmamalı.

Çözüm: `/var/lib/ironsight/dumps/` altına, 0700 izinlerle, tercihen şifreli.

### respond() MemoryDump ve Resume'u Yok Sayıyor
```rust
_ => {}  // MemoryDump ve Resume sessizce atlanıyor!
```
`ActionType::MemoryDump` veya `ActionType::Resume` geldiğinde hiçbir şey yapmıyor. Boş match arm.

### İki Ayrı Exclusion Sistemi Var
`ironsight_response::ExclusionList` ve `ironsight_service::config::ExclusionConfig` — ikisi de exclusion yapıyor ama birbirine bağlı değil. Service'deki config exclusion'ları response handler'a aktarılmıyor.

### is_excluded() Path Kontrolü Yapmıyor
`is_excluded(name, pid)` sadece isim ve PID kontrol ediyor. `is_path_excluded()` ayrı bir metot ama **hiç çağrılmıyor.** Yani path bazlı exclusion tanımlı ama kullanılmıyor.

## Eksikler

Auto-response entegrasyonu (config'de var ama bağlı değil), rate limiting, undo/rollback, onay mekanizması (human-in-the-loop), ağ izolasyonu (firewall), dosya karantina, regex exclusion, aksiyon persist etme — hepsi eksik. Temel mekanizma çalışıyor ama **production için güvenlik hardening** gerekiyor.
