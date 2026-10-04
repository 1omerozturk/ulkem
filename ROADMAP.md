# Ülkem — Proje Yol Haritası

> Bu belge mevcut depo ve çalışma ağacı incelenerek hazırlandı. “Tamamlandı” kodda bulunan parçaları ifade eder; cihaz üzerinde uçtan uca çalıştığı doğrulanmış anlamına gelmez.

## Proje özeti

Ülkem, Expo Router ve React Native ile geliştirilen; Türkiye şehirleri ve dünya ülkeleri hakkında kısa süreli bilgi yarışmaları sunmayı hedefleyen bir mobil uygulamadır. Veriler SQLite ile cihazda saklanacak şekilde tasarlanmıştır. Mevcut sürüm `1.1.0`; proje Expo SDK 57 ve React Native 0.86 kullanıyor.

## Tamamlananlar

- [x] Expo Router ile giriş/kayıt, ana sayfa, quiz kategorileri, profil ve can ekranları için ekran/rota iskeleti.
- [x] Kullanıcı adı/şifre giriş ve kayıt ekranları ile temel form doğrulama arayüzü.
- [x] SQLite kullanıcı ve quiz istatistik tablolarının oluşturulması ve temel veri erişim yardımcıları (`model/db.js`).
- [x] Türkiye quiz kategorileri: il/ilçe, il/bölge ve plaka için kategori ve ekran akışı.
- [x] Türkiye il ve ilçe quiz verilerini uygulama içindeki yerel JSON dosyalarından yükle; Türkiye quizleri için ağ isteği bağımlılığını kaldır.
- [x] Yerel il/ilçe verisiyle ilçe, bölge ve plaka sorularını üret; büyükşehir statüsü için yeni quiz kategorisi ekle.
- [x] Türkiye illerinin vektör sınırlarını SVG tabanlı haritada vurgulayan, yeni harita quizlerine genişletilebilir altyapıyı ve “Haritada İli Bul” quizini ekle.
- [x] Dünya quiz kategorileri: ülke/başkent, ülke/kıta ve ülke/bayrak için kategori ve ekran akışı.
- [x] Quiz oynanışı arayüzü: zaman çubuğu, cevap seçimi, puanlama, animasyonlar ve sonuç ekranı bileşenleri.
- [x] Profil istatistikleri ve can satın alma/yenileme arayüz bileşenleri.
- [x] Uygulama renkleri, Lottie animasyonları ve quiz ekranı stilleri.
- [x] EAS yapılandırması ve Android/iOS/web Expo yapılandırması.
- [x] Kimlik doğrulama ekranlarını ortak, okunaklı renk paleti ve kaydırılabilir düzenle yenile.
- [x] Kök yönlendirmede veritabanı/oturum hazırlığını tamamlanana kadar bekle ve korumalı rotaları yönet.
- [x] Ana Sayfa ve Profil için alt sekme çubuğu ekle; quiz ve can rotalarını sekme menüsünde gizle.
- [x] Ana menüye kullanıcı özeti, puan/can kartları ve Dünya/Türkiye kategori girişleri ekle.
- [x] Profil sekmesini kullanıcı istatistiklerine bağla; Can rotasını ayrı can satın alma ekranına yönlendir.
- [x] Can satın alma bileşenini mevcut puan/can durumuna göre etkinleştir ve store güncelleme sonucunu göster.
- [x] Geri düğmesini Expo Router ile çalışan, erişilebilir ve güvenli geri dönüş davranışına taşı.
- [x] Dünya ve Türkiye quiz kategori ekranlarını ortak, açıklamalı ve uygulama renklerine uygun tasarıma al.
- [x] Quiz kategori ekranını temaya özel karşılama alanı, oyun sayacı, yenilenmiş kartlar ve erişilebilir geri düğmesiyle tasarla; 20 soruluk plaka seçeneğini kaldır.
- [x] Dünya ve Türkiye quiz kategorilerini iki sütunlu kart düzenine geçir; quiz adlarını, açıklamalarını ve ikonlarını içeriklerine göre yenile.
- [x] Quiz başlangıç, soru ve sonuç ekranlarının görsel dilini uygulama paletiyle eşleştir; quiz başına istatistikleri sıfırla.
- [x] Can ekranında 10 dakikalık yenilenme sayacını göster ve can tüketiminde yenilenme zamanını tutarlı koru.
- [x] Ana sayfayı oyun merkezi düzenine geçir; Oyna/Profil alt menüsüyle sık kullanılan alanlara erişimi sadeleştir.
- [x] Quiz sırasında alt menüyü ve Profil/çıkış erişimini gizle; Android geri tuşuyla aktif oyundan çıkışı engelle.
- [x] Alt menüyü oyun temasına uygun, seçili sekmeyi belirginleştiren kapsül tasarıma geçir.

## Öncelikli işler

### P0 — Projeyi tekrar açılabilir hâle getir

- [x] `store/authStore.js` ve `service/quizService.ts` dosyaları geri getirildi; ekran importlarıyla bağlantı kuruldu.
- [ ] `app/_layout.tsx` ve quiz ekranlarının gerçek cihazda açılışını doğrula.
- [x] Eksik `wonka` dahil proje bağımlılıklarını kilit dosyasına göre yeniden kur.
- [x] Expo Go SDK 57 uyumluluğu için Expo SDK ve ilişkili paketleri SDK 57 sürümlerine yükselt.
- [x] Giriş ekranındaki hatalı Ionicons importunu Expo'nun ikon paketine yönlendir.
- [ ] Expo Go ile Android/iOS cihazında giriş ve ana akışı doğrula.
- [ ] Başlangıçta veritabanı hazırlama ve oturum kontrolünü sıralı/hata durumlarını gösterecek biçimde doğrula.

### P1 — Ana akışları tamamla ve doğrula

- [ ] Kayıt, giriş, oturumun kalıcı tutulması ve çıkış akışlarını gerçek cihaz/web çalıştırmasında doğrula.
- [ ] Tüm quiz türlerinde soru üretimi, seçeneklerin benzersizliği, sayaç/süre aşımı ve son soru/sonuç geçişini doğrula.
- [ ] Yerel il/ilçe verisiyle il, ilçe, bölge, plaka ve büyükşehir quizlerini Expo Go cihazında uçtan uca doğrula.
- [ ] Haritada İli Bul quizinin vektör harita görünümünü ve soru/cevap akışını Expo Go cihazında doğrula.
- [ ] Cevap, puan, quiz ve doğru/yanlış istatistiklerinin SQLite'a yazılıp uygulama yeniden açıldığında korunmasını sağla.
- [ ] Can harcama, zamanla can yenileme, üst sınır ve can alma akışlarının tutarlı çalışmasını doğrula.
- [ ] Eksik, boş veya hatalı veride kullanıcıya anlaşılır yükleniyor/hata/yeniden deneme durumları göster.

### P2 — Ürün kalitesi

- [ ] Ayarlar penceresindeki ses, dil ve tema seçeneklerini gerçek ve kalıcı tercihlere dönüştür.
- [ ] Ana sayfadaki kullanılmayan/boş aksiyonları tamamla; erişilebilirlik etiketleri ve küçük ekran düzenini gözden geçir.
- [ ] Parolaları düz metin saklamayı bırak; yerel hesap yaklaşımının güvenlik ve veri kurtarma sınırlarını netleştir.
- [ ] Kullanılmayan kodu, debug loglarını ve başlangıç şablonundan kalan varlıkları temizle.
- [ ] Lint ve TypeScript doğrulamasını çalışır hâle getir; temel quiz, hesap ve can senaryoları için kontroller ekle.

### P3 — Yayına hazırlık

- [ ] Android ve iOS geliştirme derlemelerini EAS ile üretip gerçek cihazlarda doğrula.
- [ ] Uygulama kimliği, ikon, açılış ekranı, gizlilik/veri beyanı ve mağaza metinlerini son hâle getir.
- [ ] Yedekleme, hesap silme ve uygulama verisi sıfırlama davranışını belirle.
- [ ] Sürümleme, dağıtım ve hata izleme sürecini tanımla.

## İnceleme notları ve açık engeller

- `store/authStore.js` ile `service/quizService.ts` çalışma ağacında mevcut; Expo Go üzerinde uçtan uca doğrulama bekliyor.
- Expo Go ile Android/iOS açılışı ve quiz akışı henüz bu çalışma oturumunda doğrulanmadı.
- `model/db.js` içinde `deleteDb()` fonksiyonu SQLite API'sinde geçersiz görünen `DROP DATABASE` komutunu kullanıyor; çalıştırılmıyor olsa da düzeltilmesi gerekiyor.
- SQLite kullanıcı tablosunda parola alanı düz metin olarak tanımlanmış; güvenlik iyileştirmesi gerekli.
- `components/QuizScreen.jsx` sayaç/zaman aşımı, istatistik yazma ve quiz sonu geçişlerinde gerçek cihaz doğrulaması gerektiriyor.
- `app.json` SQLCipher'ı iOS'ta etkinleştirirken Android'de kapatıyor; platformlar arası depolama güvenliği ayrıca karara bağlanmalı.
- `README.md` hâlâ varsayılan Expo başlangıç metni; gerçek ürün akışı, kurulum ve çalıştırma yönergeleriyle güncellenmeli.

## Birlikte inceleme için önerilen sıra

1. Eksik bağımlılık ve silinmiş modüller engelini çözerek geliştirme sunucusunu başlat.
2. Açılış, giriş/kayıt ve ana sayfa ekranlarını birlikte gözden geçir.
3. Önce bir Türkiye, ardından bir dünya quizini baştan sona oynayıp puan/can/istatistik davranışını kontrol et.
4. Gözlemleri bu yol haritasına ekleyip öncelikleri birlikte güncelle.
