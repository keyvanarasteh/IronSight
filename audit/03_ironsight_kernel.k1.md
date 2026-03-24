# ironsight-kernel — K1 Açıklama

> Bu doküman `03_ironsight_kernel.md` dosyasının Türkçe derinlemesine açıklamasıdır.

---

## Bu Crate Ne Yapması Gerekiyor?

Kernel crate projenin **gözü** olacaktı. Linux'ta eBPF tracepoint'leri, Windows'ta ETW ile **gerçek zamanlı** kernel seviyesi olay izleme yapacaktı.

Şu an core crate periyodik olarak `/proc` dosya sistemini okuyor — bu "her 5 saniyede bir fotoğraf çekmek" gibi. Kernel crate ise **canlı video** gibi olacaktı: bir process `mprotect()` çağırdığında, yeni bir `execve()` olduğunda, şüpheli bir `connect()` yapıldığında — **anında** haberdar olacaktık.

## Mevcut Durum

**9 satır.** Hepsi yorum ve TODO.

```rust
// TODO: Implement in Sprint 5
```

Bu projenin **en kritik eksik parçası.** Bir EDR ürünü kernel seviyesi görünürlük olmadan yarım kalır.

## Bu Eksiklik Ne Anlama Geliyor?

Kernel crate olmadan:
- **Gerçek zamanlı algılama yok** — Tehditler ancak tarama aralıklarında keşfediliyor
- **Yarış durumu penceresi** — Hızlı çalışan bir malware iki tarama arasında işini yapıp kendini temizleyebilir
- **Kernel seviyesi görünürlük yok** — mprotect çağrıları, syscall kalıpları, rootkit aktivitesi algılanamıyor
- **Ticari EDR ürünlerine kıyasla ciddi dezavantaj**

## Ne Yazılması Gerekiyor?

Linux tarafında Aya SDK ile eBPF programları yüklenmeli: mprotect, mmap, execve, connect, ptrace tracepoint'leri. Windows tarafında ferrisetw ile ETW session'ları açılmalı. İki tarafın olayları `KernelEvent` enum'una normalize edilip bir kanal üzerinden consumer'lara iletilmeli.

Ciddi bir mühendislik çalışması — root yetkisi, eBPF bilgisi, platform-spesifik test ortamı gerekiyor.
