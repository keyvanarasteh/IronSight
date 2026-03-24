# ironsight-security — K1 Açıklama

> Bu doküman `08_ironsight_security.md` dosyasının Türkçe derinlemesine açıklamasıdır.

---

## Bu Crate Ne Yapıyor?

Security crate bir binary dosyanın **bütünlük analizini** yapıyor. SHA-256 hash, Shannon entropy, imza doğrulama, şüpheli path tespiti — hepsini tek bir `SecurityAudit::audit()` çağrısıyla çalıştırıyor.

Bir gümrük kontrolü gibi düşün: paketin röntgenini çek (entropy), seri numarasını doğrula (hash), gönderen güvenilir mi kontrol et (signature), nereden geldi bak (path analysis).

## İyi Olan Ne?

- **Orchestrator pattern temiz** — `SecurityAudit::audit()` her şeyi çalıştırıp tek `AuditResult` dönüyor
- **Shannon entropy matematiği doğru** — 0.0–8.0 aralığı, bit/byte cinsinden
- **Risk sınıflandırması** var — Low (normal), Medium (sıkıştırılmış), High (paketlenmiş), Critical (şifreli/packed)
- **Cross-platform path analizi** — Unix ve Windows şüpheli dizinleri tanımlı
- **12+ test** — entropy matematiği, hash doğrulama, path tespiti

## Yüksek Sorunlar

### Linux İmza Doğrulama Sahte
Linux'ta "imza doğrulama" diye yapılan şey aslında **sadece path kontrolü:** `/usr/bin/` altındaysa "imzalı" sayılıyor. Bu gerçek imza doğrulama değil. Bir saldırgan kötü binary'yi `/usr/bin/` altına kopyalarsa "güvenilir" olarak işaretlenir.

Gerçek çözüm: GPG imza kontrolü, paket yöneticisi doğrulaması (`dpkg --verify`, `rpm -V`).

### Windows ve macOS İmza Doğrulama Yazılmamış
Her ikisi de `is_signed: None` dönüyor. Windows'ta Authenticode, macOS'ta codesign doğrulaması yapılması gerekiyor ama **TODO:** olarak bırakılmış.

### Büyük Dosyalarda OOM Riski
Hem hash hem entropy hesaplama `fs::read(path)` ile **tüm dosyayı** RAM'e okuyor. 1 GB'lık bir binary'de bellek dolabilir. Streaming/chunked okuma yapılmalı.

### Path Analizi Çok Agresif
`path_lower.contains("downloads")` herhangi bir yerde "downloads" geçen path'i şüpheli sayıyor. `/opt/app/downloads-manager/daemon` gibi meşru path'ler yanlış alarm veriyor.

## Eksikler

Gerçek Linux imza doğrulama, Windows Authenticode, macOS codesign, modül/kütüphane sıralama, VirusTotal/IOC hash kontrolü, ELF/PE header analizi, dosya tipi tespiti (magic bytes), configurable threshold'lar, severity score — hepsi eksik.

Temel hash + entropy + path analizi çalışıyor ama **gerçek binary integrity analizi** için daha derin implementasyon gerekiyor.
