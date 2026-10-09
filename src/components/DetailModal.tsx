import React from 'react';
import { RumahPanggung, ProductUMKM } from '../types';
import { 
  X, Hammer, Store, MapPin, 
  MessageCircle, CheckCircle2, Copy 
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface DetailModalProps {
  item: RumahPanggung | ProductUMKM | null;
  type: 'house' | 'umkm' | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, type, onClose }) => {
  const { showToast } = useData();

  if (!item || !type) return null;

  const isHouse = type === 'house';
  const house = isHouse ? (item as RumahPanggung) : null;
  const umkm = !isHouse ? (item as ProductUMKM) : null;

  const getWaLink = () => {
    if (isHouse && house) {
      const text = encodeURIComponent(
        `Halo ${house.craftsmanName},\nSaya ingin berkonsultasi mengenai rumah panggung "${house.title}" yang saya temukan di Web Kelurahan Woloan 1 Utara.\n\nSpesifikasi yang saya tanyakan:\n- Dimensi: ${house.dimensions}\n- Bahan Kayu: ${house.woodTypes.join(', ')}\n- Estimasi Harga: ${house.priceEstimated}\n\nApakah model ini masih tersedia atau bisa dibuat kustom? Terima kasih.`
      );
      const cleanPhone = house.craftsmanPhone.replace(/[^0-9]/g, '');
      const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      return `https://wa.me/${phone}?text=${text}`;
    } else if (umkm) {
      const text = encodeURIComponent(
        `Halo ${umkm.businessName},\nSaya tertarik dengan produk "${umkm.name}" (${umkm.price}) dari etalase UMKM Web Kelurahan Woloan 1 Utara. Bagaimana proses pemesanan dan pengirimannya? Terima kasih.`
      );
      const cleanPhone = umkm.phone.replace(/[^0-9]/g, '');
      const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      return `https://wa.me/${phone}?text=${text}`;
    }
    return '#';
  };

  const copyDetails = () => {
    const text = isHouse && house 
      ? `${house.title} - Pengrajin: ${house.craftsmanName} (${house.priceEstimated}). Kontak: ${house.craftsmanPhone}`
      : `${umkm?.name} - Toko: ${umkm?.businessName} (${umkm?.price}). Kontak: ${umkm?.phone}`;
    
    navigator.clipboard?.writeText(text);
    showToast('Tautan Disalin', 'Rincian produk dan kontak telah disalin ke clipboard Anda.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-warm-lg border border-wood-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="bg-wood-900 text-white px-6 py-4 flex items-center justify-between border-b border-wood-800">
          <div className="flex items-center gap-2">
            {isHouse ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Hammer className="w-3.5 h-3.5" />
                Spesifikasi Rumah Panggung
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Store className="w-3.5 h-3.5" />
                Detail Produk UMKM
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-wood-800 hover:bg-wood-700 text-wood-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Main Visual */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-wood-100 border border-warm-200">
            <img
              src={item.imageUrl}
              alt={isHouse ? house?.title : umkm?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 flex gap-2">
              {item.isVerified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-forest-900/90 text-forest-200 backdrop-blur-md border border-forest-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-400" />
                  Karya Terdaftar Kelurahan Woloan 1 Utara
                </span>
              )}
            </div>
          </div>

          {/* Details for Rumah Panggung */}
          {isHouse && house && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-wood-700">
                  {house.craftsmanName}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wood-950 mt-1 leading-tight">
                  {house.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-warm-600 mt-2">
                  <MapPin className="w-4 h-4 text-warm-400" />
                  <span>{house.craftsmanAddress}</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="bg-wood-50 rounded-2xl p-4 border border-wood-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-wood-700 block">Estimasi Biaya Produksi:</span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-wood-950">
                    {house.priceEstimated}
                  </span>
                </div>
                <div className="text-xs text-wood-600 sm:text-right">
                  <span>*Sistem Borongan / Kontrak Kerja</span>
                  <span className="block text-[11px] text-warm-500">Bisa Disesuaikan dengan Budget</span>
                </div>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-warm-50 p-3.5 rounded-xl border border-warm-200 text-center">
                  <span className="text-[11px] text-warm-500 block">Dimensi</span>
                  <strong className="text-sm text-wood-950 font-bold block mt-0.5">{house.dimensions}</strong>
                </div>
                <div className="bg-warm-50 p-3.5 rounded-xl border border-warm-200 text-center">
                  <span className="text-[11px] text-warm-500 block">Kamar Tidur</span>
                  <strong className="text-sm text-wood-950 font-bold block mt-0.5">{house.bedrooms || '-'} Ruangan</strong>
                </div>
                <div className="bg-warm-50 p-3.5 rounded-xl border border-warm-200 text-center">
                  <span className="text-[11px] text-warm-500 block">Kamar Mandi</span>
                  <strong className="text-sm text-wood-950 font-bold block mt-0.5">{house.bathrooms || '-'} Ruangan</strong>
                </div>
                <div className="bg-warm-50 p-3.5 rounded-xl border border-warm-200 text-center">
                  <span className="text-[11px] text-warm-500 block">Tingkat</span>
                  <strong className="text-sm text-wood-950 font-bold block mt-0.5">{house.floors} Lantai</strong>
                </div>
              </div>

              {/* Materials */}
              <div>
                <h4 className="font-bold text-sm text-wood-950 mb-2">Bahan Kayu Utama:</h4>
                <div className="flex flex-wrap gap-2">
                  {house.woodTypes.map((wood, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-wood-100 text-wood-900 border border-wood-300"
                    >
                      🪵 {wood}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-sm text-wood-950 mb-1.5">Deskripsi Lengkap:</h4>
                <p className="text-xs sm:text-sm text-warm-700 leading-relaxed whitespace-pre-line">
                  {house.description}
                </p>
              </div>

              {/* Features list */}
              {house.features && house.features.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm text-wood-950 mb-2">Keunggulan & Kelengkapan:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-warm-800">
                    {house.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-warm-50/80 p-2.5 rounded-lg border border-warm-200">
                        <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Details for UMKM */}
          {!isHouse && umkm && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-forest-700">
                    {umkm.businessName}
                  </span>
                  {umkm.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {umkm.badge}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wood-950 mt-1 leading-tight">
                  {umkm.name}
                </h2>
                <p className="text-xs text-warm-500 mt-1">Pemilik: <strong>{umkm.ownerName}</strong></p>
              </div>

              {/* Price */}
              <div className="bg-forest-50/60 rounded-2xl p-4 border border-forest-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-forest-800 block">Harga Produk:</span>
                  <span className="font-serif text-2xl font-bold text-forest-900">
                    {umkm.price}
                  </span>
                  {umkm.unit && <span className="text-xs text-warm-600 ml-1">({umkm.unit})</span>}
                </div>
                <div className="text-xs text-forest-700 text-right">
                  <span>Produk Asli Woloan 1 Utara</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-sm text-wood-950 mb-1.5">Deskripsi Produk:</h4>
                <p className="text-xs sm:text-sm text-warm-700 leading-relaxed whitespace-pre-line">
                  {umkm.description}
                </p>
              </div>

              {/* Address */}
              <div className="bg-warm-50 p-3.5 rounded-xl border border-warm-200 flex items-start gap-2 text-xs text-warm-700">
                <MapPin className="w-4 h-4 text-warm-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-warm-900 block">Alamat Usaha:</span>
                  <span>{umkm.address}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-warm-50 px-6 py-4 border-t border-warm-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={copyDetails}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-warm-700 hover:text-wood-900 bg-white border border-warm-200 hover:bg-warm-100 transition-colors"
          >
            <Copy className="w-4 h-4 text-warm-500" />
            <span>Salin Rincian</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-warm-700 hover:text-warm-900 transition-colors"
            >
              Tutup
            </button>

            <a
              href={getWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-forest-700 hover:bg-forest-800 transition-all shadow-warm-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>{isHouse ? 'Hubungi Pengrajin via WhatsApp' : 'Pesan Sekarang via WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
