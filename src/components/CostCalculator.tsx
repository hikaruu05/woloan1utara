import React, { useState } from "react";
import { ArrowRight, Calculator, Info } from "lucide-react";

export const CostCalculator: React.FC = () => {
  const [length,setLength]=useState(10);
  const [width,setWidth]=useState(8);
  const [floors,setFloors]=useState(1);
  const area=length*width*floors;
  const presets=[{length:6,width:8,label:"6 × 8 m"},{length:8,width:10,label:"8 × 10 m"},{length:9,width:12,label:"9 × 12 m"},{length:4,width:4,label:"4 × 4 m"}];

  return <section id="kalkulator" className="scroll-mt-24 border-t border-warm-200 bg-orange-50/60 py-14 sm:py-16 lg:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-9 max-w-2xl"><p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-800"><Calculator size={16}/> Alat bantu perencanaan</p><h2 className="mt-2 font-serif text-3xl font-bold text-wood-950 sm:text-4xl">Hitung perkiraan luas rumah</h2><p className="mt-3 text-sm leading-6 text-warm-700">Atur ukuran bangunan untuk mendapatkan luas lantai. Harga dan waktu pengerjaan perlu dikonfirmasi langsung dengan pengrajin.</p></div>
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-warm-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            {[{label:"Panjang bangunan",value:length,set:setLength,min:4,max:18},{label:"Lebar bangunan",value:width,set:setWidth,min:4,max:14}].map(field=><label key={field.label} className="block text-sm font-semibold text-warm-800">{field.label}<span className="ml-2 font-bold text-wood-800">{field.value} m</span><input aria-label={`${field.label} dalam meter`} type="range" min={field.min} max={field.max} value={field.value} onChange={e=>field.set(Number(e.target.value))} className="mt-4 block w-full accent-orange-700"/><span className="mt-1 flex justify-between text-xs font-normal text-warm-500"><span>{field.min} m</span><span>{field.max} m</span></span></label>)}
          </div>
          <div className="mt-6"><p className="mb-2 text-sm font-semibold text-warm-800">Pilih jumlah lantai</p><div className="grid gap-3 sm:grid-cols-2">{[1,2].map(value=><label key={value} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${floors===value?"border-orange-400 bg-orange-50 text-wood-950":"border-warm-200 bg-white text-warm-700"}`}><input type="radio" name="floors" value={value} checked={floors===value} onChange={()=>setFloors(value)} className="accent-orange-700"/>{value} lantai</label>)}</div></div>
          <div className="mt-6"><p className="mb-2 text-sm font-semibold text-warm-800">Ukuran cepat</p><div className="flex flex-wrap gap-2">{presets.map(preset=><button key={preset.label} type="button" onClick={()=>{setLength(preset.length);setWidth(preset.width);}} className={`min-h-10 rounded-lg border px-3 text-xs font-semibold ${length===preset.length&&width===preset.width?"border-orange-500 bg-orange-100 text-wood-950":"border-warm-200 bg-white text-warm-700 hover:bg-warm-50"}`}>{preset.label}</button>)}</div></div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl bg-wood-950 p-6 text-white shadow-md sm:p-8"><div><p className="text-sm font-bold text-orange-200">Luas perkiraan</p><p aria-live="polite" className="mt-2 font-serif text-5xl font-bold">{area}<span className="ml-2 text-xl font-semibold text-warm-200">m²</span></p><p className="mt-3 text-sm text-warm-200">{length} m × {width} m × {floors} lantai</p></div><div className="mt-8 rounded-xl border border-white/15 bg-white/5 p-4"><p className="flex items-start gap-2 text-sm leading-6 text-warm-100"><Info size={17} className="mt-0.5 shrink-0 text-orange-200"/>Hasil ini hanya menghitung luas. Biaya bahan, desain, pengiriman, dan pemasangan belum dihitung.</p></div><button onClick={()=>{window.location.hash="/katalog-rumah";window.scrollTo({top:0,behavior:"smooth"});}} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-300 px-4 py-3 text-sm font-bold text-wood-950 transition hover:bg-orange-200">Lihat rumah dan pengrajin <ArrowRight size={17}/></button></div>
      </div>
    </div>
  </section>;
};
