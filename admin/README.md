# Meridian dashboard template

A self-contained admin starter built on Stisla. Every page is plain HTML, CSS,
and a little vanilla JS, so it drops into any backend (Laravel Blade, Rails,
Django, plain PHP) by copying the markup.

## Icons

Icons are [Solar](https://icon-sets.iconify.design/solar/) by 480 Design,
licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and
baked into the HTML as inline `<svg>`. There is no icon font, no CDN, and no
runtime library to load. An icon is just markup you can copy. The attribution
travels with the template in the `NOTICE` file — keep it when you redistribute.

### Swapping or adding an icon

1. Open [icon-sets.iconify.design/solar](https://icon-sets.iconify.design/solar/)
   and find an icon.
2. Click "SVG" to copy its markup.
3. Paste it where you want the icon. Drop it inside an `.icon-box` or a `.badge`
   and the existing CSS sizes it, or set `width`/`height` yourself.

```html
<span class="icon-box icon-box--primary">
  <svg width="1em" height="1em" viewBox="0 0 24 24"><!-- paste body --></svg>
</span>
```

Keep `fill="currentColor"` (or `stroke="currentColor"`) on the SVG so the icon
tracks the surrounding text color and theme.

## Tables

The Orders, Products, and Customers tables are plain server-rendered markup — a
loop over your data, with sorting, filtering, pagination, and search expressed
as links and a form (`?sort=`, `?status=`, `?page=`, `?q=`) the backend reads.
Copy the markup and swap the sample loop for your collection. The only client JS
is `assets/js/table-select.js`: row selection reveals the bulk-action bar and
fills the confirm dialogs. There is no data-grid runtime and no CDN table
library.

## Building the downloadable starter

`pnpm build` renders every page to static HTML, compiles the CSS to one
stylesheet, and packs the result into `dist/meridian.zip`. The
unzipped folder is named `meridian/` because the navigation links are absolute
(`/meridian/orders.html`): drop the folder at your web root and the links
resolve. The pages load `@stisla/vanilla` and ApexCharts from the CDN, so the
folder runs without an install.

## Two layers, two rules: CSS compiles, JS does not

Styling and behavior are shipped on purpose under different rules. Knowing which
is which tells you when you need a build step.

### CSS — needs a build, because Tailwind generates it

`assets/css/app.css` is the single compile unit. It pulls in the framework theme
and components from `@stisla/style`, the template styles under
`assets/css/meridian/`, and the Tailwind utilities the markup uses. The zip
ships the compiled result as `assets/css/style.css` (what every page links) and
keeps `app.css` plus the `meridian/` partials beside it so you can recompile.

To customize, edit `app.css` or a partial, then regenerate the stylesheet:

```bash
npm install        # pulls @stisla/style + the Tailwind CLI
npm run build:css  # app.css -> assets/css/style.css
```

One edit is mandatory if you move this CSS into your own project: the `@source`
lines at the top of `app.css` tell Tailwind which files to scan for class names.
Repoint them at wherever your views live (Laravel Blade, Rails ERB, Django,
plain HTML). Skip it and your markup renders unstyled, because the utilities it
uses are never generated.

### JavaScript — no build, edit it in place

The five scripts under `assets/js/` are first-party, hand-written, and loaded as
plain `<script src>` tags. They use no imports, no bundler, and no framework, so
you edit them directly and reload. Theme toggle, chart setup, the order-form
line-item editor, table selection, and the app-shell coordinator each live in
their own file and guard their own hooks, so a script is a no-op on a page that
lacks its elements.

The one piece you do not edit is `@stisla/vanilla`, the framework's behavior
layer. It loads precompiled from the CDN. Treat it as a dependency you consume,
the same as ApexCharts.

## Halaman admin Yokogawa

Halaman aktif: `index.html` (Course), `categories.html`, `course-form.html`,
`category-form.html`, `banner.html`, `password.html`, dan `login.html`.
Semua memakai CSS bawaan Stisla/Meridian tanpa stylesheet override.
Referensi desain: `../admin-design.md`. Halaman contoh lain tetap tersedia
sebagai referensi template dan tidak dimasukkan ke navigasi utama.

Sumber reusable shell dan layout auth berada di `templates/`; fungsi pembentuk
card, field, tabel, dialog, dan halaman ada di `build-pages.py`. Sesudah mengubah
sumber bersama, jalankan dari root repository:

```bash
python3 admin/build-pages.py
```

Output HTML sudah disertakan sehingga preview/deployment statis tidak perlu
menjalankan generator. Jangan mengedit output lalu menjalankan generator karena
perubahan output tersebut akan tertimpa. Interaksi preview berada di
`assets/js/admin-demo.js`: data contoh memakai sessionStorage, file media hanya
berlaku selama halaman terbuka. Validasi MIME berdasarkan isi berkas, session,
dan autentikasi nyata harus dilakukan backend. Login demo menggunakan
`admin@example.com` / `demo1234`; akses langsung halaman tidak dilindungi.

Data awal admin dibaca langsung dari `../course-data.json`, sumber yang sama
untuk halaman detail website dan berasal dari `course-detail.md`: 44 course
serta 7 kategori. Status awal Published adalah state preview; sumber tidak
menyediakan status CMS. Katalog statis `courses.html` saat ini hanya memuat 42
course, sedangkan admin mempertahankan semua record detail. Deskripsi kategori
awal berupa jumlah course karena sumber tidak menyediakan narasi kategori.
Perubahan snapshot sumber memulai data sesi preview baru agar data lama tidak
menutupi pembaruan sumber.

Form course menyediakan section Course content untuk menambah/menghapus hari
dan mengisi satu topik per baris. Data hari yang sudah ada dimuat saat edit dan
perubahannya disimpan dalam sesi preview. Slug dibuat otomatis dari course name
dan dapat diedit manual; slug manual tidak ditimpa saat nama berubah. Media dan
PDF berada di kolom kanan pada desktop. Thumbnail digunakan untuk popular course
di homepage; upload masih mengikuti batasan preview di atas.

## Ikon dan popular courses

Form Category dan Course memiliki input ikon opsional SVG/PNG maksimal 2 MB,
preview, nama file, dan aksi Remove icon untuk kembali ke ikon bawaan. Course
icon terpisah dari Thumbnail foto. Ikon ditampilkan melalui elemen gambar;
markup SVG unggahan tidak disisipkan ke halaman. Khusus ikon, gambar dan nama
file disimpan dalam sessionStorage agar dapat ditinjau lagi saat edit pada sesi
yang sama. Jika penyimpanan penuh, form menampilkan pesan gagal dan tetap terbuka.
Thumbnail, PDF, dan media banner tetap mengikuti batasan preview sebelumnya.

Course count adalah hitungan hanya-baca seluruh course dalam kategori tersebut,
termasuk Draft; kategori baru menampilkan 0 courses.

Halaman Courses memiliki tab All courses dan Popular courses. Tab Popular courses
memakai tabel Stisla/Meridian dengan handle drag & drop. Tarik handle menggunakan
mouse atau sentuhan; alternatif keyboard: fokuskan handle dan tekan Arrow Up atau
Arrow Down. Escape membatalkan drag. Urutan disimpan otomatis dalam sesi preview,
dan hanya reorder yang berhasil menampilkan toast sukses. Toast dapat ditutup,
hilang setelah 4,5 detik, serta menunda penutupan saat diarahkan pointer/difokuskan.

Tombol bintang pada All courses memilih course popular; pilihan baru masuk urutan
terakhir. Urutan awal adalah VPEG, PMCE-ONL, SPRS, VPMN. Popular order disimpan
sebagai daftar ID terpisah dari penanda popular. Course Draft atau kategori
Unpublished tetap terlihat dalam tabel pengaturan dengan alasan belum tampil di
Home. Panduan minimal 4 dan kelipatan 2 dihitung dari course yang memenuhi syarat
publikasi; jumlah lain tetap diperbolehkan. Tidak ada pagination di tab pengurutan.

Perubahan ini hanya untuk interaksi admin; tidak menambah sinkronisasi ke halaman
publik. Statistik hero tetap statis dan View source tetap menjadi referensi materi.

Untuk menghasilkan ulang hanya halaman yang sedang diubah:

```bash
python3 admin/build-pages.py index.html course-form.html category-form.html
```

CSS `assets/css/meridian/course-management.css` dimuat langsung oleh tiga halaman
tersebut untuk handle drag, penanda posisi drop, dan pembungkusan preview ikon.
Tabel, tab, field, dan toast tetap memakai komponen bawaan framework; tidak perlu
build CSS untuk mengubah adapter interaksi ini.
