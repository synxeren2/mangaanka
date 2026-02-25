# MangaAnka

Dosya sistemi tabanlı, tam özellikli bir manga okuma sitesi. Next.js 14 ve Tailwind CSS 4 ile yapılmıştır.

## Özellikler

- 📚 Manga koleksiyonu ana sayfası (kapak görseli, bölüm sayısı)
- 📖 Manga detay sayfası (bölüm listesi)
- 🖼️ Bölüm okuyucu — **Kaydır modu** (tüm sayfalar dikey) veya **Sayfa modu** (tek sayfa)
- ⬅️ ➡️ Bölümler arası navigasyon
- 🌙 Karanlık tema

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Manga Ekleme

`public/manga/` klasörü içine aşağıdaki yapıda dizin oluşturun:

```
public/
  manga/
    manga-adi/
      cover.svg        ← kapak görseli (opsiyonel)
      chapter-1/
        001.jpg
        002.jpg
        ...
      chapter-2/
        001.jpg
        ...
```

Desteklenen görüntü formatları: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`

## Geliştirme

```bash
npm run dev    # Geliştirme sunucusu
npm run build  # Üretim derlemesi
npm run start  # Üretim sunucusu
```


Basit bir manga okuma sitesi (Next.js + TypeScript + Tailwind) — başlangıç scaffolding.

Kurulum:
1. Node.js v18+ ve npm
2. npm install
3. npm run dev
4. Tarayıcıda http://localhost:3000

Notlar:
- İçerik `public/manga` altına her manga için klasör ve bölümleri (image dosyaları) ekleyin.
- Telif haklarına dikkat edin; yalnızca izinli veya public domain içerik kullanın.