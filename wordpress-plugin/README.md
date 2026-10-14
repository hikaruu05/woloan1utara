# Woloan portal content manager

> **Arsip / tidak digunakan oleh aplikasi saat ini.** Integrasi aktif proyek memakai Supabase. Lihat [`../SUPABASE_SETUP.md`](../SUPABASE_SETUP.md); plugin ini tidak terhubung dengan aplikasi.

> This is an optional WordPress alternative. It is **not part of the no-cost setup** because WordPress hosting may require payment. For the $0 route, use [`../google-sheets-cms/README.md`](../google-sheets-cms/README.md) instead.

This folder contains a small WordPress plugin that gives kelurahan staff a familiar WordPress admin screen for publishing house and UMKM listings. The React portal reads only published listings from the plugin's public, read-only API. The plugin has no public create, edit, or delete endpoint.

## Install the WordPress plugin

1. Create a WordPress site with a trusted hosting provider. This repository does not include WordPress hosting or an account.
2. Zip the `woloan-portal-content` folder (the zip should contain `woloan-portal-content.php` at its top level).
3. In WordPress, open **Plugins → Add New Plugin → Upload Plugin**, upload the zip, and activate **Woloan Portal Content**.
4. In **Users → Add New User**, create an individual account for each staff member. Give staff the **Editor** role so they can manage listings without receiving plugin or site settings access. Keep an Administrator account for the person responsible for site maintenance, and enable MFA through the hosting provider or a trusted authentication plugin.
5. Open **Rumah Panggung** or **Toko & UMKM** in the WordPress menu. Create a listing, fill the labeled information fields, select an image using **Set featured image**, and choose **Publish** when it is ready for the public portal. Drafts stay private.

For products, enter one product per line in the **Daftar produk** field, using this order:

`name | price | price number | unit | description | image URL`

The product photo URL is optional; if omitted, the store's featured image is used.

## Connect the React portal

In WordPress, open **Settings → Woloan Portal** and enter the portal's public address, such as `https://portal.example.id`. This permits only that site's browser origin to read the catalog.

Set the WordPress site's base URL in the React project's `.env.local`:

```text
VITE_WORDPRESS_API_URL=https://your-wordpress-site.example
```

Restart the development server or redeploy the React portal after setting the variable. The frontend requests `GET /wp-json/woloan/v1/catalog`; no WordPress password or secret key belongs in the React app.

## Security notes

- The endpoint returns published listing content only. Drafts are not returned.
- Visitors can read the published catalog; they cannot create, change, or delete listings through this API.
- WordPress staff sign in to the WordPress admin site. Do not share accounts; create one account per staff member.
- Use HTTPS for both sites. Restrict the WordPress admin with strong unique passwords, MFA, and hosting-level protections where available.
- The plugin does not add WordPress users or passwords. A site owner must create and manage staff accounts in WordPress.

## Current limitations

- This is a headless WordPress connection for the existing React portal; you must provide WordPress hosting and configure the portal URL before staff changes appear on the live site.
- Product entries are entered one per line. Their optional images currently accept a URL; store photos use WordPress's featured-image picker.
- Once `VITE_WORDPRESS_API_URL` is configured, the React visitor upload form will not write listings. It will tell visitors that the catalog is managed by kelurahan staff. Before connecting WordPress, current local-only behavior remains in place.
