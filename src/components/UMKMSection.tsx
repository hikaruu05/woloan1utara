import React from 'react';
import { useData } from '../context/DataContext';
import { UMKMStore } from '../types';
import { 
  Store, MapPin, MessageCircle, PlusCircle, 
  CheckCircle2, ArrowRight, ExternalLink, Package, Eye 
} from 'lucide-react';

interface UMKMSectionProps {
  onSelectStore: (store: UMKMStore) => void;
  onOpenUpload: () => void;
  onNavigateToFullPage: () => void;
}

export const UMKMSection: React.FC<UMKMSectionProps> = ({
  onSelectStore,
  onOpenUpload,
  onNavigateToFullPage
}) => {
  const { umkmStores } = useData();

  // Preview top 6 stores on home
  const previewStores = umkmStores.slice(0, 6);

  const getStoreWaLink = (store: UMKMStore) => {
    const text = encodeURIComponent(
      `Halo ${store.name} (${store.ownerName}), saya melihat profil usaha Anda di Portal Web Kelurahan Woloan 1 Utara. Saya ingin bertanya mengenai produk dan pemesanan. Terima kasih.`
    );
    const cleanPhone = store.phone.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <section id="umkm" className="py-16 lg:py-24 bg-white border-t border-wood-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-3 border border-forest-200">
              <Store className="w-3.5 h-3.5 text-forest-600" />
              <span>Direktori Usaha Warga (Berbasis Toko)</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wood-950 tracking-tight">
              Sentra Usaha & Toko UMKM Woloan 1 Utara
            </h2>
            <p className="mt-2 text-warm-700 text-sm sm:text-base max-w-2xl">
              Etalase per toko bagi pelaku UMKM kuliner legendaris, kerajinan miniatur kayu cempaka, kopi lereng Lokon, 
              dan bunga potong segar lengkap dengan titik lokasi Google Maps.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-forest-900 bg-forest-50 hover:bg-forest-100 border border-forest-300 shadow-2xs transition-all"
            >
              <PlusCircle className="w-4 h-4 text-forest-700" />
              <span>+ Daftarkan Toko</span>
            </button>

            <button
              onClick={onNavigateToFullPage}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-forest-800 hover:bg-forest-900 shadow-warm-sm hover:shadow-warm-md transition-all"
            >
              <span>Lihat Semua Toko UMKM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Featured Stores (Store-based) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-3xl overflow-hidden border border-wood-200 shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col group"
            >
              {/* Store Banner */}
              <div
                className="relative aspect-[16/10] overflow-hidden bg-wood-100 cursor-pointer"
                onClick={() => onSelectStore(store)}
              >
                <img
                  src={store.imageUrl}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wood-950/70 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {store.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-wood-950 shadow-xs">
                      {store.badge}
                    </span>
                  )}
                  {store.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-900/80 backdrop-blur-md text-forest-200 border border-forest-600">
                      <CheckCircle2 className="w-3 h-3 text-forest-400" />
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-900/80 backdrop-blur-md text-amber-200 border border-amber-600">
                      Upload Warga
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-300" />
                  <span>{store.products.length} Produk</span>
                </div>
              </div>

              {/* Store Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs uppercase font-bold tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded">
                      {store.category}
                    </span>
                    <span className="text-[11px] text-warm-500">Pemilik: <strong>{store.ownerName}</strong></span>
                  </div>

                  <h3
                    onClick={() => onSelectStore(store)}
                    className="font-serif font-bold text-lg text-wood-950 group-hover:text-forest-800 transition-colors cursor-pointer leading-snug mt-1"
                  >
                    {store.name}
                  </h3>

                  <p className="text-xs text-warm-600 mt-2 line-clamp-2 leading-relaxed">
                    {store.description}
                  </p>

                  {/* Address & Google Maps link */}
                  <div className="mt-4 pt-3 border-t border-warm-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-warm-700 truncate max-w-[210px]">
                      <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                      <span className="truncate">{store.address}</span>
                    </div>

                    {store.mapsUrl && (
                      <a
                        href={store.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-forest-700 hover:text-forest-900 bg-forest-50 hover:bg-forest-100 px-2.5 py-1 rounded-lg border border-forest-200 shrink-0 transition-colors"
                        title="Buka di Google Maps"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MapPin className="w-3 h-3 text-forest-600" />
                        <span>Maps</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {/* Sample Product */}
                  {store.products.length > 0 && (
                    <div className="mt-3.5 bg-warm-50/80 rounded-xl p-2.5 border border-warm-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-6 h-6 rounded overflow-hidden bg-warm-200 shrink-0">
                          <img src={store.products[0].imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="truncate text-warm-800 font-medium">{store.products[0].name}</span>
                      </div>
                      <span className="font-bold text-forest-800 text-[11px] shrink-0 ml-1">
                        {store.products[0].price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-warm-200 flex items-center gap-2">
                  <button
                    onClick={() => onSelectStore(store)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-forest-900 bg-forest-50 hover:bg-forest-100 border border-forest-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Toko ({store.products.length})</span>
                  </button>

                  <a
                    href={getStoreWaLink(store)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-forest-200" />
                    <span>WA Toko</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to full page */}
        <div className="mt-12 text-center bg-forest-50/60 rounded-3xl p-8 border border-forest-200">
          <h3 className="font-serif text-xl font-bold text-forest-950 mb-2">
            Ingin Menjelajahi Seluruh Toko & Produk UMKM Woloan 1 Utara?
          </h3>
          <p className="text-xs sm:text-sm text-forest-800 max-w-xl mx-auto mb-5">
            Buka halaman khusus Direktori UMKM dengan fitur pencarian lengkap, titik lokasi Google Maps, 
            dan paginasi 10 item per halaman.
          </p>
          <button
            onClick={onNavigateToFullPage}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-forest-800 hover:bg-forest-900 shadow-warm-md hover:scale-105 transition-all"
          >
            <span>Buka Halaman Direktori UMKM (Lengkap)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
