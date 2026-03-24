# ironsight-report — K1 Açıklama

> Bu doküman `06_ironsight_report.md` dosyasının Türkçe derinlemesine açıklamasıdır.

---

## Bu Crate Ne Yapıyor?

Report crate tüm analiz sonuçlarını **yapılandırılmış raporlara** dönüştürüyor. İki format var: JSON (SIEM araçları için) ve metin (insan okuyacağı).

Bir doktorun tahlil sonuçlarını düşün: lab makinesi ham veriyi üretiyor, doktor bunları **rapor formatına** sokup hastaya veriyor. Bu crate o rapor formatını üretiyor.

## İyi Olan Ne?

- **Kapsamlı IncidentReport şeması** — process, threat, security, network, memory, actions hepsi tek yapıda
- **UUID bazlı rapor ID** — her rapor tekil
- **İkili format** — pretty JSON (insan için), compact JSON (SIEM için)
- **Güzel metin formatı** — ASCII art bölümler, emoji'ler, temiz layout
- **JSON round-trip test** var — serialize → deserialize doğruluğu garanti

## Yüksek Sorunlar

### Splunk HEC ve Sentinel Export Yazılmamış
Cargo.toml açıklaması "Splunk HEC, Microsoft Sentinel export" diyor ama **hiçbir HTTP client kodu yok.** Sadece yerel JSON dosyası yazma var. Bu büyük bir "söylenen vs yapılan" farkı.

### String Bazlı Tipler
`ThreatInfo.level: String` ve `recommended_action: String` — bunlar enum olmalı. String olunca yazım hatası yapabilirsin, derleme zamanında kontrol yok.

### ProcessInfo Duplikasyonu
`ironsight_report::incident::ProcessInfo` ile `ironsight_core::ProcessInfo` neredeyse aynı ama farklı tipler kullanıyor (`String` vs `PathBuf`). Arada `From` dönüşümü yok — her yerde manuel mapping yapılıyor.

### Rapor Aggregation Yok
Raporlar process bazlı. "Tüm sisteme bakıldığında durum ne?" diyen bir özet rapor yok.

### Schema Versiyonu Yok
Rapor formatı değişirse SIEM parser'ları kırılır. `schema_version` alanı yok — hangi versiyon olduğunu anlayamazsın.

## Eksikler

SIEM entegrasyonu (Splunk, Sentinel, Syslog CEF), CSV export, rapor imzalama, şifreleme, typed enum'lar, streaming çıktı, retention policy — hepsi eksik. Yerel kullanım için yeterli ama **enterprise SIEM bağlantısı** için ciddi çalışma gerekiyor.
