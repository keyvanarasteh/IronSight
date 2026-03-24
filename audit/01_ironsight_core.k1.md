# ironsight-core — K1 Açıklama

> Bu doküman `01_ironsight_core.md` dosyasının Türkçe derinlemesine açıklamasıdır.

---

## Bu Crate Ne Yapıyor?

Core crate projenin **kalbi.** Sistemdeki tüm process'leri tarıyor, anlık fotoğraf (snapshot) çekiyor, iki fotoğraf arasındaki farkları buluyor (diff), ve filtreleme yapıyor.

Düşün ki bir güvenlik kamerası sistemi: her 5 saniyede bir fotoğraf çek, öncekiyle karşılaştır, "yeni birisi geldi mi, birisi gitti mi?" diye kontrol et. İşte core crate bunu process'ler için yapıyor.

## İyi Olan Ne?

- **Modüler yapı** oturmuş — her iş (snapshot, diff, filter, spy) kendi dosyasında
- **30+ test** var — ciddi bir coverage
- **Builder-pattern filter** güzel tasarlanmış — `ProcessFilter::new().name_contains("chrome").cpu_above(50)` gibi zincirleme yapabiliyorsun
- **Process tree** çalışıyor — hangi process kimin çocuğu görebiliyorsun

## Kritik Sorunlar

### ✅ [ÇÖZÜLDÜ] Graceful Shutdown Yok
`ProcessSpy::start_monitoring()` bir thread başlatıyor — `loop { ... }` ile sonsuz döngü. Ama bu thread'i **durduracak mekanizma yok.** Ne `AtomicBool` ile stop flag var, ne `Drop` implementasyonu. Thread sonsuza kadar çalışıyor.

Bu niye kötü? Çünkü:
- İkinci kez `start_monitoring()` çağırırsan önceki thread kaçak olarak çalışmaya devam eder
- Programı kapatırken thread temiz kapanmaz
- Kaynak sızıntısı (resource leak) oluşur

### ✅ [ÇÖZÜLDÜ] Snapshot Serialize Edilemiyor
`ProcessSnapshot` içinde `std::time::Instant` kullanıyor — bu tip `Serialize`/`Deserialize` yapamaz. Yani snapshot'ı diske yazamaz, ağ üzerinden gönderemez, JSON'a çeviremezsin. `DateTime<Utc>` ile değiştirilmeli.

### ✅ [ÇÖZÜLDÜ] wait_for_spawn Sürekli Tam Tarama Yapıyor
Belirli bir process'in başlamasını beklerken her 200ms'de **tüm sistemi baştan tarıyor.** CPU'yu yakıyor. Doğrusu: event kanalını (subscribe) dinlemek.

## Yüksek Sorunlar

- `kill()` ve `signal()` fonksiyonları başarısız olsa bile `Ok(())` dönüyor — yani "öldürdüm" diyor ama aslında öldürememiş olabilir
- `wait_for_exit()` system mutex'ini alıp `p.wait()` çağırıyor — bu blocking call, mutex'i sonsuza kadar kilitliyor. Deadlock.
- `SpyEvent`'lerde timestamp yok — olayları sıralayamazsın

## Eksikler

stop_monitoring(), snapshot cache, event history, cgroup/container farkındalığı, network namespace desteği — hepsi eksik. Temel yapı sağlam ama **production için gerekli parçalar** yazılmamış.
