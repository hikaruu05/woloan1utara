# Portal Woloan 1 Utara

Portal informasi dan promosi Kelurahan Woloan 1 Utara dengan katalog Rumah Panggung, UMKM & Produk, serta Destinasi Wisata. Pengunjung dapat melihat listing terbit tanpa membuat akun. Petugas mengelola katalog melalui **Masuk Admin**; pengusaha yang akunnya sudah dibuat dan ditautkan petugas dapat mengajukan pembaruan lewat **Masuk Mitra**.

## Fitur

- Beranda profil kelurahan dengan katalog rumah panggung, UMKM, dan destinasi.
- Katalog publik hanya menampilkan data yang sudah diterbitkan.
- Dashboard admin untuk membuat, mengubah, mengarsipkan, menerbitkan, atau menghapus listing.
- Autentikasi email/kata sandi tanpa pendaftaran admin publik.
- Mitra hanya mengajukan perubahan untuk usaha yang terhubung ke akunnya; pengajuan harus disetujui petugas sebelum mengubah tampilan publik.
- Foto dikonversi ke WebP di browser sebelum diunggah.
- Beranda memprioritaskan tiga katalog; simulasi rumah menghitung luas dan tidak mengarang harga.
- Data contoh katalog dihapus; koleksi dimulai kosong sampai petugas memasukkan informasi resmi.

## Menjalankan proyek

```bash
npm run dev
```

Konfigurasi koneksi backend melalui `.env.local` berdasarkan `.env.example`. Untuk alur lengkap termasuk pembuatan akun admin/mitra dan aturan database, ikuti [panduan Supabase](SUPABASE_SETUP.md). Jangan memasukkan `service_role`/secret key ke frontend atau commit file `.env`.

## Teknologi

React, TypeScript, Vite, Tailwind CSS, Supabase Auth/Postgres/Storage. Integrasi menggunakan REST Supabase dari browser; tidak membutuhkan library tambahan.

## Rencana produk

Lihat [MASTER_PLAN.md](MASTER_PLAN.md) untuk arah produk, navigasi, pengalaman pengguna, keamanan, dan kriteria peluncuran. Panduan setup backend berada di [SUPABASE_SETUP.md](SUPABASE_SETUP.md).
