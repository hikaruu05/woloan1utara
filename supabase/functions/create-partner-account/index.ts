import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function reply(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function keyFromJson(name: string): string | undefined {
  const raw = Deno.env.get(name);
  if (!raw) return undefined;
  try {
    const keys = JSON.parse(raw) as Record<string, string>;
    return keys.default || Object.values(keys)[0];
  } catch {
    return raw;
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return reply(405, { error: "Metode permintaan tidak didukung." });
  const authorization = request.headers.get("Authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publicKey = keyFromJson("SUPABASE_PUBLISHABLE_KEYS") || Deno.env.get("SUPABASE_ANON_KEY");
  const secretKey = keyFromJson("SUPABASE_SECRET_KEYS") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!token) return reply(401, { error: "Silakan masuk sebagai admin terlebih dahulu." });
  if (!supabaseUrl || !publicKey || !secretKey) {
    console.error("Missing required Supabase function environment variables.");
    return reply(500, { error: "Layanan pembuatan akun belum dikonfigurasi." });
  }

  const callerClient = createClient(supabaseUrl, publicKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const adminClient = createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: authData, error: authError } = await callerClient.auth.getUser(token);
  const user = authData.user;
  if (authError || !user) return reply(401, { error: "Sesi tidak valid. Silakan masuk kembali." });

  const { data: adminRecord, error: adminCheckError } = await adminClient
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (adminCheckError) {
    console.error("Admin membership check failed.", adminCheckError.message);
    return reply(500, { error: "Hak akses admin belum dapat diperiksa." });
  }
  if (!adminRecord) return reply(403, { error: "Hanya admin kelurahan yang dapat membuat akun mitra." });

  let body: { action?: unknown; contractVersion?: unknown; username?: unknown; listingKind?: unknown; listingId?: unknown; userId?: unknown; temporaryPassword?: unknown };
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 4096) {
      return reply(413, { error: "Permintaan terlalu besar." });
    }
    body = JSON.parse(rawBody);
    if (!body || typeof body !== "object" || Array.isArray(body)) return reply(400, { error: "Isi permintaan tidak valid." });
  } catch {
    return reply(400, { error: "Isi permintaan tidak valid." });
  }
  if (body.contractVersion !== 4) return reply(409, { error: "Versi formulir akun tidak sesuai. Muat ulang situs lalu coba lagi." });
  if (body.action === "delete") {
    const targetId = typeof body.userId === "string" ? body.userId.trim() : "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(targetId)) return reply(400, { error: "Akun mitra tidak valid." });
    if (targetId === user.id) return reply(403, { error: "Akun yang sedang Anda gunakan tidak dapat dihapus." });
    const { data: deleted, error: deleteError } = await adminClient.rpc("delete_partner_auth_user", { p_user_id: targetId });
    if (deleteError) {
      if (deleteError.code === "PGRST202") return reply(503, { error: "Fungsi hapus akun belum tersedia. Terapkan migrasi penghapusan akun mitra di Supabase terlebih dahulu." });
      if (deleteError.code === "42501" || deleteError.code === "23514") return reply(409, { error: deleteError.message });
      console.error("Partner account deletion failed.", deleteError.code);
      return reply(500, { error: "Akun belum dapat dihapus. Data akun dan foto tetap dipertahankan; coba lagi atau hubungi pengelola." });
    }
    if (typeof deleted !== "boolean") return reply(502, { error: "Respons penghapusan akun tidak valid. Muat ulang daftar akun sebelum mencoba lagi." });
    return reply(200, { ok: true, deleted: true, alreadyDeleted: !deleted, contractVersion: 4 });
  }
  const usernameInput = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
  const legacyEmail = usernameInput.includes("@") ? usernameInput : "";
  const username = legacyEmail ? "" : usernameInput;
  const email = legacyEmail || (username ? `${username}@mitra.woloan1utara.invalid` : "");
  const listingKind = typeof body.listingKind === "string" ? body.listingKind.trim() : "";
  const listingId = typeof body.listingId === "string" ? body.listingId.trim() : "";
  const temporaryPassword = typeof body.temporaryPassword === "string" ? body.temporaryPassword : "";
  if (!["houses", "stores", "destinations"].includes(listingKind)) return reply(400, { error: "Pilih jenis katalog yang valid." });
  if (body.action === "unlink") {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(listingId)) return reply(400, { error: "Listing tidak valid." });
    const { data: removedAccount, error: unlinkError } = await adminClient
      .from("partner_accounts")
      .update({ listing_id: null })
      .eq("listing_kind", listingKind)
      .eq("listing_id", listingId)
      .select("user_id")
      .maybeSingle();
    if (unlinkError) {
      console.error("Could not remove partner listing link.", unlinkError.message);
      return reply(500, { error: "Tautan akun belum dapat dicabut. Coba lagi." });
    }
    if (!removedAccount) return reply(404, { error: "Listing ini belum terhubung ke akun mitra." });
    return reply(200, { ok: true, unlinked: true, contractVersion: 4 });
  }
  if (!legacyEmail && !/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username)) {
    return reply(400, { error: "Username harus 3–32 karakter: huruf, angka, titik, garis bawah, atau tanda hubung." });
  }
  if (legacyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(legacyEmail)) {
    return reply(400, { error: "Format username atau email lama tidak valid." });
  }
  if (temporaryPassword.length < 16 || temporaryPassword.length > 128) {
    return reply(400, { error: "Kata sandi sementara tidak memenuhi syarat keamanan." });
  }

  const { data: existingUserId, error: authLookupError } = await adminClient.rpc("lookup_auth_user_id_by_email", { target_email: email });
  if (authLookupError) {
    console.error("Could not check for an existing login.", authLookupError.message);
    return reply(500, { error: "Status username belum dapat diperiksa. Pastikan skema Supabase terbaru sudah diterapkan." });
  }
  let partnerUserId: string;
  let createdNewAuthUser = false;
  if (existingUserId) {
    const { data: isAnotherAdmin, error: adminLookupError } = await adminClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", existingUserId)
      .maybeSingle();
    if (adminLookupError) return reply(500, { error: "Status username belum dapat diperiksa." });
    if (isAnotherAdmin) return reply(409, { error: "Username ini sudah digunakan akun admin. Pilih username lain." });
    const { data: existingAccount, error: membershipError } = await adminClient
      .from("partner_accounts")
      .select("user_id,listing_kind,listing_id,login_username")
      .eq("user_id", existingUserId)
      .maybeSingle();
    if (membershipError) return reply(500, { error: "Status akun mitra belum dapat diperiksa." });
    if (existingAccount && existingAccount.listing_id && existingAccount.listing_kind !== listingKind) return reply(409, { error: "Akun ini masih terhubung ke jenis listing lain. Cabut tautan listing lama terlebih dahulu." });
    partnerUserId = existingUserId;
    if (existingAccount) {
      // Finish fallible account metadata updates before changing the password.
      // Otherwise a database failure would leave the new credentials undisplayed.
      const { error: updateError } = await adminClient.from("partner_accounts").update({ listing_kind: listingKind, ...(username ? { login_username: username } : {}), must_change_password: true }).eq("user_id", existingUserId);
      if (updateError) return reply(500, { error: "Akun lama belum dapat diperbarui." });
      const { error: resetError } = await adminClient.auth.admin.updateUserById(existingUserId, { password: temporaryPassword });
      if (resetError) return reply(400, { error: "Kata sandi login lama belum dapat diatur ulang. Kata sandi sebelumnya masih berlaku; coba atur ulang kembali." });
      return reply(200, { ok: true, reset: true, contractVersion: 4 });
    }
  } else {
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { account_type: "business_partner", login_username: username || undefined },
    });
    if (createError || !created.user) {
      const message = createError?.message.toLowerCase().includes("already")
        ? "Username ini sudah memiliki akun. Gunakan username lain atau atur ulang akun yang sudah ada."
        : "Akun belum dapat dibuat. Periksa alamat email dan pengaturan autentikasi.";
      return reply(400, { error: message });
    }
    partnerUserId = created.user.id;
    createdNewAuthUser = true;
  }

  const { error: linkError } = await adminClient
    .from("partner_accounts")
    .insert({ listing_kind: listingKind, listing_id: null, login_username: username || null, user_id: partnerUserId, must_change_password: true });
  if (linkError) {
    if (createdNewAuthUser) {
      const { error: cleanupError } = await adminClient.auth.admin.deleteUser(partnerUserId);
      if (cleanupError) console.error("Could not clean up unlinked partner account.", cleanupError.message);
    }
    if (linkError.code === "23505") {
      return reply(409, { error: "Listing atau username ini sudah digunakan akun lain." });
    }
    console.error("Could not create partner account.", linkError.message);
    return reply(500, { error: "Akun belum dapat dibuat. Coba lagi atau hubungi pengelola." });
  }

  if (existingUserId) {
    const { error: resetError } = await adminClient.auth.admin.updateUserById(partnerUserId, { password: temporaryPassword });
    if (resetError) return reply(400, { error: "Akun sudah disiapkan, tetapi kata sandi belum diatur ulang. Kata sandi sebelumnya masih berlaku; ulangi proses reset." });
  }

  return reply(200, { ok: true, ...(existingUserId ? { reset: true } : {}), contractVersion: 4 });
});
