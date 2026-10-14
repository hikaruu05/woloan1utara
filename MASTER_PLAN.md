# Rencana Induk Portal Woloan 1 Utara

## 1. Tujuan Produk

Portal ini menjadi etalase digital yang mudah dipakai untuk mengenalkan potensi Kelurahan Woloan 1 Utara kepada warga dan pengunjung. Pengunjung dapat menemukan tiga jenis listing utama:

1. Rumah panggung kayu dan pengrajinnya.
2. Toko, usaha, dan produk UMKM.
3. Destinasi wisata dan tempat menarik yang dapat dikunjungi.

Petugas kelurahan mengelola informasi melalui dashboard sederhana setelah masuk sebagai administrator. Pengunjung dapat melihat informasi tanpa membuat akun.

### Status implementasi

- **Sudah ada di kode:** katalog rumah dan UMKM kosong tanpa data contoh; tombol upload publik dilepas; halaman Destinasi Wisata, pencarian/filter kategori, kartu dan detail destinasi ditambahkan.
- **Sudah dirapikan untuk pengalaman pengguna:** beranda memakai satu pesan utama, tiga kartu pintasan kategori, lalu destinasi, rumah, dan UMKM; navigasi desktop/ponsel memprioritaskan ketiga katalog; katalog kosong menyampaikan status dengan jelas.
- Klaim angka/kartu produk contoh pada hero dihapus. Alat rumah kini menghitung luas saja; harga dan waktu pengerjaan diarahkan untuk dikonfirmasi kepada pengrajin.
- **Sudah ada di kode:** tombol **Masuk Admin** pada navigasi desktop, menu ponsel, dan footer; halaman login tanpa pendaftaran publik; dashboard pengelolaan untuk tiga kategori; draf/terbit/arsip; alur upload foto WebP.
- **Sudah ada di kode:** login **Mitra Usaha** tanpa pendaftaran publik, pemetaan satu akun ke satu listing UMKM, formulir untuk memperbarui profil/produk, pengajuan perubahan yang terpisah dari data publik, serta antrean admin untuk menyetujui dan menerbitkan atau meminta perbaikan.
- **Sudah disiapkan:** konektor Supabase REST, skema Postgres, RLS untuk akses publik/admin, bucket foto, dan panduan konfigurasi pada [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md).
- **Belum dapat diaktifkan dari repositori saja:** proyek Supabase, URL/anon key, akun email petugas, dan deployment. Pengelola perlu menjalankan SQL serta memasukkan konfigurasi backend terlebih dahulu.
- **Data resmi masih dibutuhkan:** isi katalog destinasi/rumah/UMKM dan nama/kontak aparatur. Katalog tidak diisi dengan informasi rekaan.
- Bagian aparatur menyiapkan enam kartu Kepala Lingkungan dan enam kartu wakil; identitas yang belum disediakan harus dilengkapi petugas sebelum peluncuran.

### Prinsip produk

- **Mudah dipahami:** gunakan bahasa Indonesia yang sederhana, tombol dengan kata kerja jelas, serta formulir yang meminta data secukupnya.
- **Mendahulukan kebutuhan pengunjung:** lokasi, foto, kontak, harga atau biaya, jam buka, dan petunjuk kunjungan mudah ditemukan.
- **Terpercaya:** tampilkan status informasi, tanggal pembaruan, dan sumber kontak yang jelas.
- **Ramah ponsel:** prioritaskan tampilan dan interaksi pada layar ponsel karena banyak pengunjung akan membuka portal melalui ponsel.
- **Aman:** hanya akun administrator yang dapat membuat, mengubah, menerbitkan, atau menghapus listing.
- **Hemat biaya:** mulai dengan paket gratis, pantau kuota, dan jangan mengaktifkan paket berbayar atau penagihan otomatis.

## 2. Pengguna dan Kebutuhannya

| Pengguna | Kebutuhan utama | Pengalaman yang dirancang |
|---|---|---|
| Calon pembeli rumah panggung | Membandingkan model, kisaran harga, bahan, dan pengrajin | Katalog rumah dengan filter, detail spesifikasi, lokasi, dan tombol WhatsApp |
| Warga atau calon pelanggan UMKM | Menemukan toko, produk, harga, dan cara menghubungi penjual | Katalog toko dan produk dengan kategori, alamat, dan kontak langsung |
| Wisatawan | Menemukan tempat, cara menuju lokasi, biaya, jam buka, dan hal yang dapat dilakukan | Katalog destinasi dengan peta, panduan kunjungan, fasilitas, dan kontak |
| Petugas kelurahan | Memperbarui katalog dan memeriksa perubahan dari pemilik usaha | Dashboard berbahasa Indonesia dengan tombol tambah, ubah, tinjau pengajuan, dan terbitkan |
| Pengusaha UMKM | Memperbarui data usahanya sendiri tanpa bisa mengubah usaha lain | Username dan kata sandi sementara dari petugas, halaman Mitra Usaha, formulir sederhana, dan status pemeriksaan |

## 3. Struktur Halaman dan Navigasi

### Navigasi utama

Navigasi desktop disarankan berisi:

- **Beranda**
- **Rumah Panggung**
- **UMKM & Produk**
- **Destinasi Wisata**
- **Profil Kelurahan**
- **Kontak**
- Tombol **Masuk Mitra** dan **Masuk Admin** di sisi kanan

Pada ponsel, tampilkan logo dan tombol menu. Menu terbuka memuat tautan publik yang sama dan tombol **Masuk Mitra** serta **Masuk Admin** di bagian bawah. Tombol tambah/ubah/terbitkan katalog tetap hanya tersedia untuk admin. Mitra hanya dapat mengajukan perubahan pada listing usaha yang ditautkan ke akunnya. Jangan menampilkan tombol “Upload” pada halaman publik.

Destinasi menjadi tautan tingkat atas agar pengunjung dapat menemukannya tanpa harus memahami istilah “produk”. Ketiga katalog menggunakan pola visual yang serupa, tetapi tetap memiliki filter dan informasi khusus masing-masing.

### Peta halaman

```text
Beranda
├── Rumah Panggung
│   └── Detail Rumah
├── UMKM & Produk
│   ├── Daftar Toko
│   ├── Detail Toko
│   └── Detail Produk
├── Destinasi Wisata
│   └── Detail Destinasi
├── Profil Kelurahan
├── Kontak & Peta
└── Masuk Admin
    └── Dashboard Admin
        ├── Ringkasan
        ├── Rumah Panggung
        ├── Toko & Produk
        └── Destinasi Wisata
```

Gunakan alamat halaman yang mudah dibagikan dan dibaca, misalnya `/rumah-panggung`, `/umkm`, `/destinasi`, dan `/destinasi/nama-tempat`. Tautan detail sebaiknya dapat disalin dan dibuka langsung, bukan hanya bergantung pada modal yang tidak memiliki alamat sendiri.

## 4. Susunan Beranda

Urutan berikut mengarahkan pengunjung dari pengenalan singkat menuju pilihan yang dapat ditindaklanjuti.

1. **Header:** identitas portal, tautan langsung ke tiga katalog, tautan profil/kontak, dan tombol masuk admin.
2. **Hero:** satu pesan utama, foto yang mewakili Woloan, tombol **Jelajahi Destinasi** dan **Lihat Semua Katalog**.
3. **Pintasan tiga kategori:** Rumah Panggung, UMKM & Produk, serta Destinasi Wisata sebagai kartu berukuran setara.
4. **Destinasi pilihan:** beberapa tempat yang sudah siap dikunjungi. Kartu menampilkan foto, nama, lokasi, kategori, dan akses detail.
5. **Rumah panggung pilihan:** kartu memuat foto, tipe, ukuran, kisaran harga resmi bila tersedia, dan pengrajin.
6. **UMKM pilihan:** mulai dari toko, lalu produk toko terpilih. Jika data belum ada, jelaskan bahwa informasi sedang disiapkan.
7. **Rencanakan kunjungan:** peta, petunjuk lokasi, serta hanya kontak dan jam layanan yang sudah dikonfirmasi.
8. **Profil kelurahan:** informasi pemerintahan dan lingkungan setelah katalog utama.
9. **Informasi pendukung dan footer:** keistimewaan Woloan, simulasi luas rumah, dan tautan penting.

Batasi jumlah kartu di beranda agar halaman tetap cepat. Setiap bagian memiliki tautan **Lihat semua** menuju katalog lengkap. Gunakan kartu dengan foto konsisten, judul, lokasi, satu informasi pembeda, dan satu aksi utama. Urutkan listing unggulan secara editorial dari dashboard; jangan membuat pengunjung mengira urutan tampil menunjukkan peringkat atau rekomendasi resmi tanpa keterangan.

## 5. Pengalaman Katalog

### Pola umum katalog

Setiap halaman katalog memuat judul dan pengantar, kolom pencarian yang mudah ditemukan, filter yang relevan, jumlah hasil, kartu listing, keadaan kosong yang membantu, dan paginasi atau tombol **Muat lebih banyak**. Pada ponsel, filter tampil sebagai tombol yang membuka panel, bukan deretan kontrol sempit.

Kartu harus bisa dikenali sebagai tautan. Gunakan foto rasio konsisten, judul yang jelas, lokasi, kategori atau tipe, satu informasi pembeda, dan tombol aksi. Jangan memenuhi kartu dengan seluruh deskripsi.

### Rumah Panggung

Filter yang disarankan: tipe rumah, jenis kayu, kisaran anggaran, jumlah lantai, dan ketersediaan penyesuaian. Kartu memuat foto, tipe, dimensi, kisaran harga, dan nama pengrajin. Halaman detail memuat galeri, spesifikasi, kayu, fitur, deskripsi, alamat bengkel, tautan peta, tanggal pembaruan, serta tombol WhatsApp.

### UMKM & Produk

Mulai dari **daftar toko/usaha** agar setiap produk selalu memiliki konteks penjual. Filter toko menurut kategori usaha dan area. Halaman toko menampilkan profil, kontak, lokasi, jam operasional jika tersedia, lalu produk dalam etalase tersendiri. Kartu produk memuat foto, nama, harga atau keterangan “Hubungi penjual”, satuan, dan tombol untuk melihat toko atau menghubungi penjual.

Jangan menganggap harga yang tidak diisi sebagai Rp0. Tampilkan “Hubungi penjual” atau “Harga belum tersedia”.

### Destinasi Wisata

Gunakan istilah **Destinasi Wisata** atau **Tempat Menarik**, bukan “produk”. Filter awal yang praktis:

- Kategori: alam, budaya/sejarah, kuliner, kerajinan/pengalaman, atau lainnya.
- Area atau lingkungan.
- Fasilitas dasar, jika datanya tersedia.

Kartu destinasi memuat foto utama, nama, kategori, area, dan satu petunjuk praktis (misalnya jam buka atau biaya masuk). Halaman detail menyusun informasi dalam urutan ini:

1. Foto utama dan nama tempat.
2. Ringkasan alasan untuk berkunjung.
3. Lokasi dan tombol **Buka Petunjuk Arah**.
4. Jam buka, biaya masuk, dan cara berkunjung; beri label **Belum dikonfirmasi** jika belum diverifikasi.
5. Fasilitas dan aksesibilitas yang benar-benar tersedia.
6. Aktivitas atau pengalaman yang dapat dilakukan.
7. Kontak atau cara reservasi jika ada.
8. Catatan adat, keselamatan, atau aturan kunjungan bila relevan.
9. Tanggal terakhir diperbarui.

Jangan menerbitkan klaim fasilitas, jam buka, harga, keamanan, atau aksesibilitas sebelum dikonfirmasi oleh pengelola tempat atau petugas.

## 6. Dashboard Administrator

Dashboard ditujukan untuk petugas nonteknis. Gunakan bahasa Indonesia, satu tugas utama per layar, label formulir yang terlihat, contoh isi, dan pesan kesalahan yang menyebut cara memperbaikinya.

### Alur masuk

1. Tombol **Masuk Admin** di kanan header desktop, bagian bawah menu ponsel, dan footer membuka halaman masuk khusus.
2. Petugas menggunakan akun yang telah dibuat oleh pengelola portal.
3. Pendaftaran akun publik dimatikan.
4. Setelah masuk, dashboard menampilkan tugas umum dan status listing.
5. Tombol **Keluar** selalu tersedia.

Halaman admin boleh tidak ditautkan dari navigasi publik, tetapi keamanan tidak boleh bergantung pada URL yang tersembunyi. Pemeriksaan hak akses harus diterapkan oleh layanan autentikasi dan kebijakan database.

### Susunan dashboard

- **Ringkasan:** jumlah listing terbit, draf, dan perlu diperiksa.
- **Menu kategori:** Rumah Panggung, Toko & Produk, Destinasi.
- **Daftar listing:** pencarian, filter status, tanggal perubahan, dan aksi ubah/pratinjau.
- **Tombol utama:** **Tambah Rumah**, **Tambah Toko**, atau **Tambah Destinasi** sesuai kategori aktif; tombol ini hanya muncul di dashboard setelah autentikasi.
- **Status publikasi:** Draf, Terbit, atau Diarsipkan.
- **Pratinjau:** petugas dapat melihat tampilan publik sebelum menerbitkan.

Formulir panjang dibagi ke beberapa bagian, misalnya **Informasi utama**, **Lokasi & kontak**, **Foto**, dan **Tinjau sebelum terbit**. Simpan draf tanpa mewajibkan semua kolom opsional. Minta konfirmasi sebelum menghapus, dan utamakan pengarsipan agar data dapat dipulihkan.

## 7. Rencana Data

Semua entitas perlu memiliki ID, status publikasi, waktu dibuat, waktu diperbarui, dan pembuat/perubah jika tersedia.

### Rumah panggung

Nama, tipe, dimensi, jenis kayu, jumlah kamar tidur/kamar mandi/lantai, kisaran harga, anggaran minimum, nama pengrajin, kontak, alamat, koordinat/tautan peta, deskripsi, fitur, foto, dan status.

### Toko

Nama toko, pemilik, kategori, nomor kontak, alamat, koordinat/tautan peta, deskripsi, jam operasional, foto, dan status.

### Produk

ID toko, nama produk, harga, satuan, deskripsi, foto, ketersediaan bila dikelola, dan status. Produk ditampilkan melalui halaman toko terkait.

### Destinasi

Nama, slug/alamat halaman, kategori, ringkasan, deskripsi, alamat, koordinat/tautan peta, jam buka, biaya, fasilitas, aksesibilitas, aktivitas, kontak/reservasi, aturan kunjungan, foto, status verifikasi, tanggal pemeriksaan, dan status publikasi.

Gunakan field opsional untuk data yang belum tersedia, dan tampilkan keadaan tersebut dengan jujur di situs. Jangan membuat listing tiruan untuk mengisi ruang kosong. Simpan tanggal dan uang dalam bentuk data yang konsisten; formatkan untuk tampilan dalam Bahasa Indonesia.

## 8. Keamanan, Biaya, dan Penyimpanan Foto

### Keamanan

- Tidak ada pendaftaran administrator terbuka.
- Terapkan izin minimum: pengunjung publik hanya membaca listing yang terbit; administrator yang diizinkan dapat menulis.
- Validasi data di antarmuka dan pada layanan/database.
- Jangan menaruh kunci rahasia server di kode frontend atau repositori.
- Terapkan batas tipe dan ukuran foto, nama file aman, dan penghapusan foto terkait saat listing dihapus jika kebijakan mengizinkan.
- Buat akun mitra hanya setelah verifikasi petugas; batasi setiap akun pada satu usaha; simpan pengajuan dalam tabel terpisah dan publikasikan hanya setelah admin menyetujui.
- Simpan cadangan data secara berkala dan dokumentasikan siapa yang mengelola akun utama.

### Pilihan backend untuk tahap awal

Supabase dapat menjadi kandidat tahap awal untuk autentikasi, database relasional, dan penyimpanan foto dalam satu layanan. Sebelum peluncuran, tetapkan pemilik akun, aktifkan hanya paket gratis, periksa kebijakan keamanan tabel/storage, dan catat prosedur pemulihan jika proyek gratis dijeda atau kuota tercapai. Jangan mengaktifkan penagihan atau paket berbayar bila syarat proyek adalah tidak mengeluarkan biaya.

Cloudflare R2 dapat dipertimbangkan kemudian sebagai penyimpanan foto tambahan. R2 tidak menyediakan database listing atau login admin, dan unggahan browser yang aman perlu jalur server-side seperti Worker/presigned URL. Karena menambah konfigurasi, R2 tidak perlu masuk MVP kecuali ada kebutuhan nyata yang tidak terpenuhi oleh penyimpanan utama.

### Foto dan WebP

- Minta petugas memilih foto dari perangkat, lalu tampilkan pratinjau dan pilihan teks alternatif.
- Sebelum unggah, putar sesuai orientasi foto, perkecil sisi terpanjang (misalnya 1600 px), dan konversi foto biasa ke WebP dengan kualitas sekitar 0,78 sebagai nilai awal.
- Pertahankan rasio foto; jangan memotong bagian penting secara otomatis. Sediakan pilihan posisi/rasio bila diperlukan.
- Tetapkan batas ukuran hasil dan beri pesan yang jelas jika foto perlu diperkecil.
- Jangan memaksa WebP untuk ilustrasi transparan atau kasus yang kualitasnya rusak; sediakan fallback JPEG/PNG.
- Simpan gambar turunan ukuran kartu dan detail bila volume gambar bertambah; gunakan lazy loading untuk gambar di bawah lipatan.

WebP mengurangi penggunaan penyimpanan dan waktu unduh, tetapi bukan pengganti validasi ukuran, batas kuota, atau kebijakan pencadangan.

## 9. Standar UI/UX

- Pertahankan palet merah bata–koral–jingga dari referensi warna proyek sebagai aksen identitas; gunakan warna netral hangat untuk bidang baca dan pastikan kontras teks memadai.
- Gunakan satu gaya tombol utama dan satu tombol sekunder secara konsisten.
- Gunakan hierarki judul yang jelas, paragraf pendek, dan bahasa yang tidak terlalu teknis.
- Jangan mengandalkan warna saja untuk status; tambahkan teks/ikon seperti **Draf** dan **Terbit**.
- Sediakan fokus keyboard yang terlihat, label input, teks alternatif gambar, dan urutan heading yang masuk akal.
- Pastikan elemen interaktif cukup besar untuk disentuh, terutama filter, menu, dan tombol kontak.
- Tampilkan loading, error, kosong, dan sukses pada katalog serta dashboard.
- Pertahankan kontrol filter saat kembali dari detail agar pengunjung tidak kehilangan pencarian.
- Hindari carousel otomatis; gunakan foto pilihan yang dapat digeser manual bila galeri diperlukan.
- Tampilkan nomor telepon dan tautan WhatsApp hanya jika pemilik listing menyetujui publikasi.

## 10. Tahapan Implementasi

### Tahap 1 — Fondasi produk (struktur selesai; isi resmi menunggu kelurahan)

- Sepakati nama kategori, istilah publik, dan konten resmi yang akan ditampilkan.
- Kumpulkan data rumah dan UMKM dari petugas; katalog saat ini kosong dari data contoh. Tandai informasi yang perlu verifikasi sebelum impor.
- Kumpulkan destinasi, foto yang boleh dipublikasikan, lokasi, jam, biaya, fasilitas, dan kontak pengelola.
- Putuskan pemilik akun admin dan kebijakan akun pengganti.

### Tahap 2 — Struktur navigasi dan katalog publik (diimplementasikan)

- Tambahkan Destinasi Wisata ke navigasi dan struktur halaman.
- Rapikan alur beranda sesuai urutan konten pada rencana ini.
- Samakan komponen kartu, filter, keadaan kosong, dan pola detail.
- Pastikan tautan detail bisa dibagikan dan kembali ke katalog tanpa kehilangan konteks.

### Tahap 3 — Data destinasi dan editorial (antarmuka diimplementasikan; data menunggu verifikasi)

- Tambahkan tipe data, data awal destinasi terverifikasi, filter, kartu, dan halaman detail.
- Bedakan field wajib dan opsional.
- Tambahkan status verifikasi serta tanggal pembaruan.

### Tahap 4 — Admin dan penyimpanan bersama (kode disiapkan; konfigurasi akun/proyek eksternal menunggu)

- Terapkan login administrator tanpa pendaftaran publik.
- Siapkan database, aturan akses, formulir tambah/ubah, draf/terbit, pratinjau, dan arsip.
- Tetapkan sumber data bersama sebagai sumber utama. Impor hanya data resmi yang telah disetujui; jangan memigrasikan data demo atau cache lama.
- Tambahkan alur unggah dan optimasi WebP dengan batas ukuran yang sesuai kuota.

### Tahap 5 — Kualitas dan peluncuran (belum selesai)

- Tinjau isi bersama petugas dan pengelola destinasi.
- Periksa penggunaan pada ponsel, akses keyboard, kontras, tautan peta, WhatsApp, dan halaman yang dibuka langsung.
- Pastikan hanya listing terbit terlihat oleh publik dan tindakan admin ditolak untuk akun lain.
- Catat panduan satu halaman untuk petugas: masuk, tambah listing, pratinjau, terbitkan, ubah, arsipkan, dan keluar.
- Pantau kuota layanan gratis dan siapkan prosedur bila proyek dijeda atau kuota habis.

## 11. Kriteria Siap Diluncurkan

- Pengunjung bisa menemukan dan membagikan halaman detail rumah, UMKM/produk, dan destinasi.
- Katalog destinasi mempunyai lokasi dan informasi praktis yang sudah diperiksa atau diberi label belum dikonfirmasi.
- Tampilan ponsel tidak memerlukan zoom horizontal dan tombol penting mudah disentuh.
- Pengunjung tanpa akun tidak dapat menambah atau mengubah data.
- Petugas dapat membuat draf, melihat pratinjau, dan menerbitkan listing tanpa bantuan teknis untuk tugas harian.
- Foto memenuhi batas ukuran, tampil baik pada kartu/detail, dan tidak menghambat halaman secara berlebihan.
- Tidak ada layanan atau konfigurasi berbayar yang aktif; batas dan risiko paket gratis tercatat.
- Tersedia panduan petugas dan salinan cadangan data.
- Tombol **Masuk Admin** membuka autentikasi yang berfungsi; semua aksi pengelolaan listing dilindungi aturan backend, bukan hanya disembunyikan di antarmuka.
- Tidak ada listing contoh rumah, toko, produk, atau destinasi yang tampil di situs produksi.
- Mitra hanya dapat melihat dan mengirim perubahan untuk usahanya; data publik tidak berubah sebelum pengajuan disetujui petugas.

## 12. Hal yang Perlu Diputuskan Sebelum Peluncuran

1. Tentukan petugas yang memverifikasi nama, jam buka, biaya, fasilitas, dan aturan tiap destinasi.
2. Tentukan pemilik/pemulih akun admin dan cara penyerahan akun ketika petugas berganti.
3. Masukkan Project URL dan anon key, jalankan `supabase/schema.sql`, lalu buat pengguna admin.
4. Kumpulkan data resmi serta foto yang disetujui untuk katalog rumah, UMKM, dan destinasi.
5. Pilih alamat situs gratis dan lakukan pemeriksaan akhir pada perangkat ponsel.

## 13. Operasional Akun Mitra UMKM

Model yang dipilih adalah akun per pengusaha dengan verifikasi kelurahan. Pendaftaran publik dimatikan. Petugas memastikan identitas dan data awal usaha, lalu dari Dashboard Admin menetapkan email sebagai username dan membuat kata sandi sementara acak. Setelah menyerahkan kredensial secara pribadi, pengusaha masuk melalui **Masuk Mitra** dan wajib mengganti kata sandi sebelum mengelola profil/produk atau mengirim perubahan. Pengajuan tidak menimpa listing aktif sampai petugas memilih **Setujui & terbitkan**. Jika ada kesalahan, petugas memilih **Minta perbaikan** dan memberi catatan yang terlihat oleh pengusaha.

Petugas membuat akun dan memilih listing usaha langsung dari Dashboard Admin. Edge Function memeriksa sesi admin, menggunakan secret server-side, menyimpan tanda wajib ganti kata sandi, dan menautkan akun. Fungsi tersebut perlu diterapkan satu kali oleh pemelihara situs; setelah aktif, petugas tidak perlu membuka Supabase untuk menambah akun. Langkah penerapan ada pada [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md).

