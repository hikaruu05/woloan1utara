import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Trash2, Unlink } from "lucide-react";
import type { PartnerAccountLink } from "../services/supabase";
import type { AdminListing, ListingKind } from "../types";
import { useTask } from "../hooks/useTask";
import { PartnerAccountDeleteDialog } from "./PartnerAccountDeleteDialog";

const PAGE_SIZE = 10;
const kindLabels: Record<ListingKind, string> = {
  houses: "Kerajinan rumah panggung", stores: "Toko & UMKM", destinations: "Destinasi wisata",
};
type LinkFilter = "all" | "linked" | "unlinked";

export const PartnerAccountsPanel: React.FC<{
  accounts: PartnerAccountLink[];
  listings: AdminListing[];
  onUnlink: (kind: ListingKind, listingId: string) => Promise<void>;
  onDelete: (userId: string) => Promise<void>;
}> = ({ accounts, listings, onUnlink, onDelete }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LinkFilter>("all");
  const [requestedPage, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<{ userId: string; username: string } | null>(null);
  const task = useTask();
  const rows = useMemo(() => {
    const byListing = new Map(listings.map(listing => [`${listing.kind}:${listing.id}`, listing]));
    return accounts.map(account => {
      const listing = account.listing_id ? byListing.get(`${account.listing_kind}:${account.listing_id}`) : undefined;
      const payload = listing?.payload as unknown as Record<string, unknown> | undefined;
      const listingName = account.listing_id ? String(payload?.title || payload?.name || "Listing terhubung") : "";
      const owner = String(payload?.ownerName || payload?.craftsmanName || "");
      const username = account.login_username || "Akun lama (login memakai email)";
      return { account, listingName, owner, username, label: kindLabels[account.listing_kind] };
    });
  }, [accounts, listings]);
  const query = search.trim().toLocaleLowerCase("id-ID");
  const filtered = rows.filter(row => {
    const linked = Boolean(row.account.listing_id);
    if (filter === "linked" && !linked || filter === "unlinked" && linked) return false;
    return !query || [row.username, row.listingName, row.owner, row.label].some(value => value.toLocaleLowerCase("id-ID").includes(query));
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);
  const start = (page - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const unlink = (row: typeof rows[number]) => {
    const listingId = row.account.listing_id;
    if (!listingId || task.busy) return;
    if (!window.confirm(`Cabut tautan “${row.listingName}” dari akun ${row.username}? Akun mitra dan listing tetap tersimpan. Mitra dapat membuat listing baru.`)) return;
    void task.run("Mencabut tautan…", async () => {
      setMessage(""); setError("");
      try {
        await onUnlink(row.account.listing_kind, listingId);
        setMessage(`Tautan akun ${row.username} telah dicabut. Akun tetap aktif tanpa tautan listing; listing sebelumnya tetap tersimpan di katalog.`);
      } catch (failure) { setError(failure instanceof Error ? failure.message : "Tautan belum dapat dicabut. Coba lagi."); }
    });
  };
  const removeAccount = () => {
    if (!pendingDelete || task.busy) return;
    const target = pendingDelete;
    void task.run("Menghapus akun mitra…", async () => {
      setMessage(""); setError("");
      try {
        await onDelete(target.userId);
        setPendingDelete(null);
        setMessage(`Akun mitra ${target.username} telah dihapus. Data listing dan foto tetap tersimpan.`);
      } catch (failure) { setError(failure instanceof Error ? failure.message : "Akun belum dapat dihapus. Coba lagi."); }
    });
  };

  return <section aria-labelledby="partner-accounts-heading" className="mt-6 border-t border-warm-100 pt-5">
    <h3 id="partner-accounts-heading" className="font-bold text-wood-950">Akun mitra dan tautan listing</h3>
    <p className="mt-1 text-sm leading-6 text-warm-600">Cabut tautan hanya melepas hubungan akun dengan listing. Akun login tetap aktif dan listing tetap tersimpan; mitra dapat membuat listing baru.</p>
    <p className="mt-1 text-xs leading-5 text-warm-600">Untuk menghapus akun login, cabut tautannya terlebih dahulu lalu pilih Hapus akun mitra. Data listing dan foto tetap tersimpan.</p>
    {message && <p role="status" className="mt-3 rounded-lg bg-green-50 p-3 text-sm leading-6 text-green-900">{message}</p>}
    <fieldset disabled={task.busy} className="mt-4 min-w-0">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
        <label className="block text-xs font-semibold text-warm-700">Cari akun mitra
          <span className="relative mt-1.5 block"><Search aria-hidden="true" size={17} className="pointer-events-none absolute left-3 top-3.5 text-warm-500"/>
            <input type="search" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder="Username, nama usaha, pemilik, atau jenis katalog" className="min-h-11 w-full rounded-xl border border-warm-300 bg-white py-3 pl-10 pr-3 text-sm font-normal text-warm-900"/>
          </span>
        </label>
        <label className="block text-xs font-semibold text-warm-700">Status tautan
          <select value={filter} onChange={event => { setFilter(event.target.value as LinkFilter); setPage(1); }} className="mt-1.5 min-h-11 w-full rounded-xl border border-warm-300 bg-white px-3 py-3 text-sm font-normal text-warm-900">
            <option value="all">Semua akun</option><option value="linked">Terhubung ke listing</option><option value="unlinked">Tanpa tautan listing</option>
          </select>
        </label>
      </div>
      <p role="status" className="mt-3 text-xs text-warm-600">{filtered.length ? `Menampilkan ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} dari ${filtered.length} akun mitra` : "0 akun mitra ditemukan"}{(query || filter !== "all") ? ` · Total ${accounts.length} akun` : ""}</p>
      {visible.length ? <ul className="mt-3 space-y-2">{visible.map(row => <li key={row.account.user_id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warm-200 bg-warm-50 px-4 py-3">
        <div className="min-w-0 flex-1 text-sm">
          <p className="break-words font-bold text-wood-950">{row.username}</p>
          <p className="mt-1 text-xs text-warm-600">{row.label}</p>
          {row.listingName && <p className="mt-1 break-words text-warm-800">Listing: {row.listingName}{row.owner ? ` · ${row.owner}` : ""}</p>}
          <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${row.account.listing_id ? "bg-green-100 text-green-900" : "bg-warm-200 text-warm-800"}`}>{row.account.listing_id ? "Terhubung ke listing" : "Tanpa tautan listing"}</span>
          {!row.account.listing_id && <p className="mt-1 text-xs leading-5 text-warm-600">Akun aktif. Belum membuat listing atau tautan sebelumnya telah dicabut.</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {row.account.listing_id && <button type="button" aria-label={`Cabut tautan listing ${row.username}`} onClick={() => unlink(row)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-3 py-2 text-xs font-bold text-brand-800"><Unlink aria-hidden="true" size={14}/>Cabut tautan listing</button>}
          <button type="button" aria-label={`Hapus akun mitra ${row.username}`} disabled={Boolean(row.account.listing_id)} title={row.account.listing_id ? "Cabut tautan listing terlebih dahulu" : "Hapus akun login secara permanen; listing dan foto tetap tersimpan"} onClick={() => { setMessage(""); setError(""); setPendingDelete({ userId: row.account.user_id, username: row.username }); }} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-800 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 aria-hidden="true" size={14}/>Hapus akun mitra</button>
        </div>
      </li>)}</ul> : <div className="mt-3 rounded-xl bg-warm-50 p-5 text-center text-sm text-warm-600">
        <p>{accounts.length ? "Tidak ada akun yang cocok dengan pencarian dan status tautan." : "Belum ada akun mitra."}</p>
        {(query || filter !== "all") && <button type="button" onClick={() => { setSearch(""); setFilter("all"); setPage(1); }} className="mt-2 font-bold text-wood-800 underline underline-offset-4">Reset pencarian dan filter</button>}
      </div>}
      {pageCount > 1 && <nav aria-label="Halaman akun mitra" className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-warm-200 pt-4">
        <p className="text-xs text-warm-600">Halaman {page} dari {pageCount} · {PAGE_SIZE} akun per halaman</p>
        <div className="flex gap-2">
          <button type="button" aria-label="Halaman akun mitra sebelumnya" disabled={page === 1} onClick={() => setPage(page - 1)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-warm-300 bg-white px-3 py-2 text-xs font-bold text-wood-900 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={15}/>Sebelumnya</button>
          <button type="button" aria-label="Halaman akun mitra berikutnya" disabled={page === pageCount} onClick={() => setPage(page + 1)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-warm-300 bg-white px-3 py-2 text-xs font-bold text-wood-900 disabled:cursor-not-allowed disabled:opacity-40">Berikutnya<ChevronRight size={15}/></button>
        </div>
      </nav>}
    </fieldset>
    {task.busy && !pendingDelete && <p role="status" className="mt-3 text-sm text-wood-800">{task.label}</p>}
    {error && !pendingDelete && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {pendingDelete && <PartnerAccountDeleteDialog username={pendingDelete.username} busy={task.busy} error={error} onCancel={() => { setPendingDelete(null); setError(""); }} onConfirm={removeAccount}/>}
  </section>;
};
