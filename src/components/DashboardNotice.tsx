import React from "react";

export const DashboardNotice: React.FC<{ error: string; refresh: () => Promise<void>; disabled?: boolean }> = ({ error, refresh, disabled }) => {
  const [busy, setBusy] = React.useState(false);
  return <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warm-200 bg-white p-4">
    <p role={error ? "alert" : "status"} className={`text-sm ${error ? "text-red-800" : "text-warm-600"}`}>{error || "Muat ulang data untuk melihat status terbaru dari petugas dan mitra."}</p>
    <button type="button" disabled={busy || disabled} onClick={async () => { setBusy(true); try { await refresh(); } finally { setBusy(false); } }} className="rounded-lg border border-warm-300 px-3 py-2 text-sm font-bold text-wood-900 disabled:opacity-50">{busy ? "Memuat…" : "Muat ulang data"}</button>
  </div>;
};
