import React, { useEffect } from 'react';
import { RumahPanggung, UMKMStore, UMKMProductItem } from '../types';
import { 
  X, Hammer, Store, MapPin, 
  MessageCircle, CheckCircle2, Copy, 
  ExternalLink, Package 
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface DetailModalProps {
  item: RumahPanggung | UMKMStore | UMKMProductItem | null;
  type: 'house' | 'store' | 'product' | null;
  associatedStore?: UMKMStore | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ 
  item, 
  type, 
  associatedStore,
  onClose,
}) => {
  const { showToast } = useData();

  useEffect(() => {
    if (!item || !type) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, type, onClose]);

  if (!item || !type) return null;

  const isHouse = type === 'house';
  const isStore = type === 'store';
  const isProduct = type === 'product';

  const house = isHouse ? (item as RumahPanggung) : null;
  const store = isStore ? (item as UMKMStore) : associatedStore;
  const product = isProduct ? (item as UMKMProductItem) : null;

  const getWaLink = () => {
    if (isHouse && house) {
      const text = encodeURIComponent(
        `Halo ${house.craftsmanName},\nSaya ingin berkonsultasi mengenai rumah panggung "${house.title}" yang saya temukan di Web Kelurahan Woloan 1 Utara.\n\nSpesifikasi yang saya tanyakan:\n- Dimensi: ${house.dimensions}\n- Bahan Kayu: ${house.woodTypes.join(', ')}\n- Estimasi Harga: ${house.priceEstimated}\n\nApakah model ini bisa dipesan atau dikustomisasi? Terima kasih.`
      );
      const cleanPhone = house.craftsmanPhone.replace(/[^0-9]/g, '');
      const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      return `https://wa.me/${phone}?text=${text}`;
    } else if (isStore && store) {
      const text = encodeURIComponent(
        `Halo ${store.name} (${store.ownerName}),\nSaya ingin menanyakan produk-produk UMKM yang terdaftar di Web Kelurahan Woloan 1 Utara. Bagaimana proses pemesanan dan pengirimannya? Terima kasih.`
      );
      const cleanPhone = store.phone.replace(/[^0-9]/g, '');
      const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      return `https://wa.me/${phone}?text=${text}`;
    } else if (isProduct && product && store) {
      const text = encodeURIComponent(
        `Halo ${store.name},\nSaya tertarik memesan produk "${product.name}" (${product.price}) dari etalase UMKM Web Woloan 1 Utara. Mohon informasi ketersediaannya. Terima kasih.`
      );
      const cleanPhone = store.phone.replace(/[^0-9]/g, '');
      const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      return `https://wa.me/${phone}?text=${text}`;
    }
    return '#';
  };

  const copyDetails = () => {
    let text = '';
    if (isHouse && house) {
      text = `${house.title} - Pengrajin: ${house.craftsmanName} (${house.priceEstimated}). Kontak: ${house.craftsmanPhone}`;
    } else if (isStore && store) {
      text = `Toko: ${store.name} - Pemilik: ${store.ownerName} (${store.address}). Kontak WA: ${store.phone}`;
    } else if (isProduct && product && store) {
      text = `${product.name} (${product.price}) - Toko: ${store.name}. Kontak WA: ${store.phone}`;
    }
    navigator.clipboard?.writeText(text);
    showToast('Tautan Disalin', 'Rincian kontak telah disalin ke clipboard Anda.', 'info');
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Detail katalog" className="fixed inset-0 z-50 overflow-y-auto bg-warm-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-warm-lg border border-wood-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="bg-wood-950 text-white px-6 py-4 flex items-center justify-between border-b border-wood-900">
          <div className="flex items-center gap-2">
            {isHouse && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Hammer className="w-3.5 h-3.5" />
                Spesifikasi Rumah Panggung
              </span>
            )}
            {isStore && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-forest-500/20 text-forest-300 border border-forest-500/30">
                <Store className="w-3.5 h-3.5" />
                Profil & Katalog Toko UMKM
              </span>
            )}
            {isProduct && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-forest-500/20 text-forest-300 border border-forest-500/30">
                <Package className="w-3.5 h-3.5" />
                Detail Produk UMKM
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup detail"
            className="p-1.5 rounded-xl bg-wood-800 hover:bg-wood-700 text-wood-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Main Visual */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-wood-100 border border-warm-200">
            {item.imageUrl ? <img
              src={item.imageUrl}
              alt={isHouse ? house?.title : isStore ? store?.name : product?.name}
              className="w-full h-full object-cover"
            /> : <div className="flex h-full items-center justify-center text-wood-500"><Package className="h-12 w-12"/></div>}
            <div className="absolute bottom-3 left-3 flex gap-2">
              {'isVerified' in item && item.isVerified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-forest-900/90 text-forest-200 backdrop-blur-md border border-forest-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-400" />
                  Karya Terdaftar Kelurahan Woloan 1 Utara
                </span>
              )}
            </div>
          </div>

          {/* ================= DETAIL RUMAH PANGGUNG ================= */}
          {isHouse && house && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-wood-700">
                  {house.craftsmanName}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wood-950 mt-1 leading-tight">
                  {house.title}
                </h2>
                
                {/* Location & Maps Link */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-warm-600 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-warm-400" />
                    <span>{house.craftsmanAddress}</span>
                  </div>
                  {house.mapsUrl && (
                    <a
                      href={house.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 hover:text-forest-900 bg-forest-50 px-2.5 py-1 rounded-lg border border-forest-200"
                    >
                      <MapPin className="w-3 h-3 text-forest-600" />
                      <span>Buka Titik Lokasi di Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
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
                  <span>*Sistem Kontrak Borongan</span>
                  <span className="block text-[11px] text-warm-500">Termasuk Perakitan Percobaan di Bengkel</span>
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
                  <span className="text-[11px] text-warm-500 block">Lantai</span>
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

          {/* ================= DETAIL TOKO UMKM (STORE-BASED VIEW) ================= */}
          {isStore && store && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded">
                    {store.category}
                  </span>
                  {store.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {store.badge}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wood-950 mt-1 leading-tight">
                  {store.name}
                </h2>
                <p className="text-xs text-warm-500 mt-1">Pemilik Usaha: <strong>{store.ownerName}</strong></p>

                {/* Address & Google Maps Link */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-warm-700 mt-3 pt-3 border-t border-warm-200">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-forest-700 shrink-0" />
                    <span>{store.address}</span>
                  </div>
                  {store.mapsUrl && (
                    <a
                      href={store.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-forest-800 hover:text-forest-950 bg-forest-50 hover:bg-forest-100 px-3 py-1 rounded-xl border border-forest-300 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Buka Titik Toko di Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-sm text-wood-950 mb-1.5">Profil & Keunggulan Toko:</h4>
                <p className="text-xs sm:text-sm text-warm-700 leading-relaxed whitespace-pre-line">
                  {store.description}
                </p>
              </div>

              {/* Products in this store */}
              <div className="border border-warm-200 rounded-2xl p-5 bg-warm-50/70 space-y-4">
                <h4 className="font-serif font-bold text-base text-wood-950 flex items-center justify-between">
                  <span>Katalog Produk Toko Ini ({store.products.length})</span>
                  <span className="text-xs font-normal text-warm-500">Pesan langsung via WhatsApp</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {store.products.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-xl overflow-hidden border border-warm-200 p-3 flex flex-col justify-between group shadow-2xs"
                    >
                      <div>
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-warm-100 mb-2.5">
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <h5 className="font-bold text-sm text-warm-900 line-clamp-1">{prod.name}</h5>
                        {prod.description && (
                          <p className="text-xs text-warm-600 mt-1 line-clamp-2">{prod.description}</p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-warm-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-serif font-bold text-sm text-forest-800">{prod.price}</span>
                          {prod.unit && <span className="text-[10px] text-warm-500 block">{prod.unit}</span>}
                        </div>

                        <a
                          href={`https://wa.me/${store.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Halo ${store.name}, saya ingin memesan "${prod.name}" (${prod.price}) dari katalog Web Woloan 1 Utara.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 flex items-center gap-1 shrink-0"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Pesan</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= DETAIL SINGLE PRODUK ================= */}
          {isProduct && product && store && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-forest-700">
                  {store.name}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wood-950 mt-1 leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-warm-500 mt-1">Penjual: <strong>{store.ownerName}</strong></p>
              </div>

              {/* Price */}
              <div className="bg-forest-50 rounded-2xl p-4 border border-forest-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-forest-800 block">Harga Produk:</span>
                  <span className="font-serif text-2xl font-bold text-forest-900">
                    {product.price}
                  </span>
                  {product.unit && <span className="text-xs text-warm-600 ml-1">({product.unit})</span>}
                </div>
                <div className="text-xs text-forest-700 text-right">
                  <span>Produk UMKM Asli Woloan 1 Utara</span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="font-bold text-sm text-wood-950 mb-1.5">Deskripsi Produk:</h4>
                  <p className="text-xs sm:text-sm text-warm-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Store & Maps */}
              <div className="bg-warm-50 p-4 rounded-xl border border-warm-200 space-y-2 text-xs text-warm-700">
                <div className="flex items-start gap-2">
                  <Store className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-warm-900 block">Toko: {store.name}</span>
                    <span>{store.address}</span>
                  </div>
                </div>

                {store.mapsUrl && (
                  <div className="pt-2 border-t border-warm-200 flex items-center gap-2">
                    <a
                      href={store.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-forest-800 hover:underline"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Buka Titik Lokasi Toko di Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
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

            {(isHouse ? Boolean(house?.craftsmanPhone) : Boolean(store?.phone)) && <a
              href={getWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-forest-700 hover:bg-forest-800 transition-all shadow-warm-sm"
            >
              <MessageCircle className="w-4 h-4 text-forest-200" />
              <span>
                {isHouse
                  ? 'Hubungi Pengrajin via WhatsApp'
                  : isStore
                  ? 'Hubungi Pemilik Toko via WhatsApp'
                  : 'Pesan Produk via WhatsApp'}
              </span>
            </a>}
          </div>
        </div>
      </div>
    </div>
  );
};
