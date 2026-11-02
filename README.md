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
- `schedule.html` — kalender contoh jadwal pelatihan.

## Struktur proyek

- `styles.css` — gaya bersama untuk halaman situs.
- `components.js` — komponen bersama.
- `course-detail.js` dan `course-data.json` — navigasi dan data detail kursus dari `course-detail.md`.
- `schedule.js` dan `asset/vendor/fullcalendar/` — kalender dan FullCalendar 6.1.19 (MIT).
- `motion.js` dan `cta-motion.js` — animasi halaman dan CTA.
- `locations.js` — interaksi bagian lokasi.
- `asset/` dan `assets/` — gambar, ikon, dan aset pendukung; pustaka GSAP tersedia di `asset/vendor/gsap/`.
- `design.md` dan `spec/` — referensi desain dan spesifikasi.

Font Open Sans dimuat dari Google Fonts dan memerlukan koneksi internet.

## Template admin

Jalankan server dari root, lalu buka `http://localhost:8000/admin/` untuk
preview Course, Kategori, Home Banner, dan menu akun. Login contoh berada di
`/admin/login.html` (`admin@example.com` / `demo1234`). Website publik tetap
di `/`. Admin merupakan prototipe statis dengan data sesi browser, tanpa
backend atau autentikasi nyata. Struktur komponen dan cara memperbarui halaman
bersama dijelaskan di `admin/README.md` dan `admin-design.md`.

## Production preview

- Website: https://yokogawa-design.vercel.app
- Admin template: https://yokogawa-design.vercel.app/admin/

The current production deployment was uploaded from the local workspace with Vercel CLI. It is not configured to automatically deploy Git pushes. `vercel.json` redirects `/admin` to `/admin/` so relative admin asset paths resolve correctly.

### Availability admin preview

Open `admin/availability.html` to add a single available date or an inclusive date range, filter dates by month, and remove dates. Data is persisted in localStorage (`yokogawa-availability-v1`) and read by `schedule.html` after reload on the same browser and origin. The initial dataset contains 41 dates across nine months of 2026. This static preview does not provide shared server storage or authentication; production publishing requires a backend.

Sidebar admin bersama dirender oleh `admin/assets/js/sidebar.js` pada seluruh halaman admin aktif; urutan menu dan ikon dikelola di file tersebut. `admin/build-pages.py` mempertahankan pemakaian komponen ini saat halaman dibuat ulang.
