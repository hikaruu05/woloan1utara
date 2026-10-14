# Free catalog editing with Google Sheets

> **Arsip / tidak digunakan oleh aplikasi saat ini.** Integrasi aktif proyek memakai Supabase. Gunakan [`../SUPABASE_SETUP.md`](../SUPABASE_SETUP.md) sebagai panduan terbaru; instruksi di bawah ini hanya tersisa sebagai catatan opsi lama dan kode ini tidak lagi terhubung dengan aplikasi.

This option is designed to run on free plans: staff edit a Google Sheet, a read-only Google Apps Script serves published rows to the React portal, and the portal can be hosted on Cloudflare Pages' free plan. Use the default `pages.dev` address to avoid buying a domain. No WordPress server, paid database, paid API, or paid add-on is required.

Google's free services have storage and usage limits, which can change. This setup has no built-in billable service, but it assumes the account stays within Google's free quotas and that nobody upgrades to a paid plan or buys a custom domain.

## Create the catalog spreadsheet

1. Create a Google Sheet using an account the kelurahan is allowed to use for official content. Share it only with the staff who maintain listings.
2. Create three tabs named exactly `Houses`, `Stores`, and `Products`.
3. Add the matching header row from `houses.csv`, `stores.csv`, and `products.csv` to row 1 of each tab. You can also import each CSV as its own tab.
4. Add listing rows. Set `status` to `draft` while preparing a listing and `published` only after it is approved. Use a unique `id` for every row. Product rows refer to their store through `storeId`.
5. For photos, upload the image to the account's Google Drive. Set that image file's General access to **Anyone with the link — Viewer**, then put its URL in `imageUrl`. Only use this for photos approved for public display.

## Create the read-only endpoint

1. In the spreadsheet, open **Extensions → Apps Script**.
2. Replace the starter code with the contents of `Code.gs` and save.
3. Choose **Deploy → New deployment → Web app**.
4. Set **Execute as** to your account and **Who has access** to **Anyone**, then deploy. Approve the Google authorization prompt for the script owner account.
5. Copy the deployed web app URL ending in `/exec`.

The endpoint returns only rows whose status is `published`; it does not implement a public write method. The sheet itself remains restricted to invited staff. Do not store private or sensitive information in these public catalog tabs.

## Connect and host the React portal for free

1. Set `VITE_CATALOG_API_URL` in the deployment environment to the Apps Script `/exec` URL. For local development, put it in `.env.local` using the example in `.env.example`.
2. Deploy the React project on Cloudflare Pages using the free plan, build command `npm run build`, and output folder `dist`.
3. Use the provided `*.pages.dev` address unless the kelurahan already owns a domain. A custom domain normally costs money to register.

The portal uses JSONP to read the public catalog, so no database password or Google credential is placed in the browser. When the catalog URL is configured, visitor upload forms cannot create local listings; visitors are told to contact kelurahan staff. Staff manage published content in the spreadsheet.

## Keep it at $0

- Use the Cloudflare Pages Free plan and do not add paid services.
- Do not purchase a custom domain; use the included `pages.dev` address.
- Use a Google account the organization already has or permits for this purpose. A managed Workspace account may be part of a paid organization subscription even if this project adds no new charge.
- Keep listing photos within available Drive storage and publish only images meant for public viewing.
- Google can change free quotas. The Apps Script endpoint may stop responding temporarily if its free limits are exceeded.
