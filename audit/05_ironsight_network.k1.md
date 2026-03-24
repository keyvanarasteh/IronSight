# ironsight-network — K1 Açıklama

> Bu doküman `05_ironsight_network.md` dosyasının Türkçe derinlemesine açıklamasıdır.

---

## Bu Crate Ne Yapıyor?

Network crate bir process'in **ağ bağlantılarını** haritalıyor. Hangi portları dinliyor, nereye bağlanıyor, şüpheli portlara bağlantı var mı — bunları tespit ediyor.

Bir evin tüm kapı ve pencerelerini kontrol etmek gibi: hangi kapılar açık (listeners), hangi pencerelerden dışarıya bakılıyor (external connections), ve herhangi biri şüpheli bir yöne mi açılıyor (suspicious ports — Metasploit, Tor, IRC vs.).

## İyi Olan Ne?

- **Tam /proc/net parser** — TCP v4, TCP v6, UDP v4, UDP v6 hepsini okuyor
- **Socket-to-PID mapping** — Inode bazlı, `/proc/PID/fd` üzerinden hangi socket kimin tespit ediliyor
- **7 bilinen kötü port** tanımlı — 4444 (Metasploit), 5555 (backdoor), 6667 (IRC), 9050 (Tor) vs.
- **Private IP tespiti** doğru — IPv4 private aralıklar, loopback, link-local

## Yüksek Sorunlar

### DNS Lookup Subprocess Çağırıyor
`host` komutunu subprocess olarak çalıştırıyor. Bu:
- **Çok yavaş** — her DNS lookup için yeni process spawn ediliyor
- **`host` komutu kurulu olmayabilir** — bazı minimal sistemlerde yok
- **Timeout yok** — subprocess sonsuza kadar bekleyebilir
- Doğrusu: `hickory-dns` veya `trust-dns-resolver` gibi bir kütüphane kullanmak

### Her Process İçin Tam /proc/net Taraması
`scan_pid()` çağrıldığında tüm `/proc/net` dosyaları baştan okunuyor. 500 process için 2000 dosya okuması demek. Çözüm: bir kez tara, cache'le, PID ile filtrele.

### IPv6 Byte Sırası Sorunu
IPv6 adresleri /proc/net'te karmaşık byte sırasında saklanıyor. Mevcut kod little-endian sistemlerde doğru çalışıyor ama **big-endian sistemlerde yanlış.** `u32::from_be()` kullanılmalı.

### Şüpheli Port Listesi Çok Küçük
Sadece 7 port tanımlı. SSH backdoor (2222), RDP (3389), NetBus (12345), SubSeven (27374) gibi yaygın kötü portlar eksik. Ve liste configurable değil — hardcoded.

## Eksikler

Async DNS, bağlantı zaman çizelgesi, GeoIP, bandwidth izleme, beaconing tespiti, TLS sertifika analizi, PCAP entegrasyonu — hepsi eksik. Temel socket enumeration çalışıyor ama **akıllı ağ analizi** için çok yol var.
