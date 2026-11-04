# Yokogawa Industrial Training

Website statis Yokogawa Indonesia Training Center dan template admin pengelolaan konten. Dibangun dengan HTML, CSS, dan JavaScript tanpa framework frontend atau backend.

## Preview lokal

Jalankan dari root proyek dengan Python 3:

```bash
python3 serve.py 8000
```

Buka [website lokal](http://localhost:8000/) atau [template admin](http://localhost:8000/admin/). Jika port digunakan, jalankan `python3 serve.py 8001` dan sesuaikan URL. Hentikan server dengan `Ctrl+C`.

Preview tidak membutuhkan instalasi dependensi atau build. Gunakan HTTP server agar pemuatan data JSON berjalan. Google Fonts dan beberapa pustaka admin dari CDN memerlukan internet.

## Halaman publik

| File | Fungsi |
| --- | --- |
| `index.html` | Home: pengantar, kategori, course populer, FAQ, lokasi, dan CTA |
| `courses.html` | Katalog, pencarian, dan navigasi kategori course |
| `course-detail.html?course=VPOP` | Detail berdasarkan kode course, informasi, silabus, dan tautan PDF jika tersedia |
| `schedule.html` | Kalender tanggal ketersediaan pelatihan |
| `faq.html` | Pertanyaan dan jawaban pelatihan |
| `contact-us.html` | Kontak, kantor utama, dan peta lokasi |
| `404.html` | Halaman tidak ditemukan dengan navbar bersama dan ilustrasi industri |
| `components.html` | Halaman pemeriksaan komponen bersama |

## Struktur proyek

```text
.
├── *.html                  # Halaman publik di root
├── styles.css              # Token, komponen, dan aturan responsif publik
├── components.js           # Navbar, CTA, dan footer bersama
├── courses.js              # Filter katalog dan navigasi kategori aktif
├── course-detail.js        # Render detail dan panel pencarian course mobile
├── course-data.json        # Data course yang dimuat detail halaman
├── course-detail.md        # Referensi sumber detail course
├── availability-data.js    # Data awal dan penyimpanan ketersediaan lokal
├── schedule.js             # Integrasi kalender
├── locations.js            # Interaksi peta dan detail kantor
├── motion.js               # Motion halaman dan menu navbar dengan GSAP
├── cta-motion.js           # Motion CTA bersama
├── asset/                  # Foto, SVG, ikon, dan aset per halaman
│   └── vendor/             # GSAP, FullCalendar, dan Leaflet
├── assets/                 # Aset pendukung yang sudah ada
├── admin/
│   ├── *.html              # Halaman template admin
│   ├── assets/css/         # CSS terkompilasi dan sumber styling admin
│   ├── assets/js/          # Sidebar, tema, demo, availability, dan interaksi
│   ├── templates/          # Template shell, login, dan ikon
│   ├── build-pages.py      # Generator halaman admin
│   ├── package.json        # Dependensi dan perintah build CSS admin
│   ├── README.md           # Panduan template admin
│   └── NOTICE              # Atribusi dependensi dan ikon
├── spec/                   # PRD dan spesifikasi konten
├── design.md               # Sistem desain dan mapping token Figma
├── motion.md               # Panduan serta inventaris motion
├── admin-design.md         # Referensi desain admin
├── AGENTS.md               # Panduan pengerjaan proyek
├── serve.py                # Preview lokal dengan halaman 404 proyek
└── vercel.json             # Konfigurasi hosting statis dan redirect /admin
```

Gunakan komponen publik di `components.js` untuk perubahan navbar, CTA, dan footer. Sidebar admin bersama dikelola di `admin/assets/js/sidebar.js`. Pertahankan token di `styles.css` sesuai `design.md`; perubahan motion mengacu pada `motion.md` dan mendukung reduced motion.

## Template admin

Akses melalui `/admin/`. Halaman utama pengelolaan mencakup course (`index.html`, `course-form.html`), kategori (`categories.html`, `category-form.html`), banner (`banner.html`), dan tanggal tersedia (`availability.html`). Template juga menyertakan halaman akun, autentikasi, error, serta contoh orders, products, customers, dan reports.

Login demo: `/admin/login.html`, email `admin@example.com`, password `demo1234`. Admin merupakan prototipe statis dengan penyimpanan browser, tanpa backend atau autentikasi nyata.

Tanggal tersedia disimpan di `localStorage` dengan key `yokogawa-availability-v1` dan dibaca kalender publik setelah reload pada browser serta origin yang sama. Data awal berisi 41 tanggal dalam sembilan bulan tahun 2026. Data ini tidak tersinkron antarperangkat atau antara localhost dan Vercel.

CSS admin sudah tersedia untuk preview. Jika mengubah sumber CSS admin, jalankan:

```bash
cd admin
npm install
npm run build:css
```

Lihat `admin/README.md`, `admin/NOTICE`, dan `admin-design.md` untuk panduan lanjutan. Tidak diperlukan build CSS admin ketika hanya mengubah JavaScript.

## Deployment

- [Website production](https://yokogawa-design.vercel.app/)
- [Template admin production](https://yokogawa-design.vercel.app/admin/)
- [Repository GitHub](https://github.com/yayajack123/yokogawa-design)

Deployment production dibuat melalui Vercel CLI dari snapshot workspace lokal. Auto-deploy dari GitHub belum dikonfigurasi; perubahan lokal tidak otomatis tampil di production. `vercel.json` mengarahkan `/admin` ke `/admin/` agar path relatif aset dan navigasi admin tetap benar.

Halaman `404.html` otomatis ditampilkan untuk URL yang tidak ditemukan pada hosting statis Vercel dan preview lokal melalui `serve.py`, dengan status HTTP 404 dan URL asal tetap dipertahankan. Server Python standar (`python3 -m http.server 8000`) tetap dapat digunakan, tetapi memakai halaman 404 bawaannya. Halaman ini memakai base URL `/` agar aset dan navbar tetap benar pada URL bertingkat. Ilustrasi dan prompt imagegen tersimpan di `asset/not-found/`.

Kode course yang tidak dikenal atau kosong pada `course-detail.html?course=...` diarahkan ke `/404.html` menggunakan `location.replace`, termasuk saat navigasi Back/Forward. Membuka `course-detail.html` tanpa parameter tetap menampilkan course pertama.

## SEO

Metadata, canonical, dan `sitemap.xml` menggunakan URL production `https://yokogawa-design.vercel.app`. Jika domain production berubah, perbarui URL tersebut di HTML publik, `course-detail.js`, `robots.txt`, dan `sitemap.xml`. Perbarui sitemap saat daftar course berubah. Gambar pratinjau sosial menggunakan `asset/seo-training.jpg`, turunan dari foto pelatihan yang sudah ada di proyek.

Detail course dirender di browser dari `course-data.json`; judul, deskripsi, dan canonical diperbarui dengan JavaScript. Crawler yang tidak menjalankan JavaScript akan melihat metadata umum, sehingga pratinjau sosial per course memerlukan rendering di server atau halaman statis per course. Header `X-Robots-Tag` untuk admin berlaku pada deployment Vercel.

## Gambar responsif

Gambar asli tetap disimpan di `asset/`. Varian WebP yang digunakan situs berada di `asset/optimized/v1/` dan memakai cache satu tahun di Vercel. Untuk memperbarui gambar, buat folder versi baru, misalnya `asset/optimized/v2/`, lalu buat varian dengan `cwebp -q 80 -resize LEBAR 0 sumber -o tujuan.webp` tanpa memperbesar gambar asli. Gunakan lebar 768, 1280, dan 1920 piksel untuk hero; gunakan 480, 800, dan 1280 piksel untuk gambar lain, dibatasi lebar sumber.

Perbarui `srcset` dan `sizes` pada elemen `<picture>` yang memakai gambar tersebut, serta referensi poster dan CSS jika gambar hero homepage berubah. Pertahankan gambar asli sebagai fallback. Tambahkan aturan cache untuk folder versi baru di `vercel.json`; jangan menimpa aset dalam folder versi lama karena browser dapat menyimpannya dalam cache.
