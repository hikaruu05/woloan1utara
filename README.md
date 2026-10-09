# Portal Web Profil & Promosi Kelurahan Woloan 1 Utara
### Sentra Rumah Panggung Minahasa & Direktori Digital UMKM Warga
> **Proyek Kuliah Kerja Terpadu (KKT) Mahasiswa 2026**  
> *Kelurahan Woloan Satu Utara, Kecamatan Tomohon Barat, Kota Tomohon, Sulawesi Utara*

---

## 📌 Tentang Proyek
Website ini dikembangkan sebagai karya pengabdian masyarakat dalam rangka digitalisasi dan promosi potensi lokal **Kelurahan Woloan Satu Utara**. Woloan dikenal secara internasional sebagai **sentra utama pembuatan Rumah Panggung Kayu Tradisional Minahasa sistem bongkar-pasang (knockdown)** yang tahan gempa dan telah diekspor ke belasan negara di dunia (seperti Maladewa, Karibia, Malaysia, Australia, hingga Eropa).

Selain menyajikan profil desa resmi, platform ini dirancang khusus sebagai **wadah promosi mandiri** bagi:
1. **Pengusaha & Perajin Rumah Panggung Kayu**: Memajang katalog model rumah (klasik Walewangko, villa resort 2 lantai, minimalis tropis, gazebo), rincian jenis kayu, dimensi, dan tombol konsultasi langsung via WhatsApp.
2. **Pelaku UMKM Lokal Woloan 1 Utara**: Mempromosikan produk kerajinan tangan kayu (souvenir miniatur rumah panggung, peralatan dapur food-grade), kuliner legendaris (klappertaart panggang, kacang goyang, halua kenari), serta hasil pertanian unggulan lereng Gunung Lokon (kopi arabika, bunga krisan potong).

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

### 3. 🏡 Katalog Rumah Panggung Kayu
- Filter interaktif berdasarkan **Tipe Rumah** (Walewangko, Villa 2 Lantai, Minimalis, Cottage, Gazebo), **Jenis Kayu**, dan **Urutan Budget**.
- Kartu listing interaktif dengan foto, dimensi, jumlah kamar, bahan kayu, dan harga estimasi.
- Modal detail spesifikasi lengkap dengan fitur salin rincian.
- Tombol direct WhatsApp ke perajin dengan template pesan otomatis.

### 4. 🛍️ Direktori & Etalase Produk UMKM Warga
- Kategori terorganisir: Kerajinan Kayu & Souvenir, Kuliner Khas Minahasa, Pertanian & Kopi Lokon, Jasa.
- Detail pemilik usaha, alamat lingkungan di Woloan 1 Utara, serta tombol order WhatsApp.

### 5. 📤 Portal Unggah Mandiri (Upload Modal)
- Form upload yang mudah digunakan oleh para pengusaha rumah panggung dan UMKM.
- Mendukung **unggah foto langsung dari kamera/galeri perangkat** (konversi instant base64) atau input link URL.
- Live card preview sebelum diterbitkan.
- Tersimpan secara persisten di penyimpanan browser (`localStorage`) sehingga produk yang diunggah langsung tampil di katalog secara seketika!

### 6. 🧮 Kalkulator Simulasi Biaya Rumah Panggung
- Perhitungan otomatis berdasarkan Panjang x Lebar bangunan, jumlah lantai (1 atau 2 lantai), pilihan material kayu, dan lokasi tujuan pemasangan.
- Estimasi instan: Luas bangunan ($m^2$), rentang biaya, lama pengerjaan di bengkel, dan lama perakitan di lokasi.
- Tombol satu klik: *"Konsultasikan Rencana Ini via WhatsApp"*.

### 7. 📍 Peta Wilayah & Pusat Informasi
- Integrasi Google Maps responsif untuk wilayah Woloan Satu Utara, Tomohon Barat.
- Panduan akses transportasi dari Bandara Sam Ratulangi dan Pusat Kota Tomohon.
- Formulir aspirasi dan pertanyaan warga/pengunjung.

---

## 🛠️ Teknologi yang Digunakan
- **Frontend Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS dengan custom warm-wood theme
- **Icons**: Lucide React
- **Typography**: Google Fonts (Playfair Display & Plus Jakarta Sans)
- **Persistence**: LocalStorage with auto-recovery to verified village dataset

---

## 💻 Cara Menjalankan Proyek Secara Lokal

1. **Pastikan Node.js telah terinstal** (rekomendasi Node 18 ke atas):
   ```bash
   node -v
   npm -v
   ```

2. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka browser di alamat yang tertera (biasanya `http://localhost:5173`).

3. **Membangun versi produksi (Build)**:
   ```bash
   npm run build
   ```
   File hasil build akan berada di direktori `dist/` dan siap di-hosting di platform seperti GitHub Pages, Vercel, Netlify, atau web server kelurahan.

---

## 👨‍🎓 Kemitraan KKT 2026
Didedikasikan untuk kemajuan masyarakat **Kelurahan Woloan Satu Utara, Kecamatan Tomohon Barat, Kota Tomohon, Sulawesi Utara**.  
*Pakatuan wo Pakalawiren!*
