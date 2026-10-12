import React, { useState, useEffect } from 'react';
import { Menu, X, PlusCircle, Home, Hammer, Store, Info, Phone, Calculator, Sparkles, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
  currentPage: string;
  onNavigate: (pageId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUpload, currentPage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'profil', label: 'Profil Desa', icon: Info },
    { id: 'speciality', label: 'Keistimewaan', icon: Sparkles },
    { id: 'katalog-rumah', label: 'Rumah Panggung', icon: Hammer },
    { id: 'katalog-umkm', label: 'Toko UMKM', icon: Store },
    { id: 'kalkulator', label: 'Simulasi Biaya', icon: Calculator },
    { id: 'kontak', label: 'Kontak & Peta', icon: MapPin },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Banner Notice */}
      <div className="bg-wood-950 text-wood-100 text-[11px] sm:text-xs px-4 py-1.5 font-medium border-b border-wood-900/80">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              PROGRAM KKT 2026
            </span>
            <span className="truncate">Kelurahan Woloan Satu Utara • Tomohon Barat, Sulawesi Utara</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-wood-300 text-[11px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Sentra Rumah Kayu Dunia
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-forest-400" />
              Layanan Warga: 0812-4411-XXXX
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-warm-md border-b border-wood-200/80 py-2.5'
            : 'bg-warm-50/95 backdrop-blur-sm border-b border-warm-200/60 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 text-left group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wood-800 via-wood-700 to-wood-900 flex items-center justify-center text-white shadow-warm-sm group-hover:scale-105 transition-transform duration-200 border border-wood-600/40">
              <Hammer className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base sm:text-lg text-wood-950 tracking-tight leading-none">
                  Woloan 1 Utara
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-forest-100 text-forest-800 border border-forest-200">
                  Desa Wisata
                </span>
              </div>
              <p className="text-[11px] text-warm-600 font-medium tracking-wide mt-0.5">
                Tomohon Barat, Kota Tomohon
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-wood-800 text-white shadow-warm-sm font-bold'
                      : 'text-warm-700 hover:text-wood-950 hover:bg-warm-100/80'
                  }`}
                >
                  <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-warm-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-wood-800 via-wood-700 to-wood-900 hover:from-wood-900 hover:to-wood-950 shadow-warm-sm hover:shadow-warm-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-amber-600/30"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>+ Pasang Usaha / Rumah</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenUpload}
              className="px-3 py-1.5 rounded-lg bg-wood-800 text-white text-xs font-bold flex items-center gap-1 sm:hidden shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-warm-100 text-warm-800 hover:bg-warm-200 transition-colors focus:outline-none"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-wood-200 shadow-warm-lg px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-wood-800 text-white font-bold'
                      : 'text-warm-700 hover:bg-warm-100 hover:text-wood-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-warm-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-warm-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenUpload();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-wood-800 to-wood-900 shadow-warm-md"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>+ Daftarkan Usaha Toko / Rumah Panggung</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
