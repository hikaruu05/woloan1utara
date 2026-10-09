import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  PlusCircle,
  Home,
  Hammer,
  Store,
  Info,
  Phone,
  Calculator,
  Sparkles,
  MapPin,
} from "lucide-react";

interface NavbarProps {
  onOpenUpload: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  activeSection,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "beranda", label: "Beranda", icon: Home },
    { id: "profil", label: "Profil Kelurahan", icon: Info },
    { id: "speciality", label: "Keistimewaan Woloan", icon: Sparkles },
    { id: "rumah-panggung", label: "Rumah Panggung", icon: Hammer },
    { id: "umkm", label: "UMKM Lokal", icon: Store },
    { id: "kalkulator", label: "Simulasi Biaya", icon: Calculator },
    { id: "kontak", label: "Lokasi & Kontak", icon: MapPin },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner Notice */}
      <div className="bg-wood-900 text-wood-100 text-xs px-4 py-1.5 font-medium border-b border-wood-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              PROGRAM KKT 2026
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-wood-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Kec. Tomohon Barat, Kota Tomohon, Sulawesi Utara
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-forest-400" />
              Pelayanan Warga: 0812-4411-XXXX
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-warm-md border-b border-wood-200/80 py-3"
            : "bg-warm-50/90 backdrop-blur-sm border-b border-warm-200/50 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Identity */}
          <button
            onClick={() => handleNavClick("beranda")}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-wood-700 via-wood-600 to-wood-800 flex items-center justify-center text-white shadow-warm-sm group-hover:scale-105 transition-transform duration-300 border border-wood-500/40">
              <Hammer className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg md:text-xl text-wood-950 tracking-tight leading-tight">
                  Woloan 1 Utara
                </span>
              </div>
              <p className="text-xs text-warm-600 font-medium tracking-wide">
                Kecamatan Tomohon Barat • Kota Tomohon
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-wood-100 text-wood-900 font-semibold shadow-xs"
                      : "text-warm-700 hover:text-wood-900 hover:bg-warm-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-wood-700 via-wood-600 to-wood-800 hover:from-wood-800 hover:to-wood-900 shadow-warm-sm hover:shadow-warm-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-amber-600/30"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Upload Rumah / UMKM</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenUpload}
              className="p-2 rounded-lg bg-wood-100 text-wood-800 hover:bg-wood-200 text-xs font-semibold flex items-center gap-1.5 sm:hidden"
            >
              <PlusCircle className="w-4 h-4 text-wood-700" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-warm-100 text-warm-800 hover:bg-warm-200 transition-colors focus:outline-none"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
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
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                    isActive
                      ? "bg-wood-100 text-wood-950 font-semibold"
                      : "text-warm-700 hover:bg-warm-100 hover:text-wood-900"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-wood-700" : "text-warm-500"}`}
                  />
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-wood-700 to-wood-800 shadow-warm-md"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>+ Pasang Rumah Panggung / Produk UMKM</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
