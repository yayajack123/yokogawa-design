# Admin Design — Meridian / Stisla

Dokumentasi implementasi template asli di `admin/`. Disusun dari seluruh 17 halaman HTML, CSS terkompilasi, 13 partial Meridian, lima skrip lokal, README, package manifest, dan NOTICE pada 2 November 2026.

Dokumen ini menjelaskan **kondisi template saat ini**, bukan tema Yokogawa yang diusulkan sebelumnya. Gunakan tampilan bawaan sebagai baseline; perubahan branding harus menjadi pekerjaan eksplisit terpisah. Tidak ada stylesheet override yang ditambahkan melalui dokumentasi ini.

## 1. Sumber kebenaran dan arsitektur

| Lapisan | Sumber | Peran |
| --- | --- | --- |
| Token dan komponen framework | `@stisla/style/theme.css`, `@stisla/style/components.css` | Diimpor oleh sumber CSS; paket tidak disertakan sebagai source lokal |
| Sumber kompilasi | `admin/assets/css/app.css` | Tailwind v4, import framework, import partial, dan pemindaian kelas |
| Komposisi Meridian | `admin/assets/css/meridian/*.css` | Shell, content surface, auth, statistik, chart, sticky bar, dan komposisi khusus |
| CSS yang benar-benar dimuat browser | `admin/assets/css/style.css` | Artefak kompilasi yang disertakan dalam template |
| Struktur dan contoh state | `admin/*.html` | Referensi markup komponen dan layout |
| Interaksi framework | CDN `@stisla/vanilla@3/dist/stisla.js` | Select, menu, dialog, popover, tabs, dan hook framework |
| Interaksi halaman | `admin/assets/js/*.js` | Shell, theme, chart, line items, dan seleksi tabel |

Token dalam dokumentasi ini diambil dari **CSS terkompilasi yang tersedia**. `@stisla/style` memakai versi `beta`, sementara Tailwind memakai `^4.0.0`; instalasi ulang dapat menghasilkan perbedaan. Jangan menganggap hasil paket terbaru otomatis identik dengan stylesheet bawaan.

## 2. Color System

Template menggunakan warna semantik berbasis OKLCH. Pertahankan format sumber untuk menghindari konversi hex yang kehilangan presisi. Gunakan token berdasarkan fungsi, bukan nama warna visual.

### Palet light bawaan

| Token | Nilai pada stylesheet | Penggunaan |
| --- | --- | --- |
| `--color-primary` | `oklch(57.3% .1844 257.69)` | Aksi utama dan highlight merek |
| `--color-primary-foreground` | `oklch(100% 0 0)` | Teks pada primary |
| `--color-primary-emphasis` | `oklch(52.1% .1844 257.69)` | Penekanan primary |
| `--color-success` | `oklch(53.6% .1853 149.54)` | Status berhasil |
| `--color-success-foreground` | `oklch(100% 0 0)` | Teks pada warna status |
| `--color-success-emphasis` | `oklch(48.4% .1853 149.54)` | Penekanan warna status |
| `--color-warning` | `oklch(76.97% .1645 70.61)` | Status peringatan |
| `--color-warning-foreground` | `oklch(27% 0 0)` | Teks pada warna status |
| `--color-warning-emphasis` | `oklch(54.3% .1645 70.61)` | Penekanan warna status |
| `--color-danger` | `oklch(59.4% .2229 26.82)` | Aksi destruktif dan error |
| `--color-danger-foreground` | `oklch(100% 0 0)` | Teks pada warna status |
| `--color-danger-emphasis` | `oklch(52.9% .2229 26.82)` | Penekanan warna status |
| `--color-info` | `oklch(55% .148143 238.104)` | Informasi |
| `--color-info-foreground` | `oklch(100% 0 0)` | Teks pada warna status |
| `--color-info-emphasis` | `oklch(50.1% .148143 238.104)` | Penekanan warna status |
| `--color-background` | `oklch(92.72% .0116 257.69)` | Canvas di belakang shell |
| `--color-foreground` | `oklch(27% 0 0)` | Teks utama |
| `--color-surface` | `oklch(100% 0 0)` | Permukaan konten/card |
| `--color-surface-2` | `oklch(98% 0 0)` | Permukaan sekunder |
| `--color-surface-3` | `oklch(97% 0 0)` | Permukaan tingkat ketiga |
| `--color-border` | `oklch(95% 0 0)` | Garis pemisah standar |
| `--color-border-strong` | `oklch(93% 0 0)` | Border input / garis lebih kuat |
| `--color-muted-foreground` | `oklch(52% 0 0)` | Teks pendukung |
| `--color-overlay` | `oklch(15.5% 0 0)` | Permukaan overlay framework |
| `--color-overlay-foreground` | `oklch(98% 0 0)` | Teks overlay |
| `--color-neutral` | `oklch(91% 0 0)` | Kontrol netral |
| `--color-neutral-foreground` | `oklch(27% 0 0)` | Teks pada neutral |
| `--color-accent` | `oklch(96% 0 0)` | Highlight netral |
| `--color-accent-foreground` | `oklch(27% 0 0)` | Teks pada accent |
| `--color-highlight` | `#2274e21f` | Sorotan seleksi teks |

Tidak ada token `--color-secondary` bawaan pada palet ini. Gunakan `neutral`, `accent`, atau modifier tombol yang sudah tersedia untuk aksi pendamping; jangan mengasumsikan secondary berarti kuning Yokogawa.

### Dark theme

`data-theme="dark"` pada elemen `<html>` mengubah token berikut. Nilai lain tetap diwarisi dari palet dasar.

| Token | Nilai dark |
| --- | --- |
| `--color-background` | `oklch(15.5% 0 0)` |
| `--color-foreground` | `oklch(97% 0 0)` |
| `--color-surface` | `oklch(18% 0 0)` |
| `--color-surface-2` | `oklch(21% 0 0)` |
| `--color-surface-3` | `oklch(23% 0 0)` |
| `--color-border` | `oklch(25% 0 0)` |
| `--color-border-strong` | `oklch(32% 0 0)` |
| `--color-muted-foreground` | `oklch(72% 0 0)` |
| `--color-neutral` | `oklch(27% 0 0)` |
| `--color-neutral-foreground` | `oklch(97% 0 0)` |
| `--color-accent` | `oklch(26% 0 0)` |
| `--color-accent-foreground` | `oklch(97% 0 0)` |
| `--color-primary-emphasis` | `oklch(62.5% .1844 257.69)` |
| `--color-success-emphasis` | `oklch(59.4% .1853 149.54)` |
| `--color-warning-emphasis` | `oklch(66.3% .1645 70.61)` |
| `--color-danger-emphasis` | `oklch(64.1% .2229 26.82)` |
| `--color-info-emphasis` | `oklch(60.9% .148143 238.104)` |

Ada dua deklarasi background dark: theme framework memakai `oklch(15.5% 0 0)`, sedangkan sumber Meridian `app.css` menetapkan `oklch(0.08 0 0)` dalam variant dark. Keduanya ada di stylesheet; periksa cascade dan computed style saat mengubah tema. Jangan menyamakan token theme dasar dengan hasil akhir semua scope.

`theme.js` menyimpan pilihan pada `localStorage` dengan key `stisla-theme`. Guard inline dalam `<head>` menerapkannya sebelum first paint. Event `stisla:themechange` dipakai chart untuk memperbarui tampilannya.

## 3. Typography

### Font dan skala

- Font UI: **Inter**, dimuat melalui Google Fonts dengan weight 400, 500, 600, 700 pada halaman template.
- Stack fallback: system UI, Segoe UI, Roboto, Helvetica Neue, Noto Sans, Liberation Sans, Arial, sans-serif, dan font emoji sistem.
- Token mono: **JetBrains Mono** dengan fallback monospace. Deklarasi token tidak berarti font eksternal tersebut sudah dimuat.
- Satuan ukuran adalah `rem`; padanan piksel di bawah mengasumsikan ukuran root browser 16px.

| Token | rem | Padanan px | Peran / contoh |
| --- | --- | --- | --- |
| `--text-xs` | 0.75 | 12 | Metadata sel, caption, teks pendukung |
| `--text-sm` | 0.875 | 14 | Input desktop, label, tombol |
| `--text-base` | 1 | 16 | Teks dasar dan input pada aturan mobile |
| `--text-lg` | 1.125 | 18 | Pengantar auth |
| `--text-xl` | 1.25 | 20 | Heading / penekanan dalam konten |
| `--text-2xl` | 1.5 | 24 | Judul halaman mobile dan auth |
| `--text-3xl` | 1.875 | 30 | Judul halaman mulai `md` |
| `--text-5xl` | 3 | 48 | Nilai statistik dan pitch auth |

Weight token: light 300, normal 400, medium 500, semibold 600, bold 700. `leading-tight` = 1.25, `leading-snug` = 1.375, `leading-normal` = 1.5. Line-height token ukuran xs/sm/lg/xl/2xl juga tersedia; gunakan kelas peran asli saat menyalin komponen.

### Hierarki yang digunakan

| Peran | Implementasi bawaan |
| --- | --- |
| Judul halaman | `.page__title`; di dalam `.content`: 24px, menjadi 30px pada `md`, weight 300 |
| Deskripsi halaman | `.page__description` |
| Judul card | `.card__title` di dalam `.card__header` |
| Nama entitas tabel | Link `.font-medium` dalam `<th scope="row">` |
| Metadata tabel | Blok `.text-xs.text-muted-foreground` di bawah nama |
| Label field | `.field__label`, ukuran sm dan weight medium |
| Eyebrow | `.text-eyebrow`: 0.625rem, weight 500, uppercase, tracking 0.1em |
| Nilai statistik | `.stat__value`: 3rem, weight 300, line-height 1, tracking -0.02em |
| Detail statistik | `.stat-detail__value`: 1.75rem, weight 300, line-height 1 |
| Pitch auth | `.auth__pitch-title`: 3rem, weight 300, line-height 1.05 |

**Catatan implementasi:** beberapa elemen memakai weight 300 sementara URL Google Fonts memuat 400–700. Ini kondisi bawaan, bukan bukti face 300 tersedia. Jika kelak memperbaiki rendering, muat face yang sesuai atau ubah weight secara eksplisit setelah persetujuan perubahan desain. Eyebrow 10px juga merupakan ukuran bawaan, bukan rekomendasi untuk semua teks kecil.

Pisahkan nama dan metadata memakai blok, jangan mengandalkan `<small>` inline untuk membuat baris baru. Angka dan aksi rata akhir mengikuti tabel bawaan. `tabular-nums` dapat dipakai untuk angka dinamis setelah memastikan utilitas tersebut terkompilasi; jangan mengklaim semua angka template sudah memakainya.

## 4. Spacing, ukuran, radius, dan elevation

Unit spacing dasar: `--spacing: 0.25rem`. Fungsi sumber `--spacing(n)` menghasilkan `n × 0.25rem` saat dikompilasi.

| Langkah | rem | px |
| --- | --- | --- |
| 0.5 | 0.125 | 2 |
| 1 | 0.25 | 4 |
| 1.5 | 0.375 | 6 |
| 2 | 0.5 | 8 |
| 2.5 | 0.625 | 10 |
| 3 | 0.75 | 12 |
| 4 | 1 | 16 |
| 5 | 1.25 | 20 |
| 6 | 1.5 | 24 |
| 7 | 1.75 | 28 |
| 8 | 2 | 32 |
| 10 | 2.5 | 40 |
| 14 | 3.5 | 56 |
| 15 | 3.75 | 60 |
| 20 | 5 | 80 |

### Ukuran komposisi

| Area | Ukuran / aturan |
| --- | --- |
| Gap shell | 8px (`--spacing(2)`) |
| Padding content mobile | Inline 16px, block 24px |
| Padding content mulai md | Inline dan block 32px |
| Gap section | `--page-section-gap`, fallback 24px |
| Container lebar | Maksimal 87rem pada viewport ≥1800px atau shell collapsed |
| Navbar | 56px; 80px mulai lg; sticky, z-index 999 |
| Sidebar | Default framework 16rem; `.sidebar--lg` mengatur tombol 40px |
| Header card | Minimum 60px, padding inline default 20px |
| Body card | Padding default 20px, gap 8px |
| Sel tabel | Padding block/inline default 12px |
| Field | Gap label/kontrol default 6px |
| Input / tombol default | Tinggi 36px |
| Tombol sm / lg | 28px / 44px |
| Search shell | Tinggi 44px, lebar maksimum 14rem, menjadi 22rem pada xl |
| Form auth | Lebar maksimum 24rem, gap 24px |
| Sticky bar | Padding block 0.875rem, inline mengikuti content |

Radius dasar `--radius: 1rem`; xs = ×0.4, sm = ×0.65, md = ×0.75, lg = ×1, 2xl = ×2. Dengan root 16px: 6.4 / 10.4 / 12 / 16 / 32px. Badge dan search tertentu memakai radius pill 9999px.

Shadow tersedia: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`. Card framework default memakai shadow-md, tetapi `.content` menetapkan `--card-shadow: none`. Content surface memiliki shadow primary beropasitas rendah; sidebar aktif memakai shadow-sm; menu menggunakan shadow-xl. Pertahankan scope ini agar semua card tidak tiba-tiba tampak mengambang.

## 5. Tokenization dan aturan CSS

Alur token: **primitive → semantic → component → composition**.

```text
--spacing / --text-sm / --radius / --shadow-md
  → --color-primary / --color-surface / --color-border
  → --button-height / --card-padding-inline / --table-cell-padding-block
  → .content / .sidebar--app / .auth / .sticky-bar
```

| Kelompok | Contoh token komponen |
| --- | --- |
| Page | `--page-padding-inline`, `--page-padding-block`, `--page-section-gap`, `--page-title-font-size` |
| Button | `--button-height`, `--button-padding-inline`, `--button-font-size`, `--button-radius`, `--button-tone` |
| Card | `--card-padding-inline`, `--card-padding-block`, `--card-header-height`, `--card-radius`, `--card-shadow` |
| Table | `--table-cell-padding-block`, `--table-cell-padding-inline`, `--table-border-color`, `--table-bg-state` |
| Input | `--input-height`, `--input-font-size`, `--input-border-color`, `--input-radius` |
| Sidebar | `--sidebar-width`, `--sidebar-bg`, `--sidebar-padding-block`, `--sidebar-button-bg-active` |
| Badge | `--badge-min-height`, `--badge-font-size`, `--badge-radius` |
| Chart | `--chart-height`, `--chart-min-width` |

Gunakan modifier dan utilitas yang tersedia sebelum membuat token baru. Jangan menulis ulang `.card`, `.table`, `.button`, atau layout shell secara global untuk satu halaman. `style.css` merupakan output; perubahan yang perlu dipelihara harus masuk ke `app.css` atau partial relevan lalu dikompilasi ulang.

`@source "../../*.html"` hanya memindai HTML di folder admin. Jika view dipindah ke template backend atau kelas dibuat lewat JavaScript, perbarui sumber pemindaian. Menulis nama kelas baru tidak menjamin kelas tersebut sudah ada dalam CSS yang dikirim.

## 6. Component

### Inventaris utama

| Komponen | Struktur / modifier | Referensi |
| --- | --- | --- |
| Sidebar | `.sidebar.sidebar--lg.sidebar--app`, `__header`, `__brand`, `__content`, `__menu`, `__group`, `__list`, `__item`, `__button` | `blank.html` |
| Navbar | `.navbar` di dalam `.app-shell__main`; menu akun dan notifikasi | `blank.html` |
| Page | `.page.content > .content__container`; `__header`, `__headline`, `__title`, `__description`, `__action`, `__body`, `__section` | `blank.html` |
| Card | `.card > .card__header + .card__body + .card__footer` sesuai kebutuhan | `product-new.html`, `customers.html` |
| Button | `.button`; primary, neutral, danger; outline, ghost, soft; sm, lg, block, icon-only | Seluruh halaman |
| Badge | `.badge`, `--soft`, primary/success/warning/danger/info | Tabel dan dashboard |
| Field | `.field > label.field__label + .input/.select/.textarea + .field__description` | `product-new.html` |
| Input group | `.input-group`, `__text`, child `.input`; modifier lg/search | Login dan form |
| Checkbox / switch | `.checkbox`, `.switch`, `.switch--lg` | Customers, Settings |
| Toggle group | `.toggle-group > .toggle`; aria state dan `data-state` | Customers, Reports |
| Table | `.table-responsive > .table.table--hover.table--align-middle` | `customers.html` |
| Pagination | `.pagination`, `.pagination__button` | Daftar |
| Dialog | `.dialog.dialog--sm`, `__content`, `__header`, `__body`, `__footer` | Customers, Settings |
| Popover / menu | `.popover`, `.popover--menu`, `.menu`; trigger dan target via data attribute | Navbar |
| Avatar | `.avatar`, `--sm`, `--xl`, `--circle`; `__image`, `__fallback` | Customers, Profile |
| Empty state | `.empty-state`, `__media`, `__title`, `__text`; primary/warning/danger | Blank dan error |
| List dan timeline | `.list-group`, `.timeline`, `.media`, `.media-list` | Profile, detail order, dashboard |
| Tabs | `.tabs` dan hook framework | Settings |
| Statistik | `.card--stat`, `.stat`, `.stat-detail`, `.meter--stat`, `.sparkline` | Dashboard |
| Sticky actions | `.sticky-bar`, `.me-auto` untuk memisah ringkasan dan aksi | Form produk/order |

### Struktur tabel acuan: Customers

```html
<div class="card" data-table-select>
  <div class="card__header flex-wrap">
    <!-- Filter dan pencarian; pertahankan struktur input-group template. -->
  </div>
  <div class="card__header card__header--alt flex-wrap" data-bulkbar hidden>
    <span><strong data-select-count>0</strong> dipilih</span>
  </div>
  <div class="table-responsive">
    <table class="table table--hover table--align-middle">
      <thead class="table__head--alt">
        <tr>
          <th scope="col">Nama</th>
          <th scope="col" class="text-end">Jumlah</th>
          <th scope="col">Status</th>
          <th scope="col" class="text-end"><span class="sr-only">Aksi</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">
            <div>
              <a href="detail.html" class="font-medium">Nama entitas</a>
              <div class="text-xs text-muted-foreground">Informasi pendukung</div>
            </div>
          </th>
          <td class="text-end">12</td>
          <td><span class="badge badge--soft badge--success">Aktif</span></td>
          <td class="text-end"><div class="flex justify-end gap-1"><!-- Aksi --></div></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="card__footer"><!-- Ringkasan hasil dan pagination --></div>
</div>
```

Contoh di atas adalah pola minimal, bukan salinan lengkap Customers. Tambahkan checkbox hanya bila seleksi/bulk action dibutuhkan. Jangan menambahkan avatar jika data tidak membutuhkannya. Hindari tautan sortir palsu: sorting, search, filter, dan pagination template berupa URL/form yang harus ditangani backend.

Seleksi memakai `[data-select-all]`, `[data-select-row]`, `[data-bulkbar]`, `[data-select-count]`. Skrip menandai baris terpilih dengan `tr[data-state="active"]` dan mengatur state indeterminate. Penghitung dipilih ditulis secara document-wide; jika kelak ada beberapa tabel independen, periksa kembali scope penghitung.

### Form, state, dan dialog

Salin `.field` asli, bukan kelas baru seperti `.form-field`. Kaitkan label dengan ID input. Gunakan `.textarea` pada textarea. Pesan bantuan mengikuti `.field__description`; error dan validasi harus dihubungkan dengan `aria-describedby`/`aria-invalid` saat implementasi membutuhkan validasi nyata.

Dialog template memakai struktur/hook Stisla, bukan sekadar native `<dialog class="dialog">`. Gunakan `data-stisla-dialog-trigger="targetId"` dan `data-stisla-dialog-dismiss` seperti contoh lengkap di Customers. `data-fill-name` mengisi `[data-slot="name"]`; ini hanya mengubah teks konfirmasi, bukan menghapus record.

State yang perlu dipertahankan: hover, focus-visible, disabled, active/current, checked/indeterminate, menu terbuka, dialog terbuka, dan error. Template bukan implementasi backend; sukses/error/loading/empty yang belum dicontohkan perlu dirancang dengan komponen yang sama saat fitur nyata dibuat.

## 7. Iconography

### Sistem ikon yang sedang digunakan

Template admin memakai **Solar Icon Set oleh 480 Design**, berlisensi **CC BY 4.0**, dengan atribusi di `admin/NOTICE`. Ini berbeda dari aturan Iconsax pada implementasi publik proyek. Untuk mereproduksi template admin saat ini, pertahankan Solar; migrasi ke Iconsax harus diperlakukan sebagai perubahan tersendiri.

- SVG disematkan **inline** langsung dalam HTML. Tidak ada icon font, runtime icon loader, atau CDN khusus ikon.
- Kanvas ikon umumnya `viewBox="0 0 24 24"`; ukuran markup mengikuti `width="1em" height="1em"` agar diwarisi dari komponen.
- Ikon outline yang tersedia umumnya memakai `fill="none"`, `stroke="currentColor"`, dan `stroke-width="1.5"`. Ikon filled memakai `fill="currentColor"`; beberapa memakai opacity untuk lapisan visual.
- Template mencampur outline, filled, dan bentuk dengan lapisan opacity sesuai contoh komponen. Jangan menyebut seluruh set sebagai satu varian outline atau mengganti varian secara massal.
- Gunakan SVG dari contoh terdekat: navbar dengan navbar, aksi tabel dengan aksi tabel, stat dengan stat. Pertahankan bentuk, stroke, viewBox, serta modifier container aslinya.
- Hindari emoji, simbol Unicode, atau ikon dari keluarga lain sebagai pengganti ikon UI.

### Ukuran, warna, dan penempatan

| Konteks | Aturan |
| --- | --- |
| Tombol berteks | SVG `1em` dan gap dari `.button` |
| Tombol ikon tunggal | `.button--icon-only`, ukuran sm/default sesuai referensi |
| Aksi tabel | `.button--ghost.button--neutral.button--icon-only.button--sm`; danger untuk hapus |
| Stat / empty state | `.icon-box`, modifier ukuran/warna/bentuk sesuai contoh |
| Badge / label | Warna diwarisi melalui `currentColor` |
| Sidebar / navbar | Ikon merupakan sibling label; gunakan slot dan ukuran bawaan komponen |
| Theme toggle | SVG sun/moon disediakan `theme.js`, mengikuti tema |

Jangan hard-code warna SVG untuk meniru primary; gunakan `currentColor` agar hover, disabled, dan dark theme tetap mengikuti komponen. Jangan meratakan semua container menjadi ukuran ikon yang sama karena tombol, empty state, dan statistik punya peran berbeda.

Ikon dekoratif memakai `aria-hidden="true"`. Tombol ikon wajib memiliki nama aksi melalui `aria-label`, termasuk konteks record bila perlu. SVG tidak menggantikan label aksesibel tombol. Pertahankan `NOTICE` ketika menyalin atau mendistribusikan template. Sumber ikon yang dicatat template: https://icon-sets.iconify.design/solar/.

## 8. Template dan peta halaman

| File dalam admin | Pola / bagian yang dapat digunakan ulang |
| --- | --- |
| `index.html` | Dashboard: stat cards, sparkline, chart, heatmap, tabel, timeline |
| `orders.html` | Daftar transaksi: filter status, pencarian, seleksi, pagination, dialog |
| `products.html` | Daftar dengan thumbnail, harga, status, dan aksi |
| `customers.html` | **Acuan utama tabel**: hierarki nama/metadata, avatar opsional, numerik rata akhir, aksi ikon |
| `order-new.html` | Form multi-section, editor baris dinamis, totals, sticky action bar |
| `product-new.html` | **Acuan utama form konten**: detail, media, pricing, publikasi, sticky actions |
| `order-detail.html` | Halaman detail: breadcrumb, ringkasan, tabel item, timeline |
| `reports.html` | Filter periode dan komposisi chart analitik |
| `profile.html` | Cover, profil/avatar, informasi dan aktivitas |
| `settings.html` | Navigasi settings, tabs, field, switch, dialog destruktif |
| `blank.html` | **Acuan shell dan halaman baru** dengan empty state |
| `login.html` | Auth dua panel: form dan pitch visual desktop |
| `register.html` | Variasi auth untuk pendaftaran |
| `forgot.html` | Variasi auth untuk reset password |
| `403.html` | Error akses ditolak, empty-state warning |
| `404.html` | Error halaman tidak ditemukan, empty-state primary |
| `500.html` | Error server, empty-state danger |

Ketersediaan halaman contoh tidak berarti modul tersebut masuk scope produk Yokogawa. Gunakan PRD untuk menentukan modul; gunakan template untuk menentukan pola visual.

### Struktur halaman aplikasi

```html
<div class="app-shell" data-stisla-app-shell data-stisla-app-shell-auto-collapse="true">
  <aside class="sidebar sidebar--lg sidebar--app" data-stisla-sidebar>
    <!-- Salin struktur sidebar dari blank.html. -->
  </aside>
  <main class="app-shell__main">
    <header class="navbar"><!-- Navbar bawaan --></header>
    <div class="page content">
      <div class="content__container">
        <header class="page__header">
          <div class="page__headline">
            <h1 class="page__title">Judul halaman</h1>
            <p class="page__description">Deskripsi halaman.</p>
          </div>
          <div class="page__action"><!-- Aksi utama --></div>
        </header>
        <div class="page__body">
          <section class="page__section"><!-- Card / form / tabel --></section>
        </div>
      </div>
    </div>
  </main>
</div>
```

Pertahankan posisi header, body, card, footer, dan sticky bar sesuai halaman rujukan. Jangan mengganti shell dengan layout grid baru atau merender semua wrapper sebagai kelas custom yang tidak dikenal CSS asli.

## 9. Responsive, motion, dan perilaku

- `md`: 48rem (768px pada root 16px); padding content dan beberapa chart berubah.
- `lg`: 64rem (1024px); sidebar menjadi sticky desktop, auth aside muncul, navbar 80px.
- `xl`: 80rem (1280px); batas akhir auto-collapse rail dan search shell melebar.
- Di bawah lg, sidebar merupakan drawer fixed, z-index 1001; shell memakai backdrop. Tombol dan Escape menutup drawer.
- Auto-collapse aktif pada band 64–79.99rem bila `data-stisla-app-shell-auto-collapse="true"`; mulai xl panel diperluas.
- State desktop: `.is-sidebar-collapsed` pada shell dan `[data-collapsed]` pada sidebar. State mobile: `.is-sidebar-visible`.
- Chart tertentu memerlukan horizontal scroll internal, misalnya sales dengan min-width 520px; pertahankan `.chart-scroll`.
- Durasi token: `--transition-duration-fast: .12s`, normal `.2s`; sidebar memiliki fallback `.3s`.
- Stylesheet framework menyertakan aturan reduced-motion, tetapi jangan menganggap seluruh chart dan transisi Meridian otomatis lolos pemeriksaan motion. Untuk perubahan motion proyek, baca `motion.md` dan verifikasi computed behavior.

## 10. JavaScript, dependensi, dan integrasi

| File / dependensi | Tanggung jawab |
| --- | --- |
| `app-shell.js` | Toggle desktop rail/mobile drawer, breakpoint, aria-expanded |
| `theme.js` | Pilihan light/dark, localStorage, ikon tema, event themechange |
| `charts.js` | Mount ApexCharts, baca CSS token, update/rebuild saat tema berubah |
| `order-form.js` | Tambah/hapus baris, subtotal, pajak contoh 10%, shipping, grand total; submit demo dicegah |
| `table-select.js` | Seleksi baris, bulk bar, jumlah terpilih, pengisian teks dialog |
| `@stisla/vanilla@3` | Behavior komponen framework, dimuat sebagai module CDN |
| `apexcharts@3` | Chart, dimuat sebelum charts.js |
| Google Fonts | Inter; membutuhkan koneksi jaringan |

Skrip lokal tidak memakai bundler. Shell coordinator memakai deklarasi global; pertahankan pemuatan satu kali. Jangan menganggap seluruh file otomatis aman dipasang berulang setelah partial replacement tanpa mekanisme lifecycle.

Tabel merupakan HTML biasa yang siap di-loop backend, bukan DataTables atau grid runtime. Parameter `q`, `status`, `sort`, dan `page` adalah pola integrasi server. Data statis, tautan aksi, form auth, dan tombol delete perlu dihubungkan ke backend; tampilan contoh bukan bukti autentikasi, upload, validasi MIME, atau penyimpanan tersedia.

## 11. Build, path, dan implementasi berikutnya

```bash
cd admin
npm install
npm run build:css
```

Perintah build yang tersedia: `tailwindcss -i assets/css/app.css -o assets/css/style.css --minify`. README template menyebut `pnpm build` untuk proses penerbitan ZIP di upstream, tetapi script tersebut **tidak tersedia** dalam `admin/package.json` yang disertakan.

Preview dari root proyek: `python3 -m http.server 8000`, lalu buka `/admin/`. Template saat ini memiliki banyak tautan absolut `/meridian/`; tautan tersebut belum disesuaikan dengan lokasi `/admin/`. Ini harus dikerjakan secara eksplisit saat implementasi routing, termasuk nav, auth, error, dan tautan baris tabel.

Simpan struktur situs publik di root dan admin di folder admin. Jangan mengimpor `styles.css` publik ke admin atau menyalin tema publik secara otomatis. Bila backend menggunakan partial bersama, ekstrak shell dari markup asli tanpa mengubah kelas dan struktur DOM-nya.

### Checklist sebelum menyerahkan implementasi

1. Pilih halaman template terdekat; Customers untuk tabel, Product New untuk form, Blank untuk shell.
2. Pastikan kelas, token, wrapper, hook, dan urutan dependensi mengikuti sumber.
3. Periksa light/dark, tabel overflow, konten panjang, nilai kosong, dan ukuran mobile/desktop.
4. Periksa keyboard, focus-visible, label kontrol, nama tombol ikon, dialog, dan sidebar.
5. Uji filter, pagination, upload, dan mutasi melalui backend bila sudah dihubungkan; jangan mengklaim demo sebagai fitur aktif.
6. Jika CSS sumber berubah, rebuild dan periksa hasil; hindari modifikasi manual pada output saja.
7. Pertahankan lisensi Solar dan catat perubahan tema atau pola komponen di dokumen ini.

## 12. Batas verifikasi dokumentasi

Seluruh file template ditelusuri secara statis. Nilai token bersumber dari stylesheet lokal; struktur komponen dari HTML; perilaku yang dijelaskan dari skrip lokal dan penggunaan hook. Paket framework/CDN tidak diunduh ulang.

**Belum diverifikasi dalam pekerjaan dokumentasi ini:** computed style browser, kontras terukur, responsivitas aktual, keyboard/focus trap framework, muatan font 300, perilaku CDN terkini, dan deployment. Bagian catatan implementasi adalah panduan untuk pemeriksaan berikutnya, bukan hasil pengujian runtime.

## 13. Implementasi halaman Yokogawa

Halaman aktif sekarang dibentuk dengan `admin/build-pages.py` menggunakan
`admin/templates/shell.html` dan `admin/templates/login.html` sebagai sumber
layout asli. Fungsi shared card, field, tabel, dialog, dan shell dipakai untuk
ketujuh halaman. CSS dan warna bawaan tetap dipertahankan; Inter weight 300
ikut dimuat pada halaman aplikasi agar judul ringan memakai face yang sesuai.

Navigasi aktif: Course, Kategori Course, Home Banner. Menu akun: Ganti Password
dan Keluar. Ikon navigasi Solar: `book-2-bold-duotone` untuk Course, grid bawaan
Dashboard untuk Kategori, dan `gallery-bold-duotone` untuk Home Banner.
Ikon SVG tambahan disimpan sebagai partial inline di `admin/templates/` dengan
atribusi pada `admin/NOTICE`.

Halaman aktif memakai path `/admin/` atau tautan relatif; halaman template
referensi lain masih menyimpan path upstream `/meridian/`. Interaksi demo
tersimpan pada `sessionStorage` melalui `admin-demo.js`; backend belum terhubung.

## 14. Bahasa dan copy antarmuka admin

Sesuai permintaan terbaru, tujuh halaman admin aktif menggunakan bahasa Inggris
(`lang="en"`). Ini berlaku untuk navigasi, judul, label, helper text, accessible
names, validasi, pagination, empty state, konfirmasi, dan pesan hasil. Konten
course tetap berasal dari data website; bahasa halaman publik tidak berubah.

Gunakan sentence case dan kosakata berikut secara konsisten:

| Konteks | Copy |
| --- | --- |
| Navigasi | Courses, Course categories, Home banner |
| Tambah/edit | Add course, Edit course, Add category, Edit category |
| Simpan | Save course, Save category, Save banner |
| Akun | Sign in, Change password, Sign out |
| Status | Draft, Published, Unpublished |
| Pencarian/filter | Search courses, Search categories, Clear filters |
| Pagination | Previous, Next, Showing 1–10 of 44 courses |
| Destruktif | Delete “{name}”?, Delete course / Delete category, Cancel |

Error menjelaskan cara memperbaiki, bukan hanya menyatakan input salah. Helper
text menampilkan aturan sebelum submit. Konfirmasi hapus menyebut nama item dan
konsekuensinya. Pesan preview harus menyatakan perubahan hanya berlaku pada
sesi browser dan tidak mengklaim akun atau website live sudah berubah.
Gunakan `Intl.NumberFormat`, `Intl.PluralRules`, dan `Intl.ListFormat` untuk angka,
jumlah, dan daftar dinamis. Nama serta deskripsi course dari sumber bukan copy
UI dan tidak diterjemahkan ulang secara otomatis.

## Availability calendar

`availability.html` uses the original Meridian shell, card, field and button
classes. FullCalendar is loaded from the existing local vendor bundle; the
calendar adapter `assets/css/meridian/availability.css` uses only admin semantic
tokens and does not import the public stylesheet. The Add availability button
or selecting a calendar date opens the inline date-range form. Calendar navigation
and the date list stay synchronized. The list follows the full visible calendar
grid, including available dates from adjacent months, and shows the matching
date range. Changing the month in either view updates both views. Sidebar calendar artwork inherits
currentColor. Availability remains a browser-local preview via localStorage.


## Sidebar admin bersama

Halaman admin aktif memakai `admin/assets/js/sidebar.js` sebagai sumber tunggal markup sidebar. Urutan menu: Courses, Course categories, Home banner, Availability. Status aktif ditentukan dari `data-admin-page`; halaman akun tidak memilih menu konten. Skrip dimuat sebelum `app-shell.js` agar perilaku collapse dan drawer tetap bekerja. Generator `admin/build-pages.py` menghasilkan referensi komponen yang sama.

### Ikon dan urutan popular — 3 November 2026

Category icon dan Course icon menerima SVG/PNG maksimal 2 MB dan terpisah dari
Thumbnail foto. Preview memakai `<img>`, nama file, dan Remove icon; tanpa unggahan
gunakan ikon aset bawaan. Course count hanya-baca dan menghitung semua course
dalam kategori, termasuk Draft.

Courses memakai tab All courses dan Popular courses. Pengurutan popular memakai
`.table.table--hover.table--align-middle` dengan header `.table__head--alt` dalam
`.table-responsive`, bukan daftar kartu. Kolom: handle, Position, Course, Category,
Status, Homepage visibility. Handle minimal 44 × 44 px mendukung pointer dan
Arrow Up/Down; Escape membatalkan drag. Penanda garis menunjukkan posisi drop.
Reorder langsung disimpan dalam sessionStorage; hanya keberhasilan menampilkan
`.toast.toast--success` pada `.toast-region--bottom-end`, tanpa pesan drag/sukses
di atas konten. Tidak ada animasi tambahan pada pemindahan baris.

Jumlah ideal popular minimal 4 dan kelipatan 2 merupakan rekomendasi, bukan
validasi yang memblokir. Hitung course Published dalam kategori Published;
course lain tetap terlihat dengan alasan belum tampil di Home. Statistik hero
tetap statis; tidak ada field Source URL atau poster baru.

Ringkasan jumlah dan petunjuk pengurutan berada dalam `.alert.alert--info` memakai
`.alert__title` dan `.alert__description`, dengan ikon info. Copy ringkas: minimal 4
course dalam kelipatan 2,
drag/Arrow Up–Down, dan penyimpanan otomatis. Petunjuk Escape serta keyboard
lengkap tersedia melalui deskripsi aksesibel handle.
