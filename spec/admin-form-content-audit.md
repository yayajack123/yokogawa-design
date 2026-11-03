# Audit cakupan form admin terhadap konten website

Tanggal: 3 November 2026  
Objek: prototype HTML di workspace Yokogawa Industrial Training.

## Status setelah revisi prototype

Keputusan pengguna telah diterapkan pada form dan interaksi admin berikut.
Bagian audit awal di bawah dipertahankan sebagai catatan sebelum revisi;
keputusan pada tabel ini menggantikan rekomendasi awal yang berbeda.

| Area | Hasil revisi |
| --- | --- |
| Ikon kategori dan course | Input SVG/PNG opsional maksimal 2 MB, preview gambar, nama file, ganti/hapus, dan fallback ikon bawaan. Course icon terpisah dari Thumbnail. |
| Statistik hero | Tetap statis; tidak menambahkan field statistik. |
| View source | Diabaikan sebagai referensi sumber materi; tidak menambahkan Source URL. |
| Course count | Label diperjelas; hitungan otomatis seluruh course per kategori, termasuk Draft. Kategori baru bernilai 0. |
| Popular courses | Tab baru pada Courses, memakai tabel bawaan Stisla/Meridian dengan handle drag & drop dan alternatif Arrow Up/Down. |
| Urutan popular | Daftar ID tersimpan dalam sesi preview; pilihan baru masuk terakhir, penghapusan merapatkan posisi. Urutan awal VPEG, PMCE-ONL, SPRS, VPMN. |
| Jumlah popular | Minimal 4 dan kelipatan 2 merupakan rekomendasi, bukan pembatas penyimpanan. Hitung course Published dalam kategori Published. |
| Informasi pengaturan | Ringkas dalam komponen `alert--info`: jumlah siap tampil, rekomendasi 4/6/8…, dan petunjuk handle. |
| Umpan balik reorder | Hanya keberhasilan menampilkan toast sukses bawaan; tidak ada pesan mulai/batal drag di area konten. |
| Cakupan | Tidak menambahkan sinkronisasi website, backend, poster video, modul FAQ/kontak, atau field label pendek kategori. |

Verifikasi revisi: pemeriksaan browser atas drag pada desktop dan viewport mobile
390 px, keyboard, reload urutan, pilihan popular berjumlah 0–6, kondisi course
Draft, Course count kategori kosong dan kategori dengan Draft, unggahan SVG/PNG,
file salah format/rusak/melebihi ukuran, ganti/hapus serta muat ulang ikon.
Sentuhan pada perangkat fisik belum diuji. Tidak ada error/warning console pada
alur yang diperiksa; kontrol toast dan alert diperiksa pada verifikasi akhir.

## Kesimpulan audit awal — sebelum revisi

**Form admin sudah mengakomodasi data utama course, tetapi belum seluruh atribut konten yang tampil di website.** Form Course paling lengkap; Category masih belum mewakili ikon dan variasi nama tampilan. Home Banner sudah mencakup media, judul, deskripsi, serta dua tombol, tetapi belum statistik hero dan pilihan poster video.

Audit ini menilai **kelengkapan field dan aturan desain**, sesuai klarifikasi pengguna. Sinkronisasi admin–website, backend, penyimpanan, autentikasi, dan kemampuan upload nyata tidak dinilai sebagai kekurangan prototype.

Tidak semua konten website harus memiliki form. PRD secara eksplisit menetapkan FAQ dan informasi kontak sebagai konten statis. Bagian tersebut dipisahkan dari kekurangan form dalam cakupan pengelolaan saat ini.

## Dasar dan batas pemeriksaan

- Membandingkan konten publik pada `index.html`, `courses.html`, `course-detail.js`, `schedule.html`, `faq.html`, `contact-us.html`, serta komponen bersama di `components.js`.
- Menginventarisasi kontrol pada halaman admin aktif: daftar Course, Course Form, Category Form, Home Banner, dan Availability; membaca data contoh dan panduan desain admin.
- Memeriksa `course-data.json`: 44 record, 7 kategori, 43 record dengan informasi course dan PDF, serta 137 bagian hari silabus.
- Membuka preview lokal melalui `python3 -m http.server 8015` karena port 8000 dan 8001 sudah digunakan. Form edit VPOP, form edit kategori, banner, daftar Course, modal Add availability, dan detail publik VPOP diperiksa melalui browser.
- Tidak menyimpan atau menghapus record. Pemeriksaan ini bukan pengujian CRUD, upload, aksesibilitas menyeluruh, atau perbandingan visual langsung dengan file Figma. Kesimpulan berlaku untuk desain yang sudah direalisasikan pada prototype HTML lokal.
- PRD dipakai untuk membedakan cakupan, dengan catatan prototype telah berkembang: Availability sudah ada meskipun kalender admin tercantum di luar cakupan pada PRD awal. Arahan pengguna terbaru tetap menjadi acuan.

## 1. Pemetaan field yang sudah tersedia

“Terakomodasi” berarti ada kontrol admin atau aturan otomatis yang cukup untuk mewakili konten tersebut; bukan pernyataan bahwa data sudah tersinkron.

| Konten yang ditampilkan | Lokasi website | Kontrol/aturan admin | Penilaian |
| --- | --- | --- | --- |
| Nama course | Katalog, popular courses, detail, breadcrumb | Course name | Terakomodasi |
| Kode course | Detail dan identitas course | Course code | Terakomodasi |
| Deskripsi singkat | Kartu katalog dan pengantar detail | Short description | Terakomodasi |
| Kategori course | Pengelompokan katalog, sidebar detail, popular courses | Category | Terakomodasi untuk relasi; variasi label dibahas di temuan |
| Objective | Detail course | Course objectives | Terakomodasi |
| Duration | Detail dan popular courses | Duration | Terakomodasi |
| Participants | Detail course | Participants | Terakomodasi |
| Prerequisite | Detail course | Prerequisites | Terakomodasi |
| Maximum class size | Detail course | Maximum class size | Terakomodasi |
| Course fee | Detail dan popular courses | Course fee | Terakomodasi |
| Topik per hari | Course Content pada detail | Add day, Topics per baris, Remove day | Terakomodasi |
| Nomor hari silabus | Day 1, Day 2, dan seterusnya | Penomoran otomatis | Terakomodasi; tidak perlu input judul hari untuk tampilan saat ini |
| Dokumen PDF | View in PDF pada detail | Training schedule PDF | Terakomodasi melalui unggah dokumen |
| Gambar course | Popular courses di Home | Thumbnail | Terakomodasi |
| Pemilihan course populer | Popular courses di Home | Tombol bintang pada daftar Course | Terakomodasi, meskipun bukan di form edit |
| Status course | Aturan publikasi | Draft / Published | Terakomodasi pada desain |
| Slug course | Identitas URL yang direncanakan | Slug otomatis, dapat diedit | Sudah tersedia; URL prototype masih memakai parameter ID |
| Metadata course | Judul dan deskripsi mesin pencari | Meta title, Meta description | Terakomodasi pada form |
| Nama kategori | Home, katalog, sidebar dan footer | Category name | Terakomodasi untuk nama utama |
| Jumlah course per kategori | Kartu kategori Home | Hitungan otomatis, ditampilkan sebagai Short description | Terakomodasi sebagai data turunan; tidak perlu textarea narasi |
| Status kategori | Aturan publikasi kategori | Unpublished / Published | Terakomodasi pada desain |
| Media hero | Home | Banner media: gambar atau MP4 | Terakomodasi untuk media utama |
| Judul dan deskripsi hero | Home | Heading, Description | Terakomodasi |
| Dua tombol hero | Home | Primary/Secondary button label dan URL | Terakomodasi |
| Tanggal tersedia | Schedule | Start date, End date opsional, aksi hapus tanggal | Terakomodasi untuk kalender ketersediaan global |

Catatan: kalender publik saat ini menampilkan tanggal “Available”, bukan sesi course dengan jam, pengajar, lokasi, atau kuota. Ketiadaan field tersebut bukan kekurangan terhadap tampilan website saat ini. PDF course dan Availability juga memiliki fungsi berbeda; tidak perlu digabungkan hanya karena keduanya berkaitan dengan jadwal.

## 2. Kekurangan dan keputusan desain yang diperlukan

Prioritas di bawah adalah prioritas penyempurnaan desain, bukan tingkat kerusakan runtime.

### A. Ikon kategori belum terwakili — prioritas utama

**Bukti:** kartu kategori Home memiliki ikon berbeda, misalnya `category-settings.svg`, `category-cpu-setting.svg`, dan `category-book.svg`. Form Category hanya memiliki Category name, jumlah course otomatis, dan Status.

**Dampak desain:** saat kategori baru dibuat, belum ada cara atau aturan yang menjelaskan ikon apa yang akan tampil. Nama dan status saja belum cukup untuk membentuk kartu kategori lengkap seperti di Home.

**Rekomendasi:** tambahkan pemilih ikon dari kumpulan ikon kategori yang disetujui beserta pratinjaunya. Tetapkan ikon default. Jika pilihan ikon memang dikunci per kategori, dokumentasikan pemetaannya dan batasan penambahan kategori; tidak harus menyediakan upload SVG bebas.

Sumber: [kartu kategori Home](../index.html#categories), [form Category](../admin/category-form.html).

### B. Nama kategori memiliki beberapa bentuk tampilan — perlu aturan atau field tambahan

**Bukti:** kategori `CENTUM VP Courses` tampil sebagai `Centum VP` di navigasi katalog dan `CENTUM VP` pada kartu popular. `Online Courses` tampil sebagai `Online` atau `ONLINE`. Form hanya menyediakan satu Category name.

**Dampak desain:** satu nama belum menjelaskan apakah label pendek harus diturunkan otomatis, dipetakan tetap, atau diisi admin. Mengubah huruf besar saja tidak menjelaskan penghilangan kata “Courses”.

**Rekomendasi:** pilih salah satu aturan: nama sama di semua lokasi, format pendek yang diturunkan dengan aturan terdokumentasi, atau field opsional **Short display name** dengan fallback ke Category name. Field tambahan diperlukan hanya jika variasi label saat ini ingin tetap dapat dikendalikan admin.

Tautan kategori juga memakai anchor seperti `#centum-vp`; identitas anchor sebaiknya dibuat otomatis dan stabil. Tidak harus menjadi input manual.

Sumber: [Home](../index.html), [navigasi katalog](../courses.html), [form Category](../admin/category-form.html).

### C. Statistik pada hero belum diakomodasi Home Banner — keputusan cakupan

**Bukti:** hero menampilkan `20+ Course Catalog`, `7 Training Categories`, dan `20+ Professional Instructors`. Tidak ada kontrol statistik pada form Banner.

**Dampak desain:** form sudah lengkap untuk media, copy utama, dan tombol, tetapi belum mencakup seluruh konten di area hero.

**Rekomendasi:** tentukan apakah statistik tetap statis. Jika termasuk konten yang dikelola, tambahkan bagian **Hero statistics**. Jumlah course dan kategori dapat dihitung otomatis; jumlah instruktur memerlukan nilai tersendiri karena tidak ada modul/data instruktur pada proyek. Bila ingin mempertahankan format `20+`, tetapkan aturan format atau nilai tampilan, bukan menganggapnya otomatis sama dengan jumlah record.

Sumber: [hero Home](../index.html#hero-title), [form Banner](../admin/banner.html).

### D. Poster video belum memiliki field atau aturan — penyempurnaan media

**Bukti:** hero website memakai MP4 dengan atribut `poster` yang menunjuk gambar. Form Banner hanya memiliki satu input Banner media.

**Dampak desain:** media video terwakili, tetapi gambar yang tampil sebelum video tersedia belum memiliki cara pengelolaan yang jelas.

**Rekomendasi:** untuk pilihan MP4, tampilkan field opsional **Video poster**, atau dokumentasikan bahwa poster dibuat otomatis dari video. Tidak perlu menambah field bila proses otomatis menjadi keputusan produk.

Sumber: [media hero Home](../index.html), [form Banner](../admin/banner.html).

### E. Tautan “View source” tidak memiliki input — keputusan provenance

**Bukti:** detail course menampilkan tautan View source dari properti `source`; form Course tidak menyediakan Source URL. PDF sumber ditampilkan sebagai tautan referensi pada form edit, sedangkan PDF baru diakomodasi melalui unggahan.

**Dampak desain:** form belum mewakili satu tautan publik yang terlihat pada detail. Ini berbeda dari kekurangan field PDF, karena input PDF sudah tersedia.

**Rekomendasi:** bila View source akan tetap menjadi konten publik yang dapat diedit, tambahkan **Source URL** opsional. Bila tautan hanya membantu penelusuran materi prototype, tandai sebagai referensi tetap atau hapus dari desain publik final. Tidak wajib menjadikannya field CMS tanpa keputusan tersebut.

Sumber: [renderer detail](../course-detail.js), [form Course](../admin/course-form.html), [data sumber](../course-data.json).

### F. Urutan tampilan belum memiliki aturan editorial — opsional

Home memiliki urutan kategori dan empat kartu popular tertentu; kontrol saat ini memilih popular on/off tanpa mengatur posisi atau batas jumlahnya. Form Category juga tidak menyediakan urutan.

Tidak adanya input urutan bukan otomatis kekurangan. Namun, agar desain dapat diterapkan secara konsisten, tetapkan urutan otomatis/tetap dan perilaku saat popular berjumlah 0, 1, atau lebih dari 4. Tambahkan pengurutan manual hanya jika memang dibutuhkan editor. Hal yang sama berlaku untuk urutan kategori dan course.

Sumber: [daftar Course](../admin/index.html), [pengaturan popular](../admin/assets/js/admin-demo.js), [popular courses Home](../index.html#courses).

## 3. Konten tanpa form yang tidak otomatis menjadi kekurangan

| Konten website | Kondisi saat ini | Penilaian cakupan |
| --- | --- | --- |
| FAQ: 6 pertanyaan di Home, 10 di halaman FAQ | Teks tetap dalam HTML | PRD secara eksplisit mengecualikan pengelolaan FAQ melalui admin |
| Telepon, email, website, alamat, jam kerja, tautan Maps | Konten tetap pada Contact Us dan CTA | PRD menetapkan informasi kontak statis |
| 10 detail lokasi kantor dan penanda peta | Konten tetap pada Home dan Contact Us | Dapat diperlakukan sebagai informasi kontak statis; perlu modul lokasi hanya jika cakupan diperluas |
| About dan Why Join: judul, deskripsi, daftar manfaat, gambar | Konten tetap di Home | Tidak ada kewajiban CMS untuk bagian ini yang ditemukan; tandai sebagai konten statis |
| Judul/deskripsi section, hero Courses/FAQ/Contact/Schedule | Konten tetap per halaman | Tidak harus ada form Page Content dalam cakupan sekarang |
| CTA bersama: judul, deskripsi, latar, watermark | Komponen bersama | Bukan bagian dari form Home Banner; perlu form tersendiri hanya bila ingin dikelola |
| Logo, menu, social links, legal links, deskripsi footer | Komponen bersama | Konten/pengaturan global tetap; modul Site Settings merupakan perluasan cakupan |
| SEO halaman umum dan gambar share | Metadata tetap | Form SEO course sudah ada; pengaturan SEO global/per halaman menjadi tambahan jika diminta |

Sumber cakupan: [PRD, bagian 9 Out of Scope](yokogawa-indonesia-website_prd.md). Halaman contoh orders, products, customers, reports, settings, dan profile tidak dihitung sebagai modul pengelolaan konten Yokogawa karena tidak menjadi navigasi utama admin.

## 4. Catatan konsistensi materi prototype

Bagian ini bukan temuan kegagalan sinkronisasi atau kekurangan field.

- Dataset detail/admin berisi **44 course**, sedangkan katalog publik memuat **42**. Dua record yang tidak ada di katalog adalah `CVPD-4days` dan `RA-CENTUM-VP-OPERATION-CUST202112021%20`.
- Jumlah kategori pada Home mengikuti 42 course katalog: RAPID 5 dan Academic 3. Dataset admin/detail memiliki RAPID 6 dan Academic 4; lima kategori lain jumlahnya sama. Tetapkan daftar course acuan saat menyiapkan materi final. Kontrol jumlah tetap otomatis, bukan input manual.
- Salah satu record RAPID ditandai `unavailable`, tidak memiliki detail, deskripsi, silabus, atau PDF, tetapi status awal admin tetap Published. `unavailable` berarti materi sumber tidak tersedia, bukan pernyataan bahwa tanggal pelatihannya penuh. Tentukan apakah record ini dikeluarkan dari materi final, dilengkapi, atau ditandai Draft; tidak perlu menambahkan field availability course untuk kasus ini.
- Contoh judul/deskripsi/tombol pada Banner berbeda dari copy hero publik. Semua field copy tersebut sudah tersedia, sehingga ini masalah pemilihan materi contoh, bukan kekurangan struktur form.
- Label **Short description** pada Category sebenarnya menampilkan jumlah course yang dihitung otomatis. Lebih jelas bila diganti **Course count** agar reviewer tidak mengira ada deskripsi naratif yang belum dapat diisi.
- Istilah **Favorites only** pada daftar Course merujuk penanda **Popular on homepage**. Gunakan istilah **Popular only** agar arti kontrol konsisten dan tidak terkesan sebagai favorit pribadi admin.

## 5. Usulan revisi desain minimum

1. Lengkapi Category dengan pemilih ikon dan preview; putuskan aturan nama pendek serta anchor kategori.
2. Tetapkan statistik hero sebagai statis atau kelola dalam bagian Hero statistics. Tetapkan cara memilih/membuat poster MP4.
3. Putuskan nasib View source: referensi prototype, tautan tetap, atau Source URL opsional pada Course.
4. Dokumentasikan urutan dan jumlah popular courses; pengurutan manual hanya jika dibutuhkan.
5. Perjelas label Course count dan Popular only, lalu samakan materi contoh yang dipakai untuk review.

Form Course tidak memerlukan penambahan field informasi pelatihan utama. FAQ, Contact, About, CTA, dan footer tidak perlu dibuatkan modul baru untuk memenuhi cakupan admin sekarang. Laporan ini tidak mengubah desain, kode aplikasi, atau data yang sudah ada.
