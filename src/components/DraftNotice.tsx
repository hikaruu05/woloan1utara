import React from "react";

interface DraftNoticeProps {
  saved: boolean;
  restored: boolean;
  error: boolean;
  hasOlderDraft: boolean;
  onDiscard: () => void;
  onRestoreOlder: () => void;
  disabled?: boolean;
}

export const DraftNotice: React.FC<DraftNoticeProps> = ({ saved, restored, error, hasOlderDraft, onDiscard, onRestoreOlder, disabled }) => (
  <div className={`mb-5 rounded-xl border p-4 ${error ? "border-amber-200 bg-amber-50" : "border-warm-200 bg-warm-50"}`}>
    <p role={error ? "alert" : "status"} className="text-sm leading-6 text-warm-800">
      {error ? "Draf belum tersimpan di browser. Penyimpanan mungkin penuh atau dinonaktifkan. Jangan muat ulang sebelum menyimpan atau mengirim data."
        : hasOlderDraft ? "Data dari server sudah diperbarui. Draf sebelumnya masih tersedia; pulihkan jika ingin melanjutkan isian lama."
        : restored ? "Draf dipulihkan dari browser ini. Perubahan berikutnya tersimpan otomatis."
        : saved ? "Draf tersimpan otomatis di browser ini."
        : "Isian disimpan otomatis di browser ini saat Anda mengetik."}
    </p>
    <p className="mt-1 text-xs leading-5 text-warm-600">Lanjutkan di browser dan perangkat yang sama. Foto tersimpan setelah unggahan selesai. Draf belum dikirim untuk diperiksa.</p>
    {(saved || hasOlderDraft) && <div className="mt-2 flex flex-wrap gap-3">
      {hasOlderDraft && <button type="button" disabled={disabled} onClick={onRestoreOlder} className="text-xs font-bold text-wood-800 underline underline-offset-4 disabled:opacity-50">Pulihkan draf lama</button>}
      <button type="button" disabled={disabled} onClick={onDiscard} className="text-xs font-bold text-red-700 underline underline-offset-4 disabled:opacity-50">Hapus draf di browser</button>
    </div>}
  </div>
);
