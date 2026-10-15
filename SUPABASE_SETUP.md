# Menyiapkan katalog dan admin Supabase

Panduan ini menggunakan paket Supabase Free. Kuota dan ketentuan dapat berubah, jadi periksa dashboard akun. Kode ini tidak mengaktifkan penagihan; biaya tetap bergantung pada pengaturan akun dan penyedia hosting.

## 1. Buat proyek dan tabel

1. Buat proyek Supabase dengan paket Free.
2. Buka **SQL Editor**, lalu jalankan seluruh isi [`supabase/schema.sql`](supabase/schema.sql).
3. Di **Project Settings → API**, salin **Project URL** dan **anon/public key**.
4. Isi ke `.env.local` berdasarkan `.env.example`, lalu mulai ulang server atau deploy ulang situs.
5. Jangan pernah memakai `service_role` key di aplikasi browser atau menyimpannya di repositori.

## 2. Buat akun petugas

1. Di **Authentication → Users**, tambahkan akun petugas secara manual menggunakan email yang dikelola kelurahan.
2. Jangan mengaktifkan pendaftaran publik.
3. Jalankan contoh SQL di bagian akhir `supabase/schema.sql`, ganti alamat email dengan email akun petugas yang tepat. Ulangi hanya untuk petugas berwenang.
4. Buka **Masuk Admin** di situs dan gunakan email serta kata sandi akun tersebut.

## 3. Alur pengelolaan

- Petugas dapat mengelola listing langsung bila diperlukan. Untuk listing dari mitra, petugas membuat akun dan menetapkan jenis katalog; mitra mengisi listing sendiri melalui portal mitra.
- Draf dan arsip tidak dapat dibaca publik karena kebijakan RLS database.
- Foto sumber hingga 50 MB (maksimal 64 megapiksel) diproses di perangkat. Foto diperkecil maksimal 1600 piksel dan dikonversi menjadi WebP. Kualitas serta dimensi diturunkan otomatis bila perlu agar hasil maksimal 1,5 MB sesuai bucket. JPG, PNG, WebP, AVIF, GIF, dan BMP didukung bila dapat dibaca browser; GIF memakai satu frame. Ekspor HEIC/HEIF sebagai JPG dahulu.
- URL proyek dan anon key memang terlihat di frontend. Hak tulis dilindungi autentikasi serta RLS, bukan dengan menyembunyikan alamat admin.
- Gambar bisa dibaca publik untuk ditampilkan; admin dapat mengunggah atau menghapusnya; mitra yang sudah mengganti kata sandi dapat mengunggah ke folder akun masing-masing.

## 4. Akun mitra

Tidak ada pendaftaran mandiri. Petugas membuat akun dari **Dashboard Admin → Buat akun pengusaha**, memilih jenis katalog (Kerajinan Rumah Panggung, Toko & UMKM, atau Destinasi Wisata), lalu menetapkan username. Mitra masuk memakai username dan kata sandi; mereka tidak perlu memiliki atau memberikan alamat email. Admin tidak perlu membuat atau memilih listing.

1. Username harus unik dan terdiri dari 3–32 karakter: huruf, angka, titik, garis bawah, atau tanda hubung. Petugas bertanggung jawab memverifikasi identitas pemilik dan menyampaikan kredensial secara pribadi.
2. Dashboard membuat akun untuk kategori yang dipilih dan menampilkan username serta kata sandi sementara acak satu kali. Supabase menggunakan alamat internal khusus untuk proses autentikasi; alamat tersebut tidak dikirim atau digunakan oleh mitra. Jika username yang sama sudah terdaftar, proses mengatur ulang kata sandinya. Akun yang masih tertaut ke kategori listing lain harus dilepas terlebih dahulu.
3. Pengusaha masuk ke **Masuk Mitra** dan wajib mengganti kata sandi sementara.
4. Mitra membuat listing pertamanya sendiri lewat formulir kategori yang ditetapkan admin. Untuk Toko & UMKM wajib menambahkan minimal satu produk. Foto, kontak, galeri, serta titik Maps dapat diisi di portal mitra.
5. Pengiriman awal membuat listing berstatus draf dan satu pengajuan menunggu pemeriksaan dalam satu transaksi. Listing belum tampil untuk publik sampai admin menyetujuinya.

Petugas membuka **Dashboard Admin → Pengajuan perubahan dari mitra**, memeriksa data, lalu menyetujui atau meminta perbaikan. Listing yang sudah tertaut ke akun tidak dapat diarsipkan atau dihapus sebelum tautannya dicabut. Pencabutan tautan mempertahankan akun dan jenis katalognya; mitra dapat membuat listing baru. Akun dibatasi pada satu listing aktif sekaligus. Pengajuan perubahan setelah publikasi juga disimpan terpisah dan tidak mengubah tampilan publik sampai disetujui.
### Catatan operasional dan keamanan

- Fungsi pembuatan akun menggunakan Supabase Auth Admin API untuk menetapkan kata sandi sementara. Akun mitra baru memakai username; Supabase menggunakan alamat internal berakhiran `.invalid` sebagai identitas autentikasi, tanpa mengirim email.
- Terapkan `supabase/schema.sql`, lalu terapkan kedua fungsi satu kali dari pemelihara situs dengan Supabase CLI yang sudah ditautkan ke proyek: `supabase link --project-ref <ref-proyek>`, `supabase functions deploy create-partner-account`, dan `supabase functions deploy change-partner-password`. Fungsi memveriksa sesi admin, membuat akun tanpa listing, lalu mengamankan penggantian kata sandi saat masuk pertama kali.
- Kunci secret hanya tersedia bagi fungsi server Supabase dan tidak pernah dikirim ke browser. Supabase menginjeksi key server untuk fungsi; jangan menyalinnya ke `.env.local` frontend.
- Jalankan ulang `supabase/schema.sql` setelah perubahan skema; fungsi Edge diterapkan terpisah dari SQL. Untuk skema username terbaru, jalankan SQL lebih dahulu lalu deploy ulang `create-partner-account` dan `change-partner-password`.
- Akun usaha lama pada tabel `store_owners` otomatis dipindahkan ke tabel generik `partner_accounts` saat SQL skema dijalankan. Jalankan ulang SQL sebelum menerapkan fungsi Edge yang baru.
- Foto mitra disimpan di prefix `partners/<user-id>/` pada bucket publik `catalog`; unggah dibatasi oleh RLS, sedangkan file yang sudah diunggah dapat dilihat publik lewat URL katalog.

## Catatan paket gratis

Database, penyimpanan, dan transfer data memiliki batas. Pantau penggunaan di dashboard Supabase. Jika kuota tercapai, katalog atau unggahan mungkin berhenti berfungsi sampai pemakaian turun atau kuota pulih. Tidak ada billing yang diaktifkan oleh perubahan kode ini; tetap periksa pengaturan akun. Simpan cadangan data penting secara berkala.

## Perbaikan alur admin/mitra dan foto (15 Oktober 2026)

Untuk proyek yang sudah memakai skema mitra saat ini, terapkan `supabase/migrations/202610150001_partner_submission_guards.sql` lewat SQL Editor. Instalasi baru dapat memakai seluruh `supabase/schema.sql`. Batas bucket tidak perlu diubah. Deploy ulang frontend dan kedua fungsi Edge (`create-partner-account` serta `change-partner-password`) untuk perbaikan urutan reset kredensial dan validasi permintaan.

- Formulir tidak dapat disimpan atau diganti jenisnya saat foto masih diproses. Foto galeri yang berhasil tetap ada di formulir jika foto lain gagal.
- Foto utama, produk, dan galeri memakai proses WebP yang sama. Admin kini juga dapat mengunggah galeri langsung dari perangkat.
- Batas sumber 50 MB berbeda dari batas hasil 1,5 MB. Batas hasil tetap dipertahankan agar sesuai konfigurasi penyimpanan dan menghemat transfer data.
- Mitra melihat kembali isi pengajuan terakhir yang menunggu/ditolak, termasuk produk dan foto, agar dapat memperbaiki tanpa mengetik ulang. Pengajuan menunggu mengunci formulir sampai ditinjau. Tombol **Muat ulang data** mengambil status terbaru tanpa keluar akun.
- Admin dapat membuka seluruh data, produk, dan galeri sebelum menyetujui. Pencabutan tautan menutup pengajuan menunggu dan mencegah pengajuan lama diterbitkan setelah kepemilikan berubah.
- Kegagalan menyegarkan daftar setelah pembuatan akun tidak menghilangkan kredensial yang sudah berhasil dibuat.

### Pemeriksaan lokal

`npm test` memeriksa formulir, sesi, gambar, dan skema PostgreSQL dengan data sementara. `node tests/serve-browser.mjs` membuka fixture terisolasi di `http://127.0.0.1:5180/tests/browser.html` untuk pemeriksaan visual. Akun fixture bukan akun Supabase. Halaman `http://127.0.0.1:5180/tests/image-browser.html` menguji encoder WebP browser dengan foto buatan lokal. Tidak ada data uji dikirim ke layanan produksi.

### Draf otomatis sebelum dikirim

Formulir listing admin dan mitra menyimpan isian otomatis di `localStorage` browser. Draf dipisahkan per akun, peran, jenis katalog, dan listing; admin juga melanjutkan editor listing yang terakhir dibuka. Draf mencakup produk, tautan lokasi, dan URL foto yang sudah selesai diunggah. Login, kata sandi, dan file foto yang masih diunggah tidak disimpan sebagai draf. Gunakan browser dan perangkat yang sama; menghapus data situs akan menghapus draf lokal.

Draf baru dihapus setelah penyimpanan/pengiriman berhasil atau lewat **Hapus draf di browser**. Jika server memiliki versi yang lebih baru, versi server ditampilkan terlebih dahulu dengan pilihan **Pulihkan draf lama**. Pengajuan yang menunggu pemeriksaan tetap terkunci. Draf lokal tidak diterbitkan atau dikirim otomatis. Bila penyimpanan browser gagal, formulir memberi peringatan dan tetap mempertahankan isian dalam memori halaman. Fitur draf otomatis ini hanya memerlukan deployment frontend; tidak ada perubahan database tambahan.
