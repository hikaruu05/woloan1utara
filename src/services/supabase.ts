import {
  AdminListing,
  ListingKind,
  ListingStatus,
  RumahPanggung,
  TravelDestination,
  UMKMStore,
} from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const sessionStorageKey = "woloan_portal_session_v2";

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: { id: string; email?: string };
}

export interface StoreSubmission {
  id: string;
  listing_kind: ListingKind;
  listing_id: string;
  user_id: string;
  payload: Record<string, unknown>;
  status: "pending" | "approved" | "rejected";
  review_note: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface PartnerAccountLink {
  user_id: string;
  listing_kind: ListingKind;
  listing_id: string | null;
  login_username: string | null;
}

interface ListingRow {
  id: string;
  payload: Record<string, unknown>;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function readSavedSession(): SupabaseSession | null {
  try {
    const raw = sessionStorage.getItem(sessionStorageKey);
    if (!raw) return null;
    const session = JSON.parse(raw) as SupabaseSession;
    if (!session.access_token || !session.refresh_token || !session.user?.id) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: SupabaseSession | null) {
  if (session) sessionStorage.setItem(sessionStorageKey, JSON.stringify(session));
  else sessionStorage.removeItem(sessionStorageKey);
}

function requireConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Koneksi database belum dikonfigurasi.");
  }
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}

async function requestJson<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      body?.msg || body?.message || body?.error_description || body?.error ||
      "Permintaan tidak dapat diproses.";
    throw new Error(message);
  }
  return body as T;
}

function apiHeaders(accessToken?: string): Record<string, string> {
  const { anonKey } = requireConfig();
  return {
    apikey: anonKey,
    Authorization: `Bearer ${accessToken || anonKey}`,
    "Content-Type": "application/json",
  };
}

function tableUrl(kind: ListingKind, query: string) {
  const { url } = requireConfig();
  return `${url}/rest/v1/${kind}?${query}`;
}

function hydrateRow(row: ListingRow, kind: ListingKind): AdminListing {
  const payload: Record<string, unknown> = { ...row.payload, id: row.id };
  if (kind === "houses") {
    payload.isVerified = row.status === "published";
  } else if (kind === "stores") {
    payload.isVerified = row.status === "published";
    if (!Array.isArray(payload.products)) payload.products = [];
  } else {
    payload.isVerified = row.status === "published";
  }

  return {
    id: row.id,
    kind,
    status: row.status,
    payload: payload as unknown as RumahPanggung | UMKMStore | TravelDestination,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchListings(
  kind: ListingKind,
  accessToken?: string,
): Promise<AdminListing[]> {
  const query = accessToken
    ? "select=id,payload,status,created_at,updated_at&order=updated_at.desc"
    : "select=id,payload,status,created_at,updated_at&status=eq.published&order=updated_at.desc";
  const rows = await requestJson<ListingRow[]>(tableUrl(kind, query), {
    headers: apiHeaders(accessToken),
  });
  return rows.map((row) => hydrateRow(row, kind));
}

export async function signIn(email: string, password: string): Promise<SupabaseSession> {
  const { url, anonKey } = requireConfig();
  const result = await requestJson<Omit<SupabaseSession, "expires_at"> & { expires_in: number }>(
    `${url}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
  );
  return { ...result, expires_at: Date.now() + result.expires_in * 1000 };
}

const partnerLoginDomain = "mitra.woloan1utara.invalid";
function partnerAuthEmail(identifier: string): string {
  const normalized = identifier.trim().toLowerCase();
  return normalized.includes("@") ? normalized : `${normalized}@${partnerLoginDomain}`;
}

export async function signInPartner(username: string, password: string): Promise<SupabaseSession> {
  return signIn(partnerAuthEmail(username), password);
}

export async function refreshSession(session: SupabaseSession): Promise<SupabaseSession> {
  const { url, anonKey } = requireConfig();
  const result = await requestJson<Omit<SupabaseSession, "expires_at"> & { expires_in: number }>(
    `${url}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    },
  );
  return { ...result, expires_at: Date.now() + result.expires_in * 1000 };
}

export async function signOut(accessToken: string) {
  const { url, anonKey } = requireConfig();
  await fetch(`${url}/auth/v1/logout`, {
    method: "POST",
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
  });
}

export async function isAdministrator(session: SupabaseSession): Promise<boolean> {
  const { url } = requireConfig();
  const rows = await requestJson<Array<{ user_id: string }>>(
    `${url}/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(session.user.id)}`,
    { headers: apiHeaders(session.access_token) },
  );
  return rows.some((row) => row.user_id === session.user.id);
}

export async function getPartnerAccount(session: SupabaseSession): Promise<{ listingId: string | null; listingKind: ListingKind; mustChangePassword: boolean } | null> {
  const { url } = requireConfig();
  const rows = await requestJson<Array<{ listing_id: string | null; listing_kind: ListingKind; must_change_password: boolean }>>(
    `${url}/rest/v1/partner_accounts?select=listing_id,listing_kind,must_change_password&user_id=eq.${encodeURIComponent(session.user.id)}`,
    { headers: apiHeaders(session.access_token) },
  );
  return rows[0] ? { listingId: rows[0].listing_id, listingKind: rows[0].listing_kind, mustChangePassword: rows[0].must_change_password } : null;
}

export async function fetchPartnerListing(session: SupabaseSession, kind: ListingKind, listingId: string): Promise<AdminListing> {
  const rows = await requestJson<ListingRow[]>(
    tableUrl(kind, `select=id,payload,status,created_at,updated_at&id=eq.${encodeURIComponent(listingId)}&limit=1`),
    { headers: apiHeaders(session.access_token) },
  );
  if (!rows[0]) throw new Error("Data listing belum dapat ditemukan. Hubungi petugas kelurahan.");
  return hydrateRow(rows[0], kind);
}

export async function fetchStoreSubmissions(session: SupabaseSession, listingId?: string): Promise<StoreSubmission[]> {
  const { url } = requireConfig();
  const filter = listingId ? `&listing_id=eq.${encodeURIComponent(listingId)}` : "";
  return requestJson<StoreSubmission[]>(
    `${url}/rest/v1/partner_submissions?select=id,listing_kind,listing_id,user_id,payload,status,review_note,created_at,reviewed_at${filter}&order=created_at.desc`,
    { headers: apiHeaders(session.access_token) },
  );
}

export async function fetchPartnerAccounts(session: SupabaseSession): Promise<PartnerAccountLink[]> {
  const { url } = requireConfig();
  return requestJson<PartnerAccountLink[]>(
    `${url}/rest/v1/partner_accounts?select=user_id,listing_kind,listing_id,login_username&order=created_at.desc`,
    { headers: apiHeaders(session.access_token) },
  );
}

export async function submitStoreChanges(session: SupabaseSession, kind: ListingKind, listingId: string, payload: Record<string, unknown>): Promise<void> {
  const { url } = requireConfig();
  await requestJson<unknown>(`${url}/rest/v1/partner_submissions`, {
    method: "POST",
    headers: { ...apiHeaders(session.access_token), Prefer: "return=minimal" },
    body: JSON.stringify({ listing_kind: kind, listing_id: listingId, user_id: session.user.id, payload, status: "pending" }),
  });
}

export async function createPartnerListingSubmission(session: SupabaseSession, payload: Record<string, unknown>): Promise<string> {
  const { url } = requireConfig();
  return requestJson<string>(`${url}/rest/v1/rpc/create_partner_listing_submission`, {
    method: "POST",
    headers: apiHeaders(session.access_token),
    body: JSON.stringify({ p_payload: payload }),
  });
}

export async function reviewStoreSubmission(session: SupabaseSession, submissionId: string, decision: "approve" | "reject", note = ""): Promise<void> {
  const { url } = requireConfig();
  const rpc = decision === "approve" ? "approve_partner_submission" : "reject_partner_submission";
  await requestJson<unknown>(`${url}/rest/v1/rpc/${rpc}`, {
    method: "POST",
    headers: apiHeaders(session.access_token),
    body: JSON.stringify({ p_submission_id: submissionId, ...(decision === "reject" ? { p_review_note: note } : {}) }),
  });
}

export async function createPartnerAccount(session: SupabaseSession, username: string, listingKind: ListingKind, temporaryPassword: string): Promise<"created" | "reset"> {
  const { url, anonKey } = requireConfig();
  let response: Response;
  try {
    response = await fetch(`${url}/functions/v1/create-partner-account`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractVersion: 4, username: username.trim().toLowerCase(), listingKind, temporaryPassword }),
    });
  } catch {
    throw new Error("Layanan pembuatan akun tidak dapat dihubungi. Pastikan fungsi Supabase create-partner-account sudah diterapkan pada proyek yang sama dengan situs ini.");
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    if (body?.error === "Versi formulir akun tidak sesuai. Muat ulang situs lalu coba lagi.") {
      throw new Error("Fungsi pembuatan akun Supabase masih versi lama. Pengelola situs perlu menerapkan ulang create-partner-account.");
    }
    throw new Error(body?.error || "Akun belum dapat dibuat. Periksa koneksi lalu coba lagi.");
  }
  if (body?.contractVersion !== 4) {
    throw new Error("Fungsi pembuatan akun Supabase belum menggunakan versi yang sesuai. Terapkan ulang create-partner-account lalu coba lagi.");
  }
  return body?.reset ? "reset" : "created";
}

export async function unlinkPartnerAccount(session: SupabaseSession, listingKind: ListingKind, listingId: string): Promise<void> {
  const { url, anonKey } = requireConfig();
  const response = await fetch(`${url}/functions/v1/create-partner-account`, {
    method: "POST",
    headers: { apikey: anonKey, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "unlink", contractVersion: 4, listingKind, listingId }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok && body?.error === "Listing ini belum terhubung ke akun mitra.") return;
  if (!response.ok) throw new Error(body?.error || "Tautan akun mitra belum dapat dicabut.");
  if (body?.contractVersion !== 4) throw new Error("Fungsi Supabase masih versi lama. Terapkan ulang create-partner-account.");
}

export async function changePartnerPassword(session: SupabaseSession, newPassword: string): Promise<void> {
  const { url, anonKey } = requireConfig();
  const response = await fetch(`${url}/functions/v1/change-partner-password`, {
    method: "POST",
    headers: { apikey: anonKey, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "Kata sandi belum dapat diperbarui. Coba lagi.");
}

export async function uploadPartnerListingImage(file: File, session: SupabaseSession): Promise<string> {
  const optimized = await optimizeImage(file);
  const { url, anonKey } = requireConfig();
  const objectPath = `partners/${session.user.id}/${crypto.randomUUID()}.webp`;
  const response = await fetch(`${url}/storage/v1/object/catalog/${objectPath}`, {
    method: "POST",
    headers: { apikey: anonKey, Authorization: `Bearer ${session.access_token}`, "Content-Type": "image/webp", "x-upsert": "false" },
    body: optimized,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Foto gagal diunggah. Coba lagi atau hubungi petugas.");
  }
  return `${url}/storage/v1/object/public/catalog/${objectPath}`;
}

export async function upsertListing(
  kind: ListingKind,
  id: string | undefined,
  payload: Record<string, unknown>,
  status: ListingStatus,
  session: SupabaseSession,
): Promise<AdminListing> {
  const listingId = id || crypto.randomUUID();
  const body = {
    id: listingId,
    payload: { ...payload, id: listingId },
    status,
    updated_at: new Date().toISOString(),
    ...(id ? {} : { created_at: new Date().toISOString() }),
  };
  const { url } = requireConfig();
  const rows = await requestJson<ListingRow[]>(
    `${url}/rest/v1/${kind}?on_conflict=id&select=id,payload,status,created_at,updated_at`,
    {
      method: "POST",
      headers: {
        ...apiHeaders(session.access_token),
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(body),
    },
  );
  if (!rows[0]) throw new Error("Data tersimpan, tetapi respons server kosong.");
  return hydrateRow(rows[0], kind);
}

export async function deleteListing(
  kind: ListingKind,
  id: string,
  session: SupabaseSession,
) {
  await fetch(`${tableUrl(kind, `id=eq.${encodeURIComponent(id)}`)}`, {
    method: "DELETE",
    headers: { ...apiHeaders(session.access_token), Prefer: "return=minimal" },
  }).then(async (response) => {
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message || "Listing tidak dapat dihapus.");
    }
  });
}

export async function uploadListingImage(file: File, session: SupabaseSession) {
  const optimized = await optimizeImage(file);
  const { url } = requireConfig();
  const filename = `${crypto.randomUUID()}.webp`;
  const objectPath = `listings/${filename}`;
  const response = await fetch(`${url}/storage/v1/object/catalog/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: requireConfig().anonKey,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "image/webp",
      "x-upsert": "false",
    },
    body: optimized,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Foto gagal diunggah. Periksa aturan penyimpanan.");
  }
  return `${url}/storage/v1/object/public/catalog/${objectPath}`;
}

async function optimizeImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Pilih file gambar seperti JPG, PNG, atau WebP.");
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error("Ukuran foto awal maksimal 15 MB.");
  }

  const bitmap = await createImageBitmap(file);
  const maxSide = 1600;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Foto tidak dapat diproses di perangkat ini.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.78),
  );
  if (!blob) throw new Error("Konversi WebP gagal. Coba foto lain.");
  if (blob.size > 1_500_000) {
    throw new Error("Hasil foto masih terlalu besar. Pilih foto dengan ukuran lebih kecil.");
  }
  return blob;
}
