# ironsight-memory — K1 Açıklama

> Bu doküman `04_ironsight_memory.md` dosyasının Türkçe derinlemesine açıklamasıdır.

---

## Bu Crate Ne Yapıyor?

Memory crate bir process'in **bellek haritasını** okuyor, şüpheli bölgeleri tespit ediyor ve kalıp taraması (pattern scanning) yapıyor.

Düşün ki bir binayı güvenlik taramasından geçiriyorsun: her odanın ne için kullanıldığını biliyorsun (yatak odası, mutfak...). Ama biri yatak odasını **silah deposu** yapmış — izinler yanlış. İşte W^X ihlali böyle bir şey: bir bellek bölgesi hem yazılabilir hem çalıştırılabilir olmamalı. Öyleyse büyük ihtimalle shellcode enjekte edilmiş.

## İyi Olan Ne?

- `/proc/PID/maps` parser'ı sağlam — hex adresler, izinler, device, inode, pathname hepsini doğru okuyor
- **W^X ihlal tespiti** çalışıyor — writable + executable = kırmızı bayrak
- **Anonim çalıştırılabilir bölge tespiti** — dosyasız (fileless) malware belirtisi
- **14 şüpheli kalıp** tanımlı — shell komutları, download araçları, C2 beacon'ları
- **Memory diff** tamamlanmış — bölgeler arası ekleme, silme, izin değişikliği, boyut değişikliği

## Yüksek Sorunlar

### OOM Riski
Scanner bir bellek bölgesinin tamamını RAM'e kopyalıyor. Bölge 64 MiB'a kadar çıkabiliyor. Çok sayıda bölge taranırsa sistem belleği dolabilir. Çözüm: 4 MiB'lık parçalar halinde chunk okuma.

### Sessiz Hata
`scan_process()` herhangi bir hata olduğunda `continue` ile atlıyor — çağıran tarafa hiçbir hata bildirmiyor. Boş `Vec` dönüyor. Saldırganın `/proc/PID/mem` erişimini engellemesi yeterli — hiçbir uyarı olmadan tarama "başarılı" görünüyor.

### xxhash Kullanılmıyor
Cargo.toml'da `xxhash-rust` dependency tanımlı ama kodun hiçbir yerinde kullanılmıyor. Bellek bölgesi hash'leme için eklenmişti ama implement edilmemiş. Dead dependency.

## Eksikler

Sürekli izleme modu, bölge başına entropy hesaplama, YARA kuralı desteği, Windows/macOS bellek okuma, configurable kalıplar — hepsi eksik. Mevcut yapı Linux'ta tek seferlik tarama için yeterli ama **sürekli izleme ve zengin tespit** için genişletilmesi gerekiyor.
