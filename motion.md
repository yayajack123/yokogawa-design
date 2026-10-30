# Panduan motion — Yokogawa Industrial Training

Dokumen ini mencatat motion yang dipakai `index.html` dan menjadi acuan untuk halaman lain. Angka pada bagian inventaris berasal dari implementasi saat ini, bukan spesifikasi Figma. Ikuti desain dan instruksi pengguna jika keduanya menentukan perilaku yang berbeda. Jangan menambahkan animasi hanya demi menyamakan jumlah efek antarseksi.

## Prinsip penggunaan

- Gunakan motion untuk menjelaskan perubahan state, arah navigasi, atau memberi umpan balik. Konten harus tetap terbaca dan interaksi tidak boleh menunggu animasi dekoratif.
- Utamakan transisi warna untuk kontrol, serta `transform` dan `opacity` untuk pergerakan atau kemunculan. Hindari animasi layout dan paint bila efek serupa dapat dicapai dengan properti tersebut. Accordion saat ini merupakan pengecualian karena menganimasikan tinggi jawaban.
- Gunakan transisi singkat untuk kontrol yang sering digunakan; simpan motion yang lebih lambat untuk gambar dan transisi editorial. Jangan menerapkan reveal, parallax, pulse, atau zoom secara otomatis pada setiap komponen.
- Hormati `prefers-reduced-motion: reduce`: tampilkan konten dan state akhir secara langsung, matikan motion dekoratif, dan pertahankan semua fungsi. Jangan sembunyikan konten ketika JavaScript atau GSAP tidak tersedia.
- Pastikan animasi dapat dibalik atau dihentikan ketika pengguna mengubah pilihan. Hover hanya untuk perangkat dengan hover dan pointer halus; akses keyboard dan focus yang terlihat tetap wajib. Hindari menambahkan gerakan dekoratif baru yang dipicu focus keyboard.

## Inventaris halaman utama

| Konteks | Perilaku dan nilai saat ini | Sumber |
| --- | --- | --- |
| Navigasi dan tombol | Perubahan warna latar, border, atau teks selama **160 ms**, CSS `ease`. | `styles.css` |
| Menu mobile | Tiga garis berubah menjadi ikon tutup menggunakan `transform` dan `opacity`, **160 ms**, `ease`; menu memakai `<details>`. | `styles.css` |
| Scroll | ScrollSmoother aktif pada lebar **≥1025 px** jika motion diizinkan: `smooth: 0.7`, `smoothTouch: 0`, `effects: true`. Fallback menggunakan scroll browser. | `motion.js`, `styles.css` |
| Header | Tersembunyi saat scroll turun terkumpul **12 px**, muncul saat naik **8 px**; bergerak `yPercent: -110` selama **240 ms**, `power2.out`. Tetap muncul dekat awal halaman atau saat menerima focus. | `motion.js` |
| Reveal bagian | About, Why Us, dan Locations muncul sekali ketika bagian mencapai `top 84%`: dari `y: 16` dan transparan, **550 ms**, `expo.out`, stagger **80 ms**. Konten yang sudah melewati viewport ditampilkan langsung. | `motion.js` |
| Parallax gambar | Gambar About dan latar Why Us memakai `data-speed="0.96"` melalui ScrollSmoother; efek smoother hanya aktif di desktop. | `index.html`, `motion.js` |
| Foto kartu kursus | Hover perangkat pointer halus atau focus di dalam kartu memperbesar foto ke `1.05`, **300 ms**, `cubic-bezier(0.16, 1, 0.3, 1)`. | `styles.css` |
| FAQ | Jawaban membuka dengan tinggi dan opacity selama **220 ms**, `power2.out`; menutup **180 ms**, `power2.in`. Tween sebelumnya dihentikan saat arah berubah. | `motion.js` |
| CTA kontak | Hover pointer halus atau focus di dalam area memperbesar gambar ke `1.04`, **900 ms**, `power2.inOut`; animasi dibalik saat keluar. Fallback CSS menggunakan **450 ms** dan `cubic-bezier(0.16, 1, 0.3, 1)`. | `cta-motion.js`, `styles.css` |
| Detail kursus | Saat pilihan kursus berubah, judul, deskripsi, breadcrumb, dan isi muncul dari opacity 0.35 selama **280 ms**, `power2.out`, stagger **25 ms**; latar tetap diam dan pilihan cepat menghentikan tween sebelumnya. Reduced motion menampilkan konten langsung. | `course-detail.js` |
| Lokasi | Detail lokasi muncul dari `y: 8` dan opacity 0 selama **220 ms**, `power2.out`. Peta nasional membesar ke `2.2` dan memudar selama **350 ms**, `power2.inOut`; peta regional muncul dari skala `0.96` selama **250 ms**, `power2.out`. Kembali ke nasional menggunakan skala awal `1.08` selama **250 ms**. | `locations.js` |
| Penanda peta | Pulse **2,4 detik**, `ease-out`, berulang hanya ketika peta terlihat dan motion diizinkan. | `locations.js`, `styles.css` |
| Hero video | Video disembunyikan saat reduced motion; gambar latar tetap tersedia. | `styles.css` |

Nilai di atas adalah referensi untuk kasus yang sejenis, bukan token global yang sudah tersedia. Gunakan konfigurasi yang ada ketika membangun pola yang sama; periksa kebutuhan dan state desain sebelum menerapkannya pada komponen baru.

## Implementasi dan aksesibilitas

- Gunakan CSS untuk transisi sederhana; gunakan GSAP yang sudah tersedia untuk rangkaian scroll atau transisi state yang memerlukan kontrol. Jangan menambahkan library motion baru tanpa kebutuhan yang jelas.
- Batasi `ScrollSmoother` dan efeknya pada kondisi yang sama dengan halaman utama kecuali desain menentukan lain. Pastikan anchor, fokus header, dan interaksi tetap berfungsi ketika smoother tidak aktif.
- Untuk efek GSAP, gunakan `gsap.matchMedia()` atau pemeriksaan reduced motion dan bersihkan listener, tween, serta ScrollTrigger ketika konteks berubah. Jangan bergantung pada animasi untuk menyelesaikan state penting.
- Terapkan media query hover pada efek pointer. Pertahankan focus yang terlihat secara independen dari animasi. Untuk state yang menggunakan `<details>`, jaga operasi native saat GSAP tidak tersedia atau reduced motion aktif.
- Perhatikan pengukuran layout dan animasi tinggi seperti FAQ; uji pada konten panjang dan saat pengguna membalik aksi dengan cepat. Hindari animasi terus-menerus di luar area yang terlihat.

## Pemeriksaan setiap perubahan

1. Uji desktop dan mobile, hover dan keyboard, pembalikan aksi cepat, serta anchor dan scroll.
2. Aktifkan reduced motion dan pastikan state akhir tampil segera, konten terlihat, dan kontrol tetap berfungsi; uji juga ketika GSAP atau JavaScript tidak tersedia jika relevan.
3. Periksa console, overflow, dan perubahan layout. Periksa performa ketika animasi berjalan; bila memungkinkan gunakan perangkat nyata dan alat browser untuk mendeteksi frame yang terlewat.
4. Perbarui inventaris ini jika perilaku, durasi, easing, kondisi, atau sumber implementasi berubah. Catat hal yang belum diverifikasi secara runtime.
