# Panduan motion — Yokogawa Industrial Training

Dokumen ini mencatat motion yang dipakai di seluruh halaman situs dan menjadi acuan untuk pengembangan selanjutnya. Angka pada bagian inventaris berasal dari implementasi saat ini, bukan spesifikasi Figma. Ikuti desain dan instruksi pengguna jika keduanya menentukan perilaku yang berbeda. Jangan menambahkan animasi hanya demi menyamakan jumlah efek antarseksi.

## Prinsip penggunaan

- Gunakan motion untuk menjelaskan perubahan state, arah navigasi, atau memberi umpan balik. Konten harus tetap terbaca dan interaksi tidak boleh menunggu animasi dekoratif.
- Utamakan transisi warna untuk kontrol, serta `transform` dan `opacity` untuk pergerakan atau kemunculan. Hindari animasi layout dan paint bila efek serupa dapat dicapai dengan properti tersebut. Accordion saat ini merupakan pengecualian karena menganimasikan tinggi jawaban.
- Gunakan transisi singkat untuk kontrol yang sering digunakan; simpan motion yang lebih lambat untuk gambar dan transisi editorial. Jangan menerapkan reveal, parallax, pulse, atau zoom secara otomatis pada setiap komponen.
- Hormati `prefers-reduced-motion: reduce`: tampilkan konten dan state akhir secara langsung, matikan motion dekoratif, dan pertahankan semua fungsi. Jangan sembunyikan konten ketika JavaScript atau GSAP tidak tersedia.
- Pastikan animasi dapat dibalik atau dihentikan ketika pengguna mengubah pilihan. Hover hanya untuk perangkat dengan hover dan pointer halus; akses keyboard dan focus yang terlihat tetap wajib. Hindari menambahkan gerakan dekoratif baru yang dipicu focus keyboard.

## Inventaris motion situs

| Konteks | Perilaku dan nilai saat ini | Sumber |
| --- | --- | --- |
| Navigasi dan tombol | Perubahan warna latar, border, atau teks selama **160 ms**, CSS `ease`, termasuk navigasi kategori, pilihan kursus, kontrol kalender, dan tautan kontak. | `styles.css` |
| Menu mobile | Panel GSAP masuk dari y -16px dan opacity 0 selama **280 ms**, keluar ke y -12px dan opacity 0 selama **180 ms**, `power2.out`. `<details>` ditutup setelah animasi selesai; aksi cepat membalik tween. Escape menutup dan mengembalikan focus, resize desktop serta reduced motion langsung menyelesaikan state. Ikon memakai state CSS yang ada. | `motion.js`, `styles.css` |
| Scroll | ScrollSmoother aktif pada lebar **≥1025 px** jika motion diizinkan, kecuali halaman Courses dan detail course agar navigasi tetap sticky secara native: `smooth: 0.7`, `smoothTouch: 0`, `effects: true`. Fallback menggunakan scroll browser. | `motion.js`, `styles.css` |
| Header | Tersembunyi saat scroll turun terkumpul **12 px**, muncul saat naik **8 px**; bergerak `yPercent: -110` selama **240 ms**, `power2.out`. Tetap muncul dekat awal halaman atau saat menerima focus. Pada halaman Courses dan detail course header selalu terlihat agar tetap berdampingan dengan navigasi sticky. | `motion.js` |
| Reveal bagian | About, Why Us, Locations, pengantar Schedule dan FAQ, serta bagian kontak di Contact Us muncul sekali ketika bagian mencapai `top 84%`: dari `y: 16` dan transparan, **550 ms**, `expo.out`, stagger **80 ms**. Konten yang sudah melewati viewport ditampilkan langsung. | `motion.js` |
| Parallax gambar | Gambar About dan latar Why Us memakai `data-speed="0.96"` melalui ScrollSmoother; efek smoother hanya aktif di desktop. | `index.html`, `motion.js` |
| Kartu katalog kursus | Hover pointer halus mengubah latar selama **300 ms** dan mengisi garis bawah dari kiri ke kanan melalui `scaleX` selama **700 ms**, keduanya dengan `cubic-bezier(0.16, 1, 0.3, 1)`; reduced motion menampilkan state langsung. Focus keyboard memakai outline pada kartu. | `styles.css` |
| Foto kartu kursus | Hover perangkat pointer halus atau focus di dalam kartu memperbesar foto ke `1.05`, **300 ms**, `cubic-bezier(0.16, 1, 0.3, 1)`. | `styles.css` |
| FAQ di Home dan FAQ | Jawaban membuka dengan tinggi dan opacity selama **220 ms**, `power2.out`; menutup **180 ms**, `power2.in`. Tween sebelumnya dihentikan saat arah berubah. | `motion.js` |
| CTA kontak di halaman yang memilikinya | Hover pointer halus atau focus di dalam area memperbesar gambar ke `1.04`, **900 ms**, `power2.inOut`; animasi dibalik saat keluar. Fallback CSS menggunakan **450 ms** dan `cubic-bezier(0.16, 1, 0.3, 1)`. | `cta-motion.js`, `styles.css` |
| Detail kursus | Saat pilihan kursus berubah, judul, deskripsi, breadcrumb, dan isi muncul dari opacity 0.35 selama **280 ms**, `power2.out`, stagger **25 ms**; latar tetap diam dan pilihan cepat menghentikan tween sebelumnya. Reduced motion menampilkan konten langsung. | `course-detail.js` |
| Lokasi | Detail lokasi muncul dari `y: 8` dan opacity 0 selama **220 ms**, `power2.out`. Peta nasional membesar ke `2.2` dan memudar selama **350 ms**, `power2.inOut`; peta regional muncul dari skala `0.96` selama **250 ms**, `power2.out`. Kembali ke nasional menggunakan skala awal `1.08` selama **250 ms**. | `locations.js` |
| Penanda peta | Pulse **2,4 detik**, `ease-out`, berulang hanya ketika peta terlihat dan motion diizinkan. | `locations.js`, `styles.css` |
| Hero video | Video disembunyikan saat reduced motion; gambar latar tetap tersedia. | `styles.css` |

Nilai di atas adalah referensi untuk kasus yang sejenis, bukan token global yang sudah tersedia. Gunakan konfigurasi yang ada ketika membangun pola yang sama; periksa kebutuhan dan state desain sebelum menerapkannya pada komponen baru.

Semua halaman publik memuat fondasi motion bersama; `components.html` tetap menjadi halaman pemeriksaan komponen. Scroll dan reveal membutuhkan ScrollTrigger, sedangkan FAQ hanya membutuhkan GSAP. Tanpa plugin yang diperlukan, konten tetap terlihat dan FAQ memakai perilaku native.

## Implementasi dan aksesibilitas

- Gunakan CSS untuk transisi sederhana; gunakan GSAP yang sudah tersedia untuk rangkaian scroll atau transisi state yang memerlukan kontrol. Jangan menambahkan library motion baru tanpa kebutuhan yang jelas.
- Batasi `ScrollSmoother` dan efeknya pada kondisi yang sama dengan halaman utama; halaman Courses dan detail course menggunakan scroll browser agar navigasi tetap sticky. Pastikan anchor, fokus header, dan interaksi tetap berfungsi ketika smoother tidak aktif.
- Untuk efek GSAP, gunakan `gsap.matchMedia()` atau pemeriksaan reduced motion dan bersihkan listener, tween, serta ScrollTrigger ketika konteks berubah. Jangan bergantung pada animasi untuk menyelesaikan state penting.
- Terapkan media query hover pada efek pointer. Pertahankan focus yang terlihat secara independen dari animasi. Untuk state yang menggunakan `<details>`, jaga operasi native saat GSAP tidak tersedia atau reduced motion aktif.
- Perhatikan pengukuran layout dan animasi tinggi seperti FAQ; uji pada konten panjang dan saat pengguna membalik aksi dengan cepat. Hindari animasi terus-menerus di luar area yang terlihat.

## Pemeriksaan setiap perubahan

1. Uji desktop dan mobile, hover dan keyboard, pembalikan aksi cepat, serta anchor dan scroll.
2. Aktifkan reduced motion dan pastikan state akhir tampil segera, konten terlihat, dan kontrol tetap berfungsi; uji juga ketika GSAP atau JavaScript tidak tersedia jika relevan.
3. Periksa console, overflow, dan perubahan layout. Periksa performa ketika animasi berjalan; bila memungkinkan gunakan perangkat nyata dan alat browser untuk mendeteksi frame yang terlewat.
4. Perbarui inventaris ini jika perilaku, durasi, easing, kondisi, atau sumber implementasi berubah. Catat hal yang belum diverifikasi secara runtime.

## Tab kategori Courses pada mobile

Pada lebar ≤640px, perubahan kategori aktif saat scroll menggeser navigasi horizontal agar tab aktif berada di tengah (dibatasi ujung area scroll). Menggunakan native `scrollTo` smooth, hanya ketika kategori aktif berubah; reduced motion memakai perpindahan langsung. Scroll vertikal halaman tidak diubah.

Tab kategori Courses disembunyikan tanpa animasi saat CTA mencapai batas bawah posisi sticky tab, pada semua ukuran layar. Ruang layout tetap dipertahankan dan navigasi dibuat inert; tab muncul kembali saat scroll ke atas melewati batas yang sama.

Panel pencarian course mobile memakai GSAP: masuk dari y 32px dan opacity 0 selama 280ms, keluar ke y 24px dan opacity 0 selama 180ms, power2.out. Tween sebelumnya dihentikan saat interaksi berubah. Escape, tombol tutup, dan pilihan course memakai alur tutup yang sama; dialog native mempertahankan focus trap hingga animasi selesai. Reduced motion, resize ke desktop, dan fallback tanpa GSAP langsung menyelesaikan state.
