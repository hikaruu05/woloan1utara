import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { ProductUMKM } from '../types';
import { 
  Store, Search, MapPin, 
  MessageCircle, PlusCircle, CheckCircle2, 
  Sparkles, Utensils, Flower2, Hammer 
} from 'lucide-react';

interface UMKMSectionProps {
  onSelectProduct: (product: ProductUMKM) => void;
  onOpenUpload: () => void;
}

export const UMKMSection: React.FC<UMKMSectionProps> = ({
  onSelectProduct,
  onOpenUpload
}) => {
  const { umkmProducts } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return umkmProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [umkmProducts, searchQuery, selectedCategory]);

  const categories = [
    { id: 'all', label: 'Semua UMKM', icon: Store },
    { id: 'kerajinan', label: 'Kerajinan Kayu & Souvenir', icon: Hammer },
    { id: 'kuliner', label: 'Kuliner & Oleh-Oleh Khas', icon: Utensils },
    { id: 'pertanian', label: 'Pertanian, Kopi & Bunga', icon: Flower2 },
    { id: 'jasa', label: 'Jasa & Lainnya', icon: Sparkles }
  ];

  const getWaLink = (product: ProductUMKM) => {
    const text = encodeURIComponent(
      `Halo Bpk/Ibu pengelola ${product.businessName} Woloan 1 Utara, saya tertarik memesan produk "${product.name}" yang tertera di Web Profil Kelurahan Woloan 1 Utara. Mohon informasi ketersediaan dan cara pemesanan. Terima kasih.`
    );
    const cleanPhone = product.phone.replace(/[^0-9]/g, '');
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
              <span>Ekonomi Kreatif & Kerakyatan</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wood-950 tracking-tight">
              Etalase Produk UMKM Woloan 1 Utara
            </h2>
            <p className="mt-2 text-warm-700 text-sm sm:text-base max-w-2xl">
              Selain rumah panggung, Woloan 1 Utara memiliki ragam produk UMKM unggulan: dari souvenir 
              miniatur kayu cempaka, klappertaart gurih legit, cemilan khas Minahasa, hingga kopi dan bunga potong segar.
            </p>
          </div>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-forest-700 to-forest-800 hover:from-forest-800 hover:to-forest-900 shadow-warm-sm hover:shadow-warm-md transition-all self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>+ Daftarkan Usaha UMKM</span>
          </button>
        </div>

        {/* Search & Category Tabs */}
        <div className="bg-warm-50 rounded-2xl p-4 sm:p-6 border border-wood-200 shadow-warm-sm mb-8 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-warm-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari produk UMKM (contoh: miniatur, klappertaart, talenan kayu, kopi...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warm-200 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white text-sm text-warm-900 placeholder:text-warm-400"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-forest-800 text-white shadow-xs'
                      : 'bg-white text-warm-700 border border-warm-200 hover:bg-forest-50 hover:text-forest-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-warm-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-warm-600 mb-6">
          <span>Menampilkan <strong className="text-wood-900">{filteredProducts.length}</strong> produk UMKM terdaftar</span>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-forest-700 hover:underline font-semibold"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* UMKM Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-warm-50/50 rounded-2xl overflow-hidden border border-wood-200 shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col group"
              >
                {/* Product Image */}
                <div 
                  className="relative aspect-[4/3] overflow-hidden bg-wood-100 cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {product.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-wood-950 shadow-xs">
                        {product.badge}
                      </span>
                    )}
                    {product.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-900/80 backdrop-blur-md text-forest-200 border border-forest-600">
                        <CheckCircle2 className="w-3 h-3 text-forest-400" />
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-900/80 backdrop-blur-md text-amber-200 border border-amber-600">
                        Upload Warga
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-forest-700 font-semibold mb-1">
                      <Store className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{product.businessName}</span>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-serif font-bold text-base text-wood-950 group-hover:text-wood-700 transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-warm-600 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] text-warm-500 mt-3 pt-3 border-t border-warm-200">
                      <MapPin className="w-3 h-3 text-warm-400 shrink-0" />
                      <span className="line-clamp-1">{product.address}</span>
                    </div>
                  </div>

                  {/* Price & WhatsApp Action */}
                  <div className="mt-4 pt-3 border-t border-warm-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-warm-500 block">
                        Harga:
                      </span>
                      <span className="font-serif text-base font-bold text-forest-800">
                        {product.price}
                      </span>
                      {product.unit && (
                        <span className="text-[10px] text-warm-500 ml-1">({product.unit})</span>
                      )}
                    </div>

                    <a
                      href={getWaLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-all shadow-2xs shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-forest-200" />
                      <span>Pesan</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-warm-50 rounded-2xl border border-warm-200 p-8 max-w-lg mx-auto">
            <Store className="w-12 h-12 text-warm-400 mx-auto mb-3" />
            <h4 className="font-serif text-lg font-bold text-warm-900">Produk UMKM Tidak Ditemukan</h4>
            <p className="text-xs text-warm-600 mt-1 mb-4">
              Belum ada produk yang cocok dengan pencarian Anda. Daftarkan usaha Anda untuk tampil di halaman ini!
            </p>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-forest-700 text-white"
            >
              + Daftarkan Produk Saya
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
