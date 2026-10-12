# Portal Web Profil & Promosi Kelurahan Woloan 1 Utara
### Sentra Rumah Panggung Minahasa & Direktori Digital UMKM Berbasis Toko
> **Proyek Kuliah Kerja Terpadu (KKT) Mahasiswa 2026**  
> *Kelurahan Woloan Satu Utara, Kecamatan Tomohon Barat, Kota Tomohon, Sulawesi Utara*

---

## 📌 Tentang Proyek
Website ini dikembangkan sebagai karya pengabdian masyarakat dalam rangka digitalisasi dan promosi potensi lokal **Kelurahan Woloan Satu Utara**. Woloan dikenal secara internasional sebagai **sentra utama pembuatan Rumah Panggung Kayu Tradisional Minahasa sistem bongkar-pasang (knockdown)** yang tahan gempa dan telah diekspor ke belasan negara di dunia (seperti Maladewa, Karibia, Malaysia, Australia, hingga Eropa).

Platform ini dirancang khusus dengan fitur:
1. **Profil Resmi Kelurahan & Layanan Administrasi Publik**: Sejarah wilayah, struktur aparatur, kepala lingkungan (Pala), serta panduan surat keterangan warga.
2. **Halaman Khusus Katalog Rumah Panggung Kayu**: Menampilkan model rumah panggung dengan filter tipe, kayu, harga, titik Google Maps bengkel, dan sistem paginasi 10 produk per halaman.
3. **Halaman Khusus Direktori Toko & Produk UMKM (Konsep Berbasis Toko)**: Menampilkan profil usaha/toko UMKM warga lengkap dengan titik alamat Google Maps, dan katalog produk per toko dengan sistem paginasi 10 item per halaman.
4. **Portal Unggah Mandiri**: Pengusaha rumah panggung dan pelaku UMKM dapat mendaftarkan profil toko, titik Google Maps, dan menambahkan produk secara mandiri.
5. **Kalkulator Simulasi Biaya Rumah Panggung**: Estimasi instan luas bangunan, rentang harga, lama pengerjaan, dan tombol konsultasi WhatsApp.

---

## 🎨 Konsep Desain & Color Palette

Desain website memadukan estetika arsitektur kayu tradisional Minahasa yang hangat dengan keasrian alam pegunungan Kota Tomohon di kaki Gunung Lokon:

- **Wood & Amber (`#613C17`, `#7F5324`, `#9C6D34`, `#D97706`)**: Merepresentasikan kehangatan dan kekokohan kayu Aliwowos dan Cempaka Wasian.
- **Forest Pine (`#163E2D`, `#277D55`, `#389A6B`)**: Menggambarkan kesuburan lembah dan perkebunan hijau di kaki Gunung Lokon.
- **Soft Cream & Warm Linen (`#FDFBF7`, `#FAF6F0`, `#F7F3EB`)**: Memberikan kontras latar belakang yang bersih, elegan, dan nyaman dibaca.
- **Tipografi**: Perpaduan elegan antara *Playfair Display* (untuk judul arsitektural) dan *Plus Jakarta Sans* (untuk keterbacaan teks modern).

---

## 🚀 Fitur Unggulan

### 1. 🏛️ Profil Kelurahan & Layanan Administrasi
- Sejarah dan karakteristik geografis Woloan Satu Utara di dataran tinggi Tomohon.
- Visi & Misi Kelurahan.
- Struktur aparatur pemerintah kelurahan dan Kepala Lingkungan (Pala I s.d. IV).
- Panduan layanan administrasi warga (Surat Keterangan Usaha / SKU, SKAU Kayu, perizinan).

### 2. 🪵 Keistimewaan & Karakteristik Kayu Woloan
- Penjelasan ilmiah dan kultural mengapa rumah panggung Woloan tahan gempa (rekayasa purus & pasak lentur).
- Spesifikasi 3 kayu andalan: **Kayu Aliwowos**, **Kayu Cempaka Wasian**, dan **Kayu Besi**.
- Infografis 5 alur tahapan produksi (dari pemilihan bahan, uji rakit di workshop, penomoran kode, hingga perakitan di lokasi pembeli).

### 3. 🏡 Halaman Khusus: Katalog Rumah Panggung Kayu
- **Halaman tersendiri (`#/katalog-rumah`)** dengan tautan langsung dan tombol kembali ke beranda.
- Filter interaktif berdasarkan **Tipe Rumah** (Walewangko, Villa 2 Lantai, Minimalis, Cottage, Gazebo), **Jenis Kayu**, dan **Urutan Budget**.
- **Titik Lokasi Google Maps**: Tautan titik lokasi maps ke bengkel/workshop kayu pengrajin.
- **Sistem Paginasi (10 Model per Halaman)** dengan navigasi halaman rapi.
- Modal detail spesifikasi lengkap dengan fitur salin rincian.
- Tombol direct WhatsApp ke perajin dengan template pesan otomatis.

### 4. 🏪 Halaman Khusus: Direktori Usaha & Toko UMKM (Konsep Per Toko)
- **Halaman tersendiri (`#/katalog-umkm`)** berbasis unit usaha / toko.
- **Konsep Berbasis Toko**: Setiap kartu menampilkan toko/usaha lengkap dengan nama pemilik, foto toko, kategori usaha, alamat, dan **titik lokasi Google Maps** yang dapat diklik langsung.
- **Etalase Produk Toko**: Menampilkan jumlah produk per toko dan preview produk. Pengunjung dapat membuka profil toko untuk melihat seluruh produk yang dijual beserta harga dan tombol order WhatsApp.
- **Mode Tampilan**: Dapat beralih antara tampilan **"Katalog Toko UMKM"** dan **"Etalase Semua Produk"**.
- **Sistem Paginasi (10 Item per Halaman)** untuk toko maupun produk.

### 5. 📤 Portal Unggah Mandiri (Upload Modal)
- Form pendaftaran **Toko UMKM** (nama toko, pemilik, kategori, nomor WA, alamat fisik, titik tautan Google Maps, foto toko, serta fitur dinamis untuk menambah banyak produk sekaligus).
- Form pendaftaran **Rumah Panggung** (nama bengkel, model rumah, dimensi, kamar, jenis kayu, harga, alamat, titik Google Maps, dan foto).
- Tersimpan secara persisten di penyimpanan browser (`localStorage`) sehingga data langsung tampil di katalog seketika!

### 6. 🧮 Kalkulator Simulasi Biaya Rumah Panggung
- Perhitungan otomatis berdasarkan Panjang x Lebar bangunan, jumlah lantai (1 atau 2 lantai), pilihan material kayu, dan lokasi tujuan pemasangan.
- Estimasi instan: Luas bangunan ($m^2$), rentang biaya, lama pengerjaan di bengkel, dan lama perakitan di lokasi.
- Tombol satu klik: *"Konsultasikan Rencana Ini via WhatsApp"*.

### 7. 📍 Peta Wilayah & Pusat Informasi
- Integrasi Google Maps responsif untuk wilayah Woloan Satu Utara, Tomohon Barat.
- Panduan transportasi dari Bandara Sam Ratulangi dan Terminal Tomohon.
- Formulir aspirasi dan pertanyaan warga/pengunjung.

---

## 🛠️ Teknologi yang Digunakan
- **Frontend Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS dengan custom warm-wood & forest theme
- **Icons**: Lucide React
- **Typography**: Google Fonts (Playfair Display & Plus Jakarta Sans)
- **Persistence**: LocalStorage with auto-recovery to verified village dataset

---

## 💻 Cara Menjalankan Proyek Secara Lokal

1. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka browser di alamat yang tertera (biasanya `http://localhost:5173`).

2. **Membangun versi produksi (Build)**:
   ```bash
   npm run build
   ```
   File hasil build akan berada di direktori `dist/` dan siap di-hosting di platform seperti GitHub Pages, Vercel, Netlify, atau web server kelurahan.

---

## 👨‍🎓 Kemitraan KKT 2026
Didedikasikan untuk kemajuan masyarakat **Kelurahan Woloan Satu Utara, Kecamatan Tomohon Barat, Kota Tomohon, Sulawesi Utara**.  
*Pakatuan wo Pakalawiren!*
