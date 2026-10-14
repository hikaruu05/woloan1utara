import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { RumahPanggung } from '../types';
import { 
  Hammer, Layers, MapPin, CheckCircle2, 
  MessageCircle, ArrowRight, ExternalLink, ChevronLeft, ChevronRight
} from 'lucide-react';

interface RumahPanggungSectionProps {
  onSelectHouse: (house: RumahPanggung) => void;
  onNavigateToFullPage: () => void;
}

export const RumahPanggungSection: React.FC<RumahPanggungSectionProps> = ({
  onSelectHouse,
  onNavigateToFullPage
}) => {
  const { houses } = useData();
  const housesTrackRef = useRef<HTMLDivElement>(null);
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });

  // Show top 6 houses on the home preview section
  const previewHouses = houses.slice(0, 6);

  useEffect(() => {
    const track = housesTrackRef.current;
    if (!track) return;
    const updateEdges = () => setScrollEdges({ left: track.scrollLeft > 4, right: track.scrollWidth - track.clientWidth - track.scrollLeft > 4 });
    updateEdges();
    track.addEventListener('scroll', updateEdges, { passive: true });
    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(track);
    return () => { track.removeEventListener('scroll', updateEdges); resizeObserver.disconnect(); };
  }, [previewHouses.length]);

  const scrollHouses = (direction: -1 | 1) => {
    const track = housesTrackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  const typeLabels: { [key: string]: string } = {
    tradisional: 'Tradisional Walewangko',
    dua_lantai: 'Villa 2 Lantai',
    minimalis: 'Minimalis Tropis',
    villa: 'Cottage / Resor',
    gazebo: 'Gazebo & Bale'
  };

  const getWaLink = (house: RumahPanggung) => {
    const text = encodeURIComponent(
      `Halo ${house.craftsmanName}, saya melihat listing "${house.title}" di Portal Web Kelurahan Woloan 1 Utara. Saya ingin berkonsultasi mengenai pemesanan. Terima kasih.`
    );
    const cleanPhone = house.craftsmanPhone.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <section id="rumah-panggung" className="py-16 lg:py-24 bg-warm-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wood-200/80 text-wood-950 text-xs font-semibold mb-3 border border-wood-300">
              <Hammer className="w-3.5 h-3.5 text-wood-700" />
              <span>Sentra Rumah Kayu Woloan 1 Utara</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wood-950 tracking-tight">
              Katalog Rumah Panggung Kayu Knockdown
            </h2>
            <p className="mt-2 text-warm-700 text-sm sm:text-base max-w-2xl">
              Lihat model rumah, ukuran, bahan, kisaran harga, dan informasi pengrajin yang telah dicantumkan pada setiap listing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {previewHouses.length > 0 && <div className="flex items-center gap-1" aria-label="Kontrol geser katalog rumah">
              <button type="button" onClick={() => scrollHouses(-1)} disabled={!scrollEdges.left} aria-label="Geser ke rumah sebelumnya" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-warm-300 bg-white text-wood-900 transition hover:bg-warm-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={19}/></button>
              <button type="button" onClick={() => scrollHouses(1)} disabled={!scrollEdges.right} aria-label="Geser ke rumah berikutnya" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-warm-300 bg-white text-wood-900 transition hover:bg-warm-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={19}/></button>
            </div>}
            <button
              onClick={onNavigateToFullPage}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-wood-800 hover:bg-wood-900 shadow-warm-sm hover:shadow-warm-md transition-all"
            >
              <span>Buka Halaman Penuh Katalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Listing rumah hanya muncul jika datanya sudah diisi petugas. */}
        {previewHouses.length > 0 ? (
          <div className="relative">
          {scrollEdges.left && <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-7 bg-gradient-to-r from-warm-100 to-transparent"/>}
          {scrollEdges.right && <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-10 bg-gradient-to-l from-warm-100 to-transparent"/>}
          <div ref={housesTrackRef} role="region" aria-label="Katalog rumah panggung" tabIndex={0} className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-1 pb-5 pr-10 scroll-smooth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-700 no-scrollbar">
            {previewHouses.map((house) => (
            <div
              key={house.id}
              className="w-[min(86vw,360px)] shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-wood-200/90 shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col group"
            >
              {/* Image Container with Badges */}
              <div
                className="relative aspect-[16/10] overflow-hidden bg-wood-100 cursor-pointer"
                onClick={() => onSelectHouse(house)}
              >
                {house.imageUrl ? <img
                  src={house.imageUrl}
                  alt={house.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                /> : <div className="flex h-full items-center justify-center text-wood-600"><Hammer className="h-10 w-10"/></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-wood-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-wood-900/80 backdrop-blur-md text-amber-300 border border-wood-700">
                    {typeLabels[house.type] || house.type}
                  </span>
                  {house.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-900/80 backdrop-blur-md text-forest-200 border border-forest-600">
                      <CheckCircle2 className="w-3 h-3 text-forest-400" />
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-900/80 backdrop-blur-md text-amber-200 border border-amber-600">
                      Belum diverifikasi
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    {house.dimensions}
                  </span>
                  <span className="bg-amber-500 text-wood-950 px-2 py-1 rounded font-bold">
                    Detail Spek
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-warm-600 mb-1.5">
                    <Hammer className="w-3.5 h-3.5 text-wood-600 shrink-0" />
                    <span className="font-semibold text-warm-900 line-clamp-1">{house.craftsmanName}</span>
                  </div>

                  <button type="button"
                    onClick={() => onSelectHouse(house)}
                    className="w-full text-left font-serif font-bold text-base sm:text-lg text-wood-950 group-hover:text-wood-700 transition-colors line-clamp-2 leading-snug"
                  >
                    {house.title}
                  </button>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-1.5 my-3 py-2.5 px-3 rounded-xl bg-warm-50 border border-warm-200 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-warm-500 block">Dimensi</span>
                      <strong className="text-warm-900 font-semibold">{house.dimensions}</strong>
                    </div>
                    <div className="border-x border-warm-200">
                      <span className="text-[10px] text-warm-500 block">Kamar</span>
                      <strong className="text-warm-900 font-semibold">{house.bedrooms || '-'} KT</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-warm-500 block">Lantai</span>
                      <strong className="text-warm-900 font-semibold">{house.floors} Lt</strong>
                    </div>
                  </div>

                  {/* Address & Google Maps link */}
                  <div className="flex items-center justify-between text-[11px] text-warm-600 mb-4 pt-1">
                    <div className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin className="w-3 h-3 text-warm-400 shrink-0" />
                      <span className="truncate">{house.craftsmanAddress}</span>
                    </div>
                    {house.mapsUrl && (
                      <a
                        href={house.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-forest-700 hover:text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 shrink-0"
                        title="Buka titik lokasi di Google Maps"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Maps</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-warm-200">
                  <div className="mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-warm-500 block">
                      Estimasi Biaya:
                    </span>
                    <span className="font-serif text-base sm:text-lg font-bold text-wood-900">
                      {house.priceEstimated}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectHouse(house)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-wood-900 bg-warm-100 hover:bg-wood-100 border border-wood-300 transition-colors text-center ${house.craftsmanPhone ? "" : "col-span-2"}`}
                    >
                      Detail Spek
                    </button>

                    {house.craftsmanPhone && <a
                      href={getWaLink(house)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-forest-200" />
                      <span>Tanya WA</span>
                    </a>}
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">{scrollEdges.right ? 'Geser mendatar atau gunakan tombol panah untuk melihat rumah lainnya.' : 'Akhir daftar rumah panggung.'}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-wood-300 bg-white/70 px-6 py-10 text-center">
            <Hammer className="w-9 h-9 mx-auto text-wood-600 mb-3" />
            <h3 className="font-serif text-lg font-bold text-wood-950">
              Katalog rumah panggung sedang disiapkan
            </h3>
            <p className="mt-2 text-sm text-warm-700">
              Informasi rumah akan ditampilkan setelah diperbarui dan diverifikasi oleh kelurahan.
            </p>
          </div>
        )}

        {/* Bottom CTA to dedicated page */}
        <div className="mt-12 text-center bg-white rounded-3xl p-8 border border-wood-200 shadow-warm-sm">
          <h3 className="font-serif text-xl font-bold text-wood-950 mb-2">
            Ingin Melihat Lebih Banyak Model & Simulasi Biaya Lengkap?
          </h3>
          <p className="text-xs sm:text-sm text-warm-600 max-w-xl mx-auto mb-5">
            Kunjungi halaman khusus Katalog Rumah Panggung Woloan 1 Utara dengan filter komprehensif, 
            paginasi 10 produk per halaman, dan kalkulator estimasi biaya.
          </p>
          <button
            onClick={onNavigateToFullPage}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-wood-800 hover:bg-wood-900 shadow-warm-md hover:scale-105 transition-all"
          >
            <span>Buka Halaman Katalog Rumah Panggung (Lengkap)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
