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

  const token = request.headers.get("Authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publicKey = keyFromJson("SUPABASE_PUBLISHABLE_KEYS") || Deno.env.get("SUPABASE_ANON_KEY");
  const secretKey = keyFromJson("SUPABASE_SECRET_KEYS") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!token) return reply(401, { error: "Silakan masuk kembali." });
  if (!supabaseUrl || !publicKey || !secretKey) {
    console.error("Missing required Supabase function environment variables.");
    return reply(500, { error: "Layanan belum dikonfigurasi." });
  }

  let body: { newPassword?: unknown };
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
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  if (newPassword.length < 12 || newPassword.length > 128) {
    return reply(400, { error: "Buat kata sandi sepanjang 12–128 karakter." });
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

  const { data: owner, error: ownerError } = await adminClient
    .from("partner_accounts")
    .select("user_id, must_change_password")
    .eq("user_id", user.id)
    .maybeSingle();
  if (ownerError) {
    console.error("Partner account lookup failed.", ownerError.message);
    return reply(500, { error: "Status akun belum dapat diperiksa." });
  }
  if (!owner) return reply(403, { error: "Akun ini bukan akun mitra usaha." });
  if (!owner.must_change_password) return reply(409, { error: "Kata sandi sementara sudah tidak berlaku." });

  const { error: passwordError } = await adminClient.auth.admin.updateUserById(user.id, {
    password: newPassword,
  });
  if (passwordError) {
    console.error("Partner password update failed.", passwordError.message);
    return reply(400, { error: "Kata sandi belum dapat diperbarui. Periksa panjangnya lalu coba lagi." });
  }

  const { data: updatedOwner, error: updateError } = await adminClient
    .from("partner_accounts")
    .update({ must_change_password: false })
    .eq("user_id", user.id)
    .eq("must_change_password", true)
    .select("user_id")
    .maybeSingle();
  if (updateError || !updatedOwner) {
    console.error("Partner password state update failed.", updateError?.message || "No matching account.");
    return reply(500, { error: "Kata sandi berubah, tetapi akun belum dapat dibuka. Coba ganti sekali lagi atau hubungi petugas." });
  }

  return reply(200, { ok: true });
});
