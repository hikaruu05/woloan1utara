import React from "react";
import { ArrowDown, ArrowRight, Compass } from "lucide-react";
import heroImage from "../assets/hero.png";

interface HeroProps { onNavigate: (sectionId: string) => void }

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => (
  <section className="bg-gradient-to-b from-orange-50 to-warm-50 px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:py-16">
    <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
      <div>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-orange-900"><Compass size={15}/> Portal Woloan 1 Utara</p>
        <h1 className="max-w-2xl font-serif text-4xl font-bold leading-[1.08] tracking-tight text-wood-950 sm:text-5xl lg:text-6xl">Kenali Woloan, temukan yang Anda cari.</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-warm-700 sm:text-lg">Jelajahi rumah panggung, usaha warga, dan destinasi di Kelurahan Woloan 1 Utara. Informasi katalog ditambahkan dan diperbarui oleh petugas kelurahan.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button onClick={()=>onNavigate("katalog-destinasi")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-wood-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-wood-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-700">Jelajahi Destinasi <ArrowRight size={17}/></button>
          <button onClick={()=>onNavigate("jelajahi-katalog")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-warm-300 bg-white px-5 py-3 text-sm font-bold text-wood-900 transition hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-700">Lihat Semua Katalog <ArrowDown size={16}/></button>
        </div>
        <div className="mt-8 flex items-center gap-2 text-sm text-warm-600"><span className="h-2 w-2 rounded-full bg-orange-500"/> Informasi resmi dikelola oleh petugas kelurahan</div>
      </div>
      <div className="relative">
        <div className="overflow-hidden rounded-3xl border border-white shadow-xl">
          <img src={heroImage} alt="Rumah panggung kayu khas Woloan" className="aspect-[4/3] w-full object-cover" fetchPriority="high"/>
        </div>
        <div className="absolute -bottom-4 left-4 right-4 rounded-2xl border border-warm-200 bg-white p-4 shadow-lg sm:left-8 sm:right-8 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-800">Jelajahi tiga kategori</p>
          <p className="mt-1 text-sm text-warm-700">Rumah panggung • UMKM • Destinasi wisata</p>
        </div>
      </div>
    </div>
  </section>
);
