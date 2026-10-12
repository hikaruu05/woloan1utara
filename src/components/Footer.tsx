import React from 'react';
import { Hammer, Heart, RefreshCw, MapPin, Phone, Mail, GraduationCap } from 'lucide-react';
import { useData } from '../context/DataContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenUpload: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenUpload }) => {
  const { resetToDefault } = useData();

  return (
    <footer className="bg-wood-950 text-wood-200 border-t border-wood-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-wood-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-wood-800 text-amber-300 flex items-center justify-center border border-wood-700">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white tracking-tight">
                  Woloan 1 Utara
                </h3>
                <p className="text-xs text-wood-400">
                  Kecamatan Tomohon Barat • Kota Tomohon, Sulawesi Utara
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-wood-300 leading-relaxed max-w-sm">
              Sentra industri rumah panggung kayu knockdown tradisional Minahasa yang mendunia, 
              serta direktori digital berbasis toko bagi seluruh pelaku UMKM warga lokal.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300/90 font-medium">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Program KKT Mahasiswa 2026</span>
            </div>
          </div>

          {/* Quick Links 1: Profil & Keistimewaan */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4">
              Informasi Kelurahan
            </h4>
            <ul className="space-y-2.5 text-xs text-wood-300">
              <li>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Beranda Utama
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profil')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Profil & Visi Misi Kelurahan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('speciality')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Keistimewaan & Jenis Kayu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('kalkulator')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Simulasi Biaya Rumah Panggung
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('kontak')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Peta Lokasi & Kontak Resmi
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links 2: Direktori Usaha */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4">
              Halaman Khusus
            </h4>
            <ul className="space-y-2.5 text-xs text-wood-300">
              <li>
                <button
                  onClick={() => onNavigate('katalog-rumah')}
                  className="hover:text-amber-300 transition-colors text-left font-medium"
                >
                  🏡 Halaman Katalog Rumah Panggung
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('katalog-umkm')}
                  className="hover:text-amber-300 transition-colors text-left font-medium"
                >
                  🛍️ Halaman Direktori Toko UMKM
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenUpload}
                  className="text-amber-400 font-bold hover:text-amber-300 transition-colors"
                >
                  + Upload Toko / Rumah Baru
                </button>
              </li>
            </ul>
          </div>

          {/* Kontak & Reset Option */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4">
              Layanan Warga
            </h4>
            <div className="space-y-2.5 text-xs text-wood-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Jl. Raya Woloan, Kec. Tomohon Barat, Tomohon 95431</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>0812-4411-XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">woloan1utara@tomohon.go.id</span>
              </div>
            </div>

            {/* Reset data helper */}
            <div className="mt-5 pt-4 border-t border-wood-800">
              <button
                onClick={resetToDefault}
                className="inline-flex items-center gap-1.5 text-[11px] text-wood-400 hover:text-amber-300 transition-colors"
                title="Pulihkan data listing ke versi bawaan awal"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Data Katalog Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-wood-400">
          <p>© {new Date().getFullYear()} Pemerintah Kelurahan Woloan Satu Utara, Tomohon Barat.</p>
          <p className="flex items-center gap-1">
            <span>Dikembangkan dengan</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />
            <span>untuk Pengabdian Mahasiswa KKT 2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
