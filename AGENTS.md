# Panduan agent — Yokogawa Industrial Training

Berlaku untuk seluruh proyek. Ikuti instruksi pengguna yang spesifik untuk tugas saat ini dan pertahankan perubahan yang sudah ada di workspace.

## Sumber desain dan skill

- Untuk implementasi atau perubahan desain dari Figma ke HTML, baca `design.md` terlebih dahulu sebagai acuan sistem desain proyek. Periksa juga frame, ukuran, teks, aset, dan varian komponen pada Figma yang diberikan. Jangan mengarang nilai yang tidak tersedia di `design.md`.
- Gunakan skill `emil-design-eng` dan `frontend-design` untuk kualitas visual, interaksi, dan motion; gunakan `tmdr-design-to-html` untuk standar struktur dan kualitas kode. Baca instruksi skill yang tersedia sebelum menggunakannya. Jika skill tidak tersedia, jelaskan keterbatasannya dan lanjutkan dengan aturan proyek yang dapat diterapkan.
- Saat instruksi saling berbeda, dahulukan permintaan eksplisit pengguna, lalu desain Figma dan `design.md`, kemudian pola proyek yang sudah ada dan panduan skill. Jangan mengubah desain yang diberikan hanya demi menerapkan rekomendasi estetika skill.

## Motion dan animasi

- Baca `motion.md` sebelum menambahkan atau mengubah animasi. Gunakan pola yang relevan sebagai acuan konsistensi, hormati reduced motion, dan perbarui panduan jika implementasi motion berubah.

## Implementasi Figma ke HTML

- Pahami cakupan dan kondisi proyek sebelum mengedit. Gunakan data Figma bila tersedia; jika hanya screenshot tersedia, nyatakan bagian yang merupakan estimasi. Periksa varian dan state komponen interaktif sebelum membangunnya.
- Pertahankan struktur proyek yang sudah ada: halaman HTML di root, `styles.css` untuk gaya bersama, dan file JavaScript yang relevan. Gunakan kembali token, komponen, dan pola yang ada. Jangan memindahkan seluruh proyek ke struktur `output/` atau melakukan migrasi besar hanya untuk mengikuti contoh skill, kecuali diminta.
- Untuk komponen yang berulang, seperti navbar, CTA, dan footer, gunakan komponen bersama yang sudah tersedia di proyek agar tampilan dan perilakunya konsisten di semua halaman. Hindari membuat salinan terpisah.
- Gunakan HTML semantik, struktur heading yang logis, CSS yang mudah dipelihara, dan JavaScript seperlunya. Pisahkan tanggung jawab dan hindari duplikasi. Gunakan token desain yang sudah ada sebelum membuat nilai baru.
- Jaga kesesuaian visual dengan Figma: komposisi, ukuran, tipografi, warna, jarak, dan state. Sesuaikan layout untuk desktop dan mobile tanpa overflow horizontal. Jangan mengubah konten atau membuat klaim baru tanpa dasar.
- Implementasikan interaksi yang tampak di desain agar berfungsi. Pastikan navigasi keyboard, focus terlihat, label yang jelas, teks alternatif yang sesuai, dan target sentuh yang memadai. Hormati `prefers-reduced-motion`; gunakan animasi seperlunya dan hindari menghambat interaksi.

## Aset dan ikon

- Simpan aset gambar baru di `asset/`, secara rapi dalam subfolder jika membantu, dengan nama deskriptif menggunakan kebab-case. Gunakan aset Figma asli bila tersedia, format dan resolusi yang sesuai, serta pastikan setiap path benar. Jangan memindahkan atau menghapus aset lama tanpa kebutuhan.
- Untuk ikon, gunakan [Iconsax](https://iconsax.io/) sesuai ikon dan tipe/varian yang terlihat di Figma. Periksa nama, bentuk, ukuran, warna, dan varian sebelum memilih. Gunakan SVG jika sesuai dan asetnya tersedia serta dapat digunakan; jangan mengganti ikon dengan varian lain tanpa alasan. Jika ikon tidak dapat diidentifikasi atau diperoleh, laporkan keterbatasannya.

## Verifikasi dan serah terima

- Jalankan preview lokal dari root proyek dengan `python3 -m http.server 8000`, lalu buka `http://localhost:8000`. Jika port dipakai, gunakan port lain. Hentikan server dengan `Ctrl+C` jika tidak lagi diperlukan.
- Sesuaikan pemeriksaan dengan perubahan: cek path aset, tampilan pada ukuran desktop dan mobile, interaksi yang diubah, navigasi keyboard, dan console browser bila tersedia. Bandingkan hasil dengan Figma ketika akses dan alat memungkinkan.
- Laporkan perubahan, pemeriksaan yang benar-benar dilakukan, asumsi penting, dan hal yang belum dapat diverifikasi. Jangan mengklaim visual atau perilaku runtime telah diuji jika belum.
- Perbarui `README.md` jika cara menjalankan proyek atau strukturnya berubah secara material. Hindari perubahan di luar cakupan tugas.
