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

- Petugas memilih Rumah Panggung, Toko & UMKM, atau Destinasi Wisata, mengisi informasi yang telah dikonfirmasi, lalu menyimpan sebagai draf atau menerbitkan.
- Draf dan arsip tidak dapat dibaca publik karena kebijakan RLS database.
- Foto diperkecil maksimal 1600 piksel, dikonversi menjadi WebP kualitas 0,78, lalu dibatasi maksimal 1,5 MB.
- URL proyek dan anon key memang terlihat di frontend. Hak tulis dilindungi autentikasi serta RLS, bukan dengan menyembunyikan alamat admin.
- Gambar bisa dibaca publik untuk ditampilkan; hanya akun administrator yang disetujui dapat mengunggah atau menghapusnya.

## 4. Akun mitra usaha

Tidak ada pendaftaran mandiri. Setelah fungsi server satu kali diterapkan, petugas dapat membuat akun dari **Dashboard Admin → Buat akun mitra usaha** tanpa membuka Supabase. Pastikan listing usaha sudah ada, lalu petugas:

1. Masukkan email milik pengusaha sebagai username dan pilih listing usaha yang sudah diverifikasi.
2. Pilih **Buat / atur ulang**. Untuk usaha tanpa akun, dashboard membuat akun dan menautkannya. Untuk usaha yang sudah punya akun, masukkan email akun tersebut untuk mengatur ulang kata sandinya.
3. Dashboard menampilkan kata sandi sementara acak satu kali.
4. Catat lalu berikan username dan kata sandi itu langsung kepada pemilik melalui cara pribadi. Jangan kirim di grup atau membagikannya ke orang lain.
5. Arahkan pemilik ke **Masuk Mitra**. Sistem mewajibkan pemilik mengganti kata sandi sebelum mengelola usaha; database juga menolak pengajuan dan unggahan sebelum penggantian.

Petugas kemudian membuka **Dashboard Admin → Perubahan usaha dari mitra**, memeriksa pengajuan, lalu menyetujui dan menerbitkannya atau meminta perbaikan.

Perubahan mitra disimpan sebagai pengajuan terpisah; listing publik yang sudah terbit tetap tidak berubah sampai petugas menyetujui. Database membatasi akun ke usaha yang ditautkan, mencegah pengajuan paralel, dan hanya menyediakan fungsi peninjauan kepada akun petugas. Akun pengguna dan tautan usaha dihapus bila akun pemilik atau listing dihapus.

### Catatan operasional dan keamanan

- Fungsi pembuatan akun menggunakan Supabase Auth Admin API untuk menetapkan kata sandi sementara. Autentikasi email pengguna ditandai terkonfirmasi karena petugas hanya membuat akun setelah memverifikasi identitas pemilik.
- Terapkan `supabase/schema.sql`, lalu terapkan kedua fungsi satu kali dari pemelihara situs dengan Supabase CLI yang sudah ditautkan ke proyek: `supabase link --project-ref <ref-proyek>`, `supabase functions deploy create-partner-account`, dan `supabase functions deploy change-partner-password`. Fungsi memveriksa sesi admin, membuat akun, menghubungkannya ke usaha, lalu mengamankan penggantian kata sandi saat masuk pertama kali.
- Kunci secret hanya tersedia bagi fungsi server Supabase dan tidak pernah dikirim ke browser. Supabase menginjeksi key server untuk fungsi; jangan menyalinnya ke `.env.local` frontend.
- Jalankan ulang `supabase/schema.sql` setelah perubahan skema; fungsi Edge diterapkan terpisah dari SQL.
- Foto mitra disimpan di prefix `partners/<user-id>/` pada bucket publik `catalog`; unggah dibatasi oleh RLS, sedangkan file yang sudah diunggah dapat dilihat publik lewat URL katalog.

## Catatan paket gratis

Database, penyimpanan, dan transfer data memiliki batas. Pantau penggunaan di dashboard Supabase. Jika kuota tercapai, katalog atau unggahan mungkin berhenti berfungsi sampai pemakaian turun atau kuota pulih. Tidak ada billing yang diaktifkan oleh perubahan kode ini; tetap periksa pengaturan akun. Simpan cadangan data penting secara berkala.
