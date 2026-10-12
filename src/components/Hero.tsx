import React from 'react';
import { Hammer, Store, ArrowRight, ShieldCheck, Globe, Sparkles, PlusCircle } from 'lucide-react';
import { VILLAGE_STATS } from '../data/mockData';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenUpload: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenUpload }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-14 lg:pt-12 lg:pb-20">
      {/* Background Decor & Atmospheric Elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-warm-100/90 via-warm-50 to-warm-100/50" />
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-wood-200/25 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-forest-200/25 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wood-100 border border-wood-300 text-wood-950 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Sentra Rumah Panggung Minahasa Terbesar di Dunia</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-wood-950 tracking-tight leading-[1.12]">
              Mahakarya Kayu Minahasa & Denyut UMKM{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-wood-800 via-amber-700 to-wood-900">
                Woloan 1 Utara
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base lg:text-lg text-warm-700 leading-relaxed font-normal max-w-2xl">
              Selamat datang di portal resmi Kelurahan Woloan Satu Utara, Kecamatan Tomohon Barat. 
              Rumah bagi perajin rumah kayu panggung knockdown tahan gempa yang telah diekspor ke berbagai benua, 
              serta etalase digital bagi pelaku UMKM kuliner legendaris, kerajinan tangan, dan hasil tani warga.
            </p>

            {/* Key feature pills */}
            <div className="flex flex-wrap gap-2 text-xs font-medium text-warm-800 pt-1">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-warm-200 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                Kayu Aliwowos & Cempaka Wasian
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-warm-200 shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-wood-700" />
                Konstruksi Knockdown Tahan Gempa
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-warm-200 shadow-2xs">
                <Store className="w-3.5 h-3.5 text-amber-700" />
                Direktori UMKM & Titik Google Maps
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('katalog-rumah')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-wood-800 hover:bg-wood-900 shadow-warm-sm hover:shadow-warm-md hover:-translate-y-0.5 active:translate-y-0 transition-all text-xs sm:text-sm border border-amber-600/30"
              >
                <Hammer className="w-4 h-4 text-amber-300" />
                <span>Katalog Rumah Panggung</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('katalog-umkm')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-forest-950 bg-forest-50 hover:bg-forest-100 border border-forest-300 shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all text-xs sm:text-sm"
              >
                <Store className="w-4 h-4 text-forest-700" />
                <span>Direktori Toko UMKM</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenUpload}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-wood-900 bg-white hover:bg-warm-100 border border-wood-300 transition-all text-xs sm:text-sm shadow-2xs"
              >
                <PlusCircle className="w-4 h-4 text-amber-700" />
                <span>Daftarkan Usaha</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Card Gallery */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white aspect-[4/3] group bg-wood-200">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
                  alt="Rumah Panggung Kayu Tradisional Minahasa Woloan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wood-950/85 via-wood-950/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-wood-950 mb-1">
                    Arsitektur Walewangko
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold leading-tight">
                    Kekuatan Kayu Aliwowos & Keindahan Ukiran Minahasa
                  </h3>
                  <p className="text-xs text-wood-200 mt-1 line-clamp-2">
                    Dibuat presisi oleh tangan dingin maestro perajin kayu Woloan Satu Utara.
                  </p>
                </div>
              </div>

              {/* Floating Small Card 1: UMKM Highlight (Desktop & Tablet) */}
              <div className="hidden sm:flex absolute -bottom-5 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-warm-lg border border-wood-200/90 items-center gap-3 max-w-[240px]">
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-warm-100">
                  <img
                    src="https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=300&q=80"
                    alt="Klappertaart Asli Tomohon"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-1.5 py-0.2 rounded">
                    Kuliner Khas
                  </span>
                  <p className="text-xs font-bold text-warm-900 line-clamp-1 mt-0.5">Klappertaart & Souvenir</p>
                  <p className="text-[10px] text-warm-600">Etalase Toko Warga</p>
                </div>
              </div>

              {/* Floating Small Card 2: Export Quality */}
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-wood-950/95 backdrop-blur-md text-white rounded-2xl px-3.5 py-2.5 shadow-warm-lg border border-wood-700 items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  <Globe className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-300 leading-none">Ekspor Mancanegara</p>
                  <p className="text-[10px] text-wood-300 mt-0.5 leading-none">18+ Negara Pelanggan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 pt-8 border-t border-wood-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {VILLAGE_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-wood-200/80 shadow-warm-sm hover:shadow-warm-md transition-all group"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-wood-900 group-hover:text-amber-700 transition-colors">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                    Aktif
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-warm-900 mt-1.5">{stat.label}</h4>
                <p className="text-[11px] text-warm-600 mt-1 leading-snug line-clamp-2">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
