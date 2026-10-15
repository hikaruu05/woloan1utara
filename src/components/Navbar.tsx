import React, { useEffect, useState } from "react";
import { Compass, Hammer, Home, Info, LockKeyhole, MapPin, Menu, Store, UserRound, X } from "lucide-react";

interface NavbarProps { currentPage:string; onNavigate:(pageId:string)=>void }
const navItems = [
  {id:"beranda",label:"Beranda",icon:Home},
  {id:"katalog-rumah",label:"Rumah Panggung",icon:Hammer},
  {id:"katalog-umkm",label:"UMKM & Produk",icon:Store},
  {id:"katalog-destinasi",label:"Destinasi Wisata",icon:Compass},
  {id:"profil",label:"Profil",icon:Info},
  {id:"kontak",label:"Kontak & Peta",icon:MapPin},
];

export const Navbar:React.FC<NavbarProps> = ({currentPage,onNavigate}) => {
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>12);window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll);},[]);
  const navigate=(id:string)=>{onNavigate(id);setOpen(false);};
  const active=(id:string)=>id===currentPage || (id==="beranda"&&currentPage==="beranda");
  return <header className={`sticky top-0 z-40 border-t-[3px] border-t-brand-600 border-b border-warm-200/80 transition-shadow ${scrolled?"bg-white/95 shadow-sm backdrop-blur":"bg-warm-50/95 backdrop-blur"}`}>
    <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <button onClick={()=>navigate("beranda")} className="flex min-w-0 items-center gap-2.5 text-left" aria-label="Beranda Woloan 1 Utara">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-warm-sm"><Hammer size={19}/></span>
        <span className="min-w-0"><span className="block truncate font-serif text-base font-bold leading-tight text-wood-950 sm:text-lg">Woloan 1 Utara</span><span className="mt-0.5 block truncate text-[11px] text-warm-600">Tomohon Barat, Kota Tomohon</span></span>
      </button>
      <nav aria-label="Navigasi utama" className="hidden xl:flex items-center gap-0.5">
        {navItems.map(item=><button key={item.id} onClick={()=>navigate(item.id)} aria-current={active(item.id)?"page":undefined} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${active(item.id)?"bg-brand-50 text-brand-700":"text-warm-700 hover:bg-warm-100 hover:text-wood-950"}`}><item.icon size={14}/>{item.label}</button>)}
      </nav>
      <button onClick={()=>navigate("admin")} className="hidden shrink-0 items-center gap-2 rounded-xl border border-wood-300 bg-white px-3 py-2.5 text-xs font-bold text-wood-900 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-700 xl:inline-flex"><LockKeyhole size={15}/>Masuk Admin</button>
      <button onClick={()=>navigate("mitra")} className="hidden shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-700 xl:inline-flex"><UserRound size={15}/>Masuk Mitra</button>
      <button onClick={()=>setOpen(value=>!value)} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-warm-300 bg-white text-wood-900 xl:hidden" aria-label={open?"Tutup menu":"Buka menu"} aria-expanded={open} aria-controls="mobile-navigation">{open?<X size={20}/>:<Menu size={20}/>}</button>
    </div>
    {open&&<nav id="mobile-navigation" aria-label="Navigasi ponsel" className="border-t border-warm-200 bg-white px-4 pb-5 pt-3 shadow-lg xl:hidden"><div className="mx-auto max-w-7xl space-y-1">{navItems.map(item=><button key={item.id} onClick={()=>navigate(item.id)} aria-current={active(item.id)?"page":undefined} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold ${active(item.id)?"bg-brand-50 text-brand-700":"text-warm-800 hover:bg-warm-50"}`}><item.icon size={17}/>{item.label}</button>)}<button onClick={()=>navigate("speciality")} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-warm-800 hover:bg-warm-50"><Info size={17}/>Keistimewaan Woloan</button><button onClick={()=>navigate("kalkulator")} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-warm-800 hover:bg-warm-50"><Hammer size={17}/>Simulasi Biaya Rumah</button><div className="grid gap-2 border-t border-warm-200 pt-3 sm:grid-cols-2"><button onClick={()=>navigate("mitra")} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white"><UserRound size={16}/>Masuk Mitra Usaha</button><button onClick={()=>navigate("admin")} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-warm-300 bg-white text-sm font-bold text-wood-900"><LockKeyhole size={16}/>Masuk Admin</button></div></div></nav>}
  </header>;
};
