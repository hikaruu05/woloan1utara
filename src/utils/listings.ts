import type { AdminListing, ListingKind, UMKMProductItem } from "../types";
import type { StoreSubmission } from "../services/supabase";

export const requiredListingFields: Record<ListingKind, string[]> = {
  stores: ["name", "ownerName", "category", "phone", "address"],
  houses: ["title", "type", "craftsmanName", "craftsmanPhone", "craftsmanAddress"],
  destinations: ["name", "category", "address"],
};

export function stringList(value: unknown): string[] {
  return (Array.isArray(value) ? value : String(value || "").split(","))
    .map(item => String(item).trim()).filter(Boolean);
}

export function normalizeListing(kind: ListingKind, values: Record<string, unknown>): Record<string, unknown> {
  const payload = { ...values };
  for (const [key, value] of Object.entries(payload)) if (typeof value === "string") payload[key] = value.trim();
  for (const key of ["galleryUrls", ...(kind === "houses" ? ["woodTypes", "features"] : kind === "destinations" ? ["facilities", "activities"] : [])]) {
    payload[key] = stringList(payload[key]);
  }
  if (kind === "houses") {
    for (const key of ["bedrooms", "bathrooms", "floors", "minBudget"]) {
      const value = Number(payload[key] || (key === "floors" ? 1 : 0));
      if (!Number.isFinite(value) || value < 0 || (key !== "minBudget" && !Number.isInteger(value)) || (key === "floors" && value < 1)) {
        throw new Error("Jumlah kamar, lantai, dan anggaran harus berupa angka yang valid; minimal satu lantai.");
      }
      payload[key] = value;
    }
    payload.isCustomAllowed = Boolean(payload.isCustomAllowed);
  }
  if (kind === "stores") {
    payload.products = ((Array.isArray(payload.products) ? payload.products : []) as UMKMProductItem[]).map(product => {
      if (!product.name?.trim()) throw new Error("Isi nama setiap produk atau hapus produk yang masih kosong.");
      return { ...product, id: product.id || crypto.randomUUID(), name: product.name.trim(), price: product.price?.trim() || "Hubungi penjual", priceNum: Number(product.priceNum) || 0 };
    });
  }
  return payload;
}

export function validateListing(kind: ListingKind, payload: Record<string, unknown>, complete: boolean) {
  const required = complete ? requiredListingFields[kind] : [kind === "houses" ? "title" : "name"];
  if (required.some(key => !String(payload[key] || "").trim())) throw new Error("Lengkapi informasi utama yang wajib diisi.");
  if (complete && kind === "stores" && !(payload.products as unknown[])?.length) throw new Error("Tambahkan minimal satu produk sebelum menerbitkan atau mengirim usaha.");
  for (const key of ["imageUrl", "mapsUrl", "bookingUrl"]) {
    const value = String(payload[key] || "");
    if (value && !isHttpUrl(value)) throw new Error("Gunakan tautan lengkap yang diawali https:// atau http:// untuk foto, peta, dan reservasi.");
  }
  if (stringList(payload.galleryUrls).some(url => !isHttpUrl(url))) throw new Error("Tautan foto tambahan harus diawali https:// atau http://.");
}

export function isHttpUrl(value: string): boolean {
  try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; }
}

// Pending and rejected submissions contain the owner's latest edits. The public
// listing can still contain older, approved content while those edits are reviewed.
export function partnerDraft(listing: AdminListing | null, submissions: StoreSubmission[]): Record<string, unknown> {
  const latest = [...submissions].sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  const useSubmission = listing && latest && latest.listing_id === listing.id && latest.listing_kind === listing.kind
    && latest.status !== "approved" && Date.parse(latest.created_at) >= Date.parse(listing.updatedAt);
  const payload = useSubmission ? latest.payload : listing?.payload;
  return structuredClone(payload || {}) as Record<string, unknown>;
}

// Validate browser drafts before feeding product and gallery values back into the form.
export function isListingDraft(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (record.galleryUrls !== undefined && (!Array.isArray(record.galleryUrls) || record.galleryUrls.some(url => typeof url !== "string"))) return false;
  return record.products === undefined || (Array.isArray(record.products) && record.products.every(product =>
    product && typeof product === "object" && typeof product.id === "string" && typeof product.name === "string"));
}
