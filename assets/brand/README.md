# Ülkem marka işareti

- `ulkem-mark.svg`: düzenlenebilir özgün vektör kaynak.
- `ulkem-mark.png`: şeffaf işaret; splash ve Android adaptive icon katmanı.
- `ulkem-app-icon.png`: kare uygulama/web ikonu.
- `assets/lottie/ulkem-loading.json`: aynı pusula-konum fikrinin hareketli sürümü.

SVG kaynağında harita silüeti, konum pini ve pusula iğnesi bir araya getirilmiştir. PNG dosyaları bu vektör kaynağından dışa aktarılmıştır.

LottieFiles çalışma akışı: hesabında **My Dashboard → Upload animations** üzerinden `assets/lottie/ulkem-loading.json` dosyasını yükle. Animasyonu açıp **Open in Editor** ile renk, hız ve katmanları düzenleyebilir; dışa aktarırken Lottie JSON biçimini seçebilirsin. Uygulamadaki animasyonu güncellemek için düzenlenmiş JSON'u `assets/lottie/ulkem-loading.json` üzerine koy.

Expo'nun yerel splash ekranı animasyon oynatmaz; bu nedenle ilk native açılışta sabit `ulkem-mark.png` görünür. JavaScript uygulama açılır açılmaz ortak `Loading` bileşeninde Lottie animasyonu devam eder.
