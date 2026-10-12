import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { RumahPanggung } from '../types';
import { Pagination } from './Pagination';
import { CostCalculator } from './CostCalculator';
import { 
  Search, Hammer, Layers, MapPin, 
  CheckCircle2, MessageCircle, PlusCircle, 
  ExternalLink, ArrowLeft, SlidersHorizontal 
} from 'lucide-react';

interface RumahPanggungPageProps {
  onSelectHouse: (house: RumahPanggung) => void;
  onOpenUpload: () => void;
  onBackToHome: () => void;
}

export const RumahPanggungPage: React.FC<RumahPanggungPageProps> = ({
  onSelectHouse,
  onOpenUpload,
  onBackToHome
}) => {
  const { houses } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWood, setSelectedWood] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;

  const typeLabels: { [key: string]: string } = {
    all: 'Semua Tipe',
    tradisional: 'Tradisional Walewangko',
    dua_lantai: 'Villa 2 Lantai',
    minimalis: 'Minimalis Tropis',
    villa: 'Cottage / Resor',
    gazebo: 'Gazebo & Bale'
  };

  const filteredHouses = useMemo(() => {
    return houses.filter((h) => {
      const matchSearch =
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.craftsmanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.woodTypes.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase())) ||
        h.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = selectedType === 'all' || h.type === selectedType;
      const matchWood =
        selectedWood === 'all' ||
        h.woodTypes.some((w) => w.toLowerCase().includes(selectedWood.toLowerCase()));

      return matchSearch && matchType && matchWood;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.minBudget - b.minBudget;
      if (sortBy === 'price-desc') return b.minBudget - a.minBudget;
      return 0;
    });
  }, [houses, searchQuery, selectedType, selectedWood, sortBy]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedWood, sortBy]);

  // Paginated houses (10 per page)
  const paginatedHouses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHouses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHouses, currentPage]);

  const getWaLink = (house: RumahPanggung) => {
    const text = encodeURIComponent(
      `Halo ${house.craftsmanName}, saya melihat listing "${house.title}" di Portal Web Kelurahan Woloan 1 Utara. Saya ingin berkonsultasi mengenai spesifikasi, estimasi biaya, dan jadwal pengerjaan. Terima kasih.`
    );
    const cleanPhone = house.craftsmanPhone.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="py-8 sm:py-12 bg-warm-50/70 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-warm-200">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-warm-700 hover:text-wood-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Utama</span>
          </button>

          <div className="text-xs text-warm-500 hidden sm:block">
            <span>Beranda</span> &gt; <strong className="text-wood-900">Katalog Rumah Panggung</strong>
          </div>
        </div>

        {/* Page Banner Header */}
        <div className="bg-gradient-to-r from-wood-950 via-wood-900 to-wood-950 text-white rounded-3xl p-6 sm:p-10 shadow-warm-lg border border-wood-800 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
                <Hammer className="w-3.5 h-3.5" />
                <span>SENTRA INDUSTRI RUMAH KAYU WOLOAN 1 UTARA</span>
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Katalog Rumah Panggung Kayu Knockdown
              </h1>
              <p className="mt-3 text-wood-200 text-sm sm:text-base leading-relaxed">
                Jelajahi mahakarya rumah kayu panggung Minahasa hasil kerajinan tangan maestro Woloan 1 Utara. 
                Tahan gempa, berpasak kayu presisi, dan siap dikirim ke seluruh nusantara hingga mancanegara.
              </p>
            </div>

            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm text-wood-950 bg-amber-400 hover:bg-amber-300 shadow-warm-md hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-wood-950" />
              <span>+ Pasang Rumah Panggung</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-warm-sm border border-wood-200 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-warm-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari model rumah, nama bengkel, jenis kayu, atau ukuran..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warm-200 focus:outline-none focus:ring-2 focus:ring-wood-500 text-sm text-warm-900 bg-warm-50/50"
              />
            </div>

            {/* Filter Wood */}
            <div className="md:col-span-3">
              <select
                value={selectedWood}
                onChange={(e) => setSelectedWood(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-warm-200 focus:outline-none focus:ring-2 focus:ring-wood-500 text-sm text-warm-800 bg-warm-50/50"
              >
                <option value="all">Semua Jenis Kayu</option>
                <option value="aliwowos">Kayu Aliwowos</option>
                <option value="cempaka">Kayu Cempaka Wasian</option>
                <option value="besi">Kayu Besi</option>
                <option value="nantu">Kayu Nantu</option>
              </select>
            </div>

            {/* Sort Price */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-warm-200 focus:outline-none focus:ring-2 focus:ring-wood-500 text-sm text-warm-800 bg-warm-50/50"
              >
                <option value="default">Urutkan: Rekomendasi</option>
                <option value="price-asc">Harga: Terendah ke Tertinggi</option>
                <option value="price-desc">Harga: Tertinggi ke Terendah</option>
              </select>
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-warm-100 pt-3">
            <span className="text-xs font-semibold text-warm-500 flex items-center gap-1 mr-1 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Tipe:
            </span>
            {Object.entries(typeLabels).map(([key, label]) => {
              const isSelected = selectedType === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-wood-800 text-white shadow-xs'
                      : 'bg-warm-100 text-warm-700 hover:bg-wood-100 hover:text-wood-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter & Reset */}
        <div className="flex items-center justify-between text-xs text-warm-600 mb-6">
          <span>
            Total terdaftar: <strong className="text-wood-950 font-bold">{filteredHouses.length}</strong> model rumah panggung
          </span>
          {(searchQuery || selectedType !== 'all' || selectedWood !== 'all' || sortBy !== 'default') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedWood('all');
                setSortBy('default');
              }}
              className="text-wood-700 hover:underline font-bold"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Grid List (10 Items per Page) */}
        {paginatedHouses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedHouses.map((house) => (
                <div
                  key={house.id}
                  className="bg-white rounded-2xl overflow-hidden border border-wood-200/90 shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col group"
                >
                  {/* Image Container with Badges */}
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-wood-100 cursor-pointer"
                    onClick={() => onSelectHouse(house)}
                  >
                    <img
                      src={house.imageUrl}
                      alt={house.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-wood-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-wood-900/80 backdrop-blur-md text-amber-300 border border-wood-700">
                        {typeLabels[house.type] || house.type}
                      </span>
                      {house.isVerified ? (
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

                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        {house.dimensions}
                      </span>
                      <span className="bg-amber-500 text-wood-950 px-2 py-1 rounded font-bold">
                        Detail Spek
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Craftsman info */}
                      <div className="flex items-center gap-1.5 text-xs text-warm-600 mb-1.5">
                        <Hammer className="w-3.5 h-3.5 text-wood-600 shrink-0" />
                        <span className="font-semibold text-warm-900 line-clamp-1">{house.craftsmanName}</span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onSelectHouse(house)}
                        className="font-serif font-bold text-base sm:text-lg text-wood-950 group-hover:text-wood-700 transition-colors line-clamp-2 cursor-pointer leading-snug"
                      >
                        {house.title}
                      </h3>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-1.5 my-3 py-2.5 px-3 rounded-xl bg-warm-50 border border-warm-200 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-warm-500 block">Dimensi</span>
                          <strong className="text-warm-900 font-semibold">{house.dimensions}</strong>
                        </div>
                        <div className="border-x border-warm-200">
                          <span className="text-[10px] text-warm-500 block">Kamar</span>
                          <strong className="text-warm-900 font-semibold">{house.bedrooms || '-'} KT / {house.bathrooms || '-'} KM</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-warm-500 block">Lantai</span>
                          <strong className="text-warm-900 font-semibold">{house.floors} Lantai</strong>
                        </div>
                      </div>

                      {/* Wood Types */}
                      <div className="text-xs text-warm-600 mb-2">
                        <span className="text-warm-500">Material: </span>
                        <span className="font-medium text-wood-900">{house.woodTypes.join(', ')}</span>
                      </div>

                      {/* Location with Google Maps button */}
                      <div className="flex items-center justify-between text-[11px] text-warm-600 mb-4 pt-1">
                        <div className="flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="w-3 h-3 text-warm-400 shrink-0" />
                          <span className="truncate">{house.craftsmanAddress}</span>
                        </div>
                        {house.mapsUrl && (
                          <a
                            href={house.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-forest-700 hover:text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 shrink-0"
                            title="Buka titik lokasi bengkel di Google Maps"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Titik Maps</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-3 border-t border-warm-200">
                      <div className="mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-warm-500 block">
                          Estimasi Biaya Produksi:
                        </span>
                        <span className="font-serif text-base sm:text-lg font-bold text-wood-900">
                          {house.priceEstimated}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onSelectHouse(house)}
                          className="w-full py-2 px-3 rounded-xl text-xs font-bold text-wood-900 bg-warm-100 hover:bg-wood-100 border border-wood-300 transition-colors text-center"
                        >
                          Detail Spek
                        </button>

                        <a
                          href={getWaLink(house)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-forest-200" />
                          <span>Tanya WA</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Component (10 items per page) */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredHouses.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              itemName="model rumah panggung"
            />
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-warm-200 p-8 max-w-lg mx-auto shadow-warm-sm">
            <Hammer className="w-12 h-12 text-warm-400 mx-auto mb-3" />
            <h4 className="font-serif text-lg font-bold text-warm-900">Model Rumah Tidak Ditemukan</h4>
            <p className="text-xs text-warm-600 mt-1 mb-4">
              Coba sesuaikan kata kunci pencarian Anda atau reset filter untuk melihat semua model.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedWood('all');
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-wood-800 text-white"
            >
              Tampilkan Semua Model
            </button>
          </div>
        )}

        {/* Integrated Calculator on page */}
        <div className="mt-16">
          <CostCalculator />
        </div>
      </div>
    </div>
  );
};
