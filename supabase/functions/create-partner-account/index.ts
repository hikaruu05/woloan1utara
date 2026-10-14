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

  let body: { email?: unknown; storeId?: unknown; temporaryPassword?: unknown };
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 4096) {
      return reply(413, { error: "Permintaan terlalu besar." });
    }
    body = JSON.parse(rawBody);
  } catch {
    return reply(400, { error: "Isi permintaan tidak valid." });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const storeId = typeof body.storeId === "string" ? body.storeId.trim() : "";
  const temporaryPassword = typeof body.temporaryPassword === "string" ? body.temporaryPassword : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply(400, { error: "Masukkan alamat email pengusaha yang valid." });
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(storeId)) {
    return reply(400, { error: "Pilih listing usaha yang valid." });
  }
  if (temporaryPassword.length < 16 || temporaryPassword.length > 128) {
    return reply(400, { error: "Kata sandi sementara tidak memenuhi syarat keamanan." });
  }

  const { data: store, error: storeError } = await adminClient
    .from("stores")
    .select("id")
    .eq("id", storeId)
    .maybeSingle();
  if (storeError) {
    console.error("Store lookup failed.", storeError.message);
    return reply(500, { error: "Data usaha belum dapat diperiksa." });
  }
  if (!store) return reply(404, { error: "Listing usaha tidak ditemukan." });

  const { data: existingOwner, error: ownerCheckError } = await adminClient
    .from("store_owners")
    .select("store_id,user_id")
    .eq("store_id", storeId)
    .maybeSingle();
  if (ownerCheckError) {
    console.error("Store owner lookup failed.", ownerCheckError.message);
    return reply(500, { error: "Status akun usaha belum dapat diperiksa." });
  }
  if (existingOwner) {
    const { data: existingAuthUser, error: userLookupError } = await adminClient.auth.admin.getUserById(existingOwner.user_id);
    if (userLookupError || !existingAuthUser.user) {
      console.error("Existing partner account lookup failed.", userLookupError?.message || "User not found.");
      return reply(500, { error: "Akun mitra lama belum dapat diperiksa." });
    }
    if (existingAuthUser.user.email?.toLowerCase() !== email) {
      return reply(409, { error: "Usaha ini sudah memiliki akun dengan username email yang berbeda. Masukkan email akun tersebut untuk mengatur ulang kredensial." });
    }
    const { error: requireChangeError } = await adminClient
      .from("store_owners")
      .update({ must_change_password: true })
      .eq("store_id", storeId);
    if (requireChangeError) {
      console.error("Could not require partner password update.", requireChangeError.message);
      return reply(500, { error: "Akun belum dapat diamankan untuk pengaturan ulang." });
    }
    const { error: resetError } = await adminClient.auth.admin.updateUserById(existingOwner.user_id, {
      password: temporaryPassword,
    });
    if (resetError) {
      console.error("Partner password reset failed.", resetError.message);
      return reply(500, { error: "Kredensial belum dapat diatur ulang. Coba lagi." });
    }
    return reply(200, { ok: true, reset: true });
  }

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { account_type: "business_partner" },
  });
  if (createError || !created.user) {
    const message = createError?.message.toLowerCase().includes("already")
      ? "Email ini sudah memiliki akun. Hubungi petugas untuk memeriksa akun tersebut."
      : "Akun belum dapat dibuat. Periksa alamat email dan pengaturan autentikasi.";
    return reply(400, { error: message });
  }

  const { error: linkError } = await adminClient
    .from("store_owners")
    .insert({ store_id: storeId, user_id: created.user.id, must_change_password: true });
  if (linkError) {
    const { error: cleanupError } = await adminClient.auth.admin.deleteUser(created.user.id);
    if (cleanupError) console.error("Could not clean up unlinked partner account.", cleanupError.message);
    if (linkError.code === "23505") {
      return reply(409, { error: "Usaha atau email ini sudah terhubung ke akun mitra lain." });
    }
    console.error("Could not link invited user to store.", linkError.message);
    return reply(500, { error: "Undangan belum dapat ditautkan ke usaha. Coba lagi atau hubungi pengelola." });
  }

  return reply(200, { ok: true });
});
