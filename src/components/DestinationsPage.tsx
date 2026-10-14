import React, { useEffect, useMemo, useState } from "react";
import { Compass, MapPin, Search, Clock3, ArrowUpRight, ArrowLeft } from "lucide-react";
import { TravelDestination } from "../types";
import { useData } from "../context/DataContext";

const categoryLabels: Record<string, string> = {
  semua: "Semua kategori", alam: "Alam", budaya: "Budaya", kuliner: "Kuliner",
  kerajinan: "Kerajinan", lainnya: "Lainnya",
};

export const DestinationsPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { destinations, catalogLoading } = useData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("semua");
  const [selected, setSelected] = useState<TravelDestination | null>(null);
  const shown = useMemo(() => destinations.filter((item) =>
    (category === "semua" || item.category === category) &&
    `${item.name} ${item.area} ${item.summary}`.toLowerCase().includes(query.toLowerCase())
  ), [destinations, category, query]);
  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  return <section className="min-h-[65vh] bg-warm-50 px-4 py-12 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <button onClick={onBackToHome} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-wood-800"><ArrowLeft size={16}/> Kembali ke Beranda</button>
      <div className="mb-8 max-w-3xl"><p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-wood-700"><Compass size={17}/> Jelajahi Woloan</p><h1 className="font-serif text-3xl font-bold text-wood-950 sm:text-4xl">Destinasi Wisata</h1><p className="mt-3 text-warm-700">Temukan tempat menarik dan pengalaman lokal di Woloan 1 Utara.</p></div>
      <div className="mb-7 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
        <label className="flex items-center gap-3 rounded-xl border border-warm-300 bg-white px-4 py-3"><Search size={18} className="text-warm-500"/><input aria-label="Cari destinasi" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Cari nama tempat atau lingkungan" className="w-full bg-transparent text-sm outline-none"/></label>
        <select aria-label="Filter kategori" value={category} onChange={(e)=>setCategory(e.target.value)} className="rounded-xl border border-warm-300 bg-white px-4 py-3 text-sm text-warm-800">{Object.entries(categoryLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select>
      </div>
      {!catalogLoading && destinations.length > 0 && <div className="mb-4 flex items-center justify-between text-sm text-warm-600"><span>{shown.length} destinasi</span>{(query || category !== "semua") && <button onClick={()=>{setQuery("");setCategory("semua");}} className="font-semibold text-wood-800 underline underline-offset-2">Hapus filter</button>}</div>}
      {catalogLoading ? <p className="rounded-2xl bg-white p-8 text-center text-warm-600">Memuat informasi destinasi…</p> : shown.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{shown.map((item)=><button key={item.id} onClick={()=>setSelected(item)} className="group overflow-hidden rounded-2xl border border-warm-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="aspect-[16/10] bg-warm-100">{item.imageUrl && <img src={item.imageUrl} alt={item.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-[1.02]"/>}</div><div className="p-5"><span className="rounded-full bg-wood-50 px-2.5 py-1 text-xs font-bold capitalize text-wood-800">{categoryLabels[item.category] || item.category}</span><h2 className="mt-3 font-serif text-xl font-bold text-wood-950">{item.name}</h2><p className="mt-2 flex items-center gap-1.5 text-sm text-warm-600"><MapPin size={15}/>{item.area || item.address}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-warm-700">{item.summary}</p>{item.openingHours && <p className="mt-4 flex items-center gap-2 text-xs text-warm-600"><Clock3 size={14}/>{item.openingHours}</p>}</div></button>)}</div> : <div className="rounded-2xl border border-dashed border-warm-300 bg-white px-6 py-14 text-center"><Compass className="mx-auto h-10 w-10 text-wood-500"/><h2 className="mt-4 text-lg font-bold text-wood-950">{destinations.length ? "Destinasi tidak ditemukan" : "Informasi destinasi sedang disiapkan"}</h2><p className="mx-auto mt-2 max-w-lg text-sm text-warm-600">{destinations.length ? "Coba kata kunci atau kategori lain." : "Pemerintah kelurahan akan menambahkan informasi tempat yang telah dikonfirmasi."}</p></div>}
      {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="destination-title" onClick={()=>setSelected(null)}><div className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl" onClick={(e)=>e.stopPropagation()}><button aria-label="Tutup detail destinasi" onClick={()=>setSelected(null)} className="float-right rounded-lg px-3 py-2 text-sm font-semibold text-wood-800">Tutup</button>{selected.imageUrl&&<img src={selected.imageUrl} alt={selected.name} className="mb-5 aspect-[16/9] w-full rounded-xl object-cover"/>}<p className="text-sm font-semibold capitalize text-wood-700">{categoryLabels[selected.category]}</p><h2 id="destination-title" className="mt-1 font-serif text-2xl font-bold text-wood-950">{selected.name}</h2><p className="mt-2 flex items-center gap-2 text-sm text-warm-600"><MapPin size={16}/>{selected.address}</p><p className="mt-5 leading-7 text-warm-800">{selected.description || selected.summary}</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{selected.openingHours&&<p><b>Jam buka:</b> {selected.openingHours}</p>}{selected.entryFee&&<p><b>Biaya masuk:</b> {selected.entryFee}</p>}{selected.accessibility&&<p><b>Aksesibilitas:</b> {selected.accessibility}</p>}</div>{selected.facilities.length>0&&<p className="mt-4"><b>Fasilitas:</b> {selected.facilities.join(", ")}</p>}{selected.activities.length>0&&<p className="mt-3"><b>Aktivitas:</b> {selected.activities.join(", ")}</p>}{selected.visitorRules&&<p className="mt-3"><b>Catatan kunjungan:</b> {selected.visitorRules}</p>}<div className="mt-6 flex flex-wrap gap-3">{selected.mapsUrl&&<a href={selected.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-wood-900 px-4 py-3 text-sm font-bold text-white">Petunjuk arah <ArrowUpRight size={16}/></a>}{selected.bookingUrl&&<a href={selected.bookingUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-warm-300 px-4 py-3 text-sm font-bold text-wood-900">Reservasi</a>}{selected.contactPhone&&<a href={`https://wa.me/${selected.contactPhone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="rounded-xl border border-warm-300 px-4 py-3 text-sm font-bold text-wood-900">Hubungi pengelola</a>}</div></div></div>}
    </div>
  </section>;
};
