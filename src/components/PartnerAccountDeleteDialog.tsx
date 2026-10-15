import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LoaderCircle, Trash2 } from "lucide-react";

export function PartnerAccountDeleteDialog({ username, busy, error, onCancel, onConfirm }: {
  username: string;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    element.showModal();
    return () => { element.close(); previousFocus?.focus(); };
  }, []);

  return createPortal(<dialog ref={dialog} aria-labelledby="delete-partner-title" aria-describedby="delete-partner-description" onCancel={event => {
    event.preventDefault();
    if (!busy) onCancel();
  }} className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl border border-red-100 bg-white p-6 text-warm-900 shadow-2xl backdrop:bg-warm-950/60">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700"><Trash2 aria-hidden="true" size={21}/></div>
    <h2 id="delete-partner-title" className="text-lg font-bold text-wood-950">Hapus akun mitra?</h2>
    <p id="delete-partner-description" className="mt-3 break-words text-sm leading-6">Akun <strong>{username}</strong> akan dihapus permanen dan tidak bisa login lagi. Data listing dan foto tetap tersimpan. Penghapusan akun tidak dapat dibatalkan.</p>
    {busy && <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-warm-50 p-3 text-sm"><LoaderCircle aria-hidden="true" size={18} className="shrink-0 animate-spin"/>Menghapus akun mitra…</p>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-800">{error}</p>}
    <div className="mt-6 flex flex-wrap justify-end gap-3">
      <button type="button" autoFocus disabled={busy} onClick={onCancel} className="min-h-11 rounded-xl border border-warm-300 px-4 py-2.5 text-sm font-bold disabled:opacity-50">Batal</button>
      <button type="button" disabled={busy} onClick={onConfirm} className="min-h-11 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50">{busy ? "Menghapus…" : "Ya, hapus akun"}</button>
    </div>
  </dialog>, document.body);
}
