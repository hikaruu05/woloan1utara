import React, { useEffect, useRef, useState } from "react";
import { Compass, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useData } from "../context/DataContext";

const categoryLabels: Record<string, string> = {
  alam: "Wisata alam", budaya: "Budaya", sejarah: "Sejarah dan warisan", kuliner: "Wisata kuliner",
  edukasi: "Wisata edukasi", religi: "Wisata religi", agrowisata: "Agrowisata", kerajinan: "Kerajinan lokal", lainnya: "Lainnya",
};

export const DestinationsSection: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
  const { destinations, catalogLoading } = useData();
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });
  const featured = destinations.slice(0, 6);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const updateEdges = () => setScrollEdges({ left: track.scrollLeft > 4, right: track.scrollWidth - track.clientWidth - track.scrollLeft > 4 });
    updateEdges();
    track.addEventListener("scroll", updateEdges, { passive: true });
    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(track);
    return () => { track.removeEventListener("scroll", updateEdges); resizeObserver.disconnect(); };
  }, [featured.length]);

  const scrollDestinations = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return <section className="bg-white px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-wood-700"><Compass size={17}/> Jelajahi Woloan</p><h2 className="mt-2 font-serif text-3xl font-bold text-wood-950">Destinasi Wisata</h2><p className="mt-2 max-w-2xl text-warm-700">Tempat menarik dan pengalaman lokal yang dapat Anda kunjungi.</p></div>
      <div className="flex flex-wrap items-center gap-2.5">
        {featured.length > 0 && <div className="flex items-center gap-1" aria-label="Kontrol geser destinasi"><button type="button" onClick={() => scrollDestinations(-1)} disabled={!scrollEdges.left} aria-label="Geser ke destinasi sebelumnya" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-warm-300 bg-white text-wood-900 transition hover:bg-warm-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={19}/></button><button type="button" onClick={() => scrollDestinations(1)} disabled={!scrollEdges.right} aria-label="Geser ke destinasi berikutnya" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-warm-300 bg-white text-wood-900 transition hover:bg-warm-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={19}/></button></div>}
        <button onClick={onNavigate} className="inline-flex items-center gap-2 rounded-xl border border-wood-300 px-4 py-2.5 text-sm font-bold text-wood-900">Jelajahi destinasi <ArrowRight size={16}/></button>
      </div>
    </div>
    {catalogLoading ? <p className="rounded-xl bg-warm-50 p-6 text-center text-sm text-warm-600">Memuat informasi destinasi…</p> : featured.length ? <div className="relative">
      {scrollEdges.left && <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-7 bg-gradient-to-r from-white to-transparent"/>}
      {scrollEdges.right && <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-10 bg-gradient-to-l from-white to-transparent"/>}
      <div ref={trackRef} role="region" aria-label="Katalog destinasi wisata" tabIndex={0} className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-1 pb-5 pr-10 scroll-smooth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-700 no-scrollbar">
        {featured.map(item => <button key={item.id} onClick={onNavigate} className="group w-[min(86vw,360px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-warm-200 bg-warm-50 text-left transition hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-700">
          <div className="aspect-[16/9] bg-warm-100">{item.imageUrl && <img loading="lazy" src={item.imageUrl} alt={item.name} className="h-full w-full object-cover transition group-hover:scale-[1.02]"/>}</div>
          <div className="p-5"><span className="inline-flex rounded-full bg-wood-100 px-2.5 py-1 text-xs font-bold text-wood-800">{categoryLabels[item.category]||item.category}</span><h3 className="mt-3 font-serif text-xl font-bold text-wood-950">{item.name}</h3><p className="mt-2 flex items-center gap-1.5 text-sm text-warm-600"><MapPin size={14}/>{item.area||item.address}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-warm-700">{item.summary}</p></div>
        </button>)}
      </div>
      <p className="sr-only" aria-live="polite">{scrollEdges.right ? "Geser mendatar atau gunakan tombol panah untuk melihat destinasi lainnya." : "Akhir daftar destinasi."}</p>
    </div> : <div className="rounded-2xl border border-dashed border-warm-300 bg-warm-50 px-6 py-9 text-center"><p className="font-semibold text-wood-900">Informasi destinasi sedang disiapkan.</p><p className="mt-1 text-sm text-warm-600">Kami akan menampilkan tempat yang telah dikonfirmasi oleh pengelola.</p></div>}
  </div></section>;
};
