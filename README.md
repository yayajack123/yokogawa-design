# Yokogawa Industrial Training

Situs statis untuk Yokogawa Indonesia Training Center, dengan halaman utama, daftar kursus, dan informasi tentang pusat pelatihan.

## Menjalankan preview lokal

Proyek ini tidak memerlukan instalasi dependensi atau proses build. Pastikan Python 3 tersedia, lalu jalankan dari folder proyek:

```bash
python3 -m http.server 8000
```

Buka [http://localhost:8000](http://localhost:8000) di browser. Tekan `Ctrl+C` di terminal untuk menghentikan server. Jika port 8000 sudah digunakan, pilih port lain, misalnya `python3 -m http.server 8001`, lalu buka `http://localhost:8001`.

## Halaman

- `index.html` — halaman utama.
- `courses.html` — daftar kursus.
- `course-detail.html` — detail kursus dengan navigasi berdasarkan kategori.

## Struktur proyek

- `styles.css` — gaya bersama untuk halaman situs.
- `components.js` — komponen bersama.
- `course-detail.js` dan `course-data.json` — navigasi dan data detail kursus dari `course-detail.md`.
- `motion.js` dan `cta-motion.js` — animasi halaman dan CTA.
- `locations.js` — interaksi bagian lokasi.
- `asset/` dan `assets/` — gambar, ikon, dan aset pendukung; pustaka GSAP tersedia di `asset/vendor/gsap/`.
- `design.md` dan `spec/` — referensi desain dan spesifikasi.

Font Open Sans dimuat dari Google Fonts dan memerlukan koneksi internet.
