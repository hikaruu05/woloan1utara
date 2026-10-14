import React from "react";
import { ArrowRight, Compass, Hammer, Store } from "lucide-react";

const categories = [
  { id:"katalog-rumah", title:"Rumah Panggung", description:"Model, spesifikasi, kisaran harga, dan kontak pengrajin.", icon:Hammer, tone:"bg-red-50 text-red-900 border-red-100" },
  { id:"katalog-umkm", title:"UMKM & Produk", description:"Temukan toko warga, produk, lokasi, dan kontak penjual.", icon:Store, tone:"bg-orange-50 text-orange-950 border-orange-100" },
  { id:"katalog-destinasi", title:"Destinasi Wisata", description:"Lihat tempat menarik beserta informasi kunjungannya.", icon:Compass, tone:"bg-amber-50 text-amber-950 border-amber-100" },
];

export const CatalogShortcuts: React.FC<{onNavigate:(page:string)=>void}> = ({onNavigate}) => (
  <section id="jelajahi-katalog" className="scroll-mt-24 bg-white px-4 py-12 sm:px-6 lg:py-16">
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 max-w-2xl"><p className="text-sm font-bold uppercase tracking-wider text-orange-800">Jelajahi</p><h2 className="mt-2 font-serif text-2xl font-bold text-wood-950 sm:text-3xl">Apa yang ingin Anda temukan?</h2><p className="mt-2 text-sm leading-6 text-warm-700">Pilih katalog untuk melihat informasi dan menghubungi pengelola atau pemiliknya.</p></div>
      <div className="grid gap-4 md:grid-cols-3">{categories.map(({id,title,description,icon:Icon,tone})=><button key={id} onClick={()=>onNavigate(id)} className="group flex min-h-44 flex-col rounded-2xl border border-warm-200 bg-warm-50 p-5 text-left transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 sm:p-6"><span className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${tone}`}><Icon size={21}/></span><span className="flex w-full items-center justify-between font-serif text-lg font-bold text-wood-950">{title}<ArrowRight size={17} className="text-orange-800 transition-transform group-hover:translate-x-1"/></span><span className="mt-2 text-sm leading-6 text-warm-700">{description}</span></button>)}</div>
    </div>
  </section>
);
