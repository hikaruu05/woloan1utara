import React, { useState, useMemo, useEffect } from "react";
import { useData } from "../context/DataContext";
import { UMKMStore, UMKMProductItem } from "../types";
import { Pagination } from "./Pagination";
import { whatsappUrl } from "../utils/whatsapp";
import {
  Store,
  Search,
  MapPin,
  MessageCircle,
  CheckCircle2,
  Utensils,
  Flower2,
  Hammer,
  ExternalLink,
  ArrowLeft,
  Package,
  Eye,
  Sparkles,
  Shapes,
} from "lucide-react";

interface UMKMPageProps {
  onSelectStore: (store: UMKMStore) => void;
  onSelectProduct: (product: UMKMProductItem, store: UMKMStore) => void;
  onBackToHome: () => void;
}

export const UMKMPage: React.FC<UMKMPageProps> = ({
  onSelectStore,
  onSelectProduct,
  onBackToHome,
}) => {
  const { umkmStores, catalogLoading } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"stores" | "products">("stores");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;

  const categories = [
    { id: "all", label: "Semua Kategori", icon: Store },
    { id: "kerajinan", label: "Kerajinan Kayu & Souvenir", icon: Hammer },
    { id: "kuliner", label: "Kuliner & Oleh-Oleh", icon: Utensils },
    { id: "pertanian", label: "Pertanian, Kopi & Bunga", icon: Flower2 },
    { id: "jasa", label: "Jasa & Pertukangan", icon: Sparkles },
    { id: "lainnya", label: "Lainnya", icon: Shapes },
  ];

  // Filtered stores
  const filteredStores = useMemo(() => {
    return umkmStores.filter((store) => {
      const matchCategory =
        selectedCategory === "all" || store.category === selectedCategory;
      const matchSearch =
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.products.some((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      return matchCategory && matchSearch;
    });
  }, [umkmStores, selectedCategory, searchQuery]);

  // Aggregated products across filtered stores
  const allProductsWithStore = useMemo(() => {
    const list: { product: UMKMProductItem; store: UMKMStore }[] = [];
    filteredStores.forEach((store) => {
      store.products.forEach((prod) => {
        if (
          !searchQuery ||
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          list.push({ product: prod, store });
        }
      });
    });
    return list;
  }, [filteredStores, searchQuery]);

  // Reset page when filters or viewMode change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, viewMode]);

  // Paginated slices (10 items per page)
  const paginatedStores = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStores.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStores, currentPage]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allProductsWithStore.slice(start, start + ITEMS_PER_PAGE);
  }, [allProductsWithStore, currentPage]);

  const getStoreWaLink = (store: UMKMStore) => {
    const text = `Halo ${store.name} (${store.ownerName}), saya melihat profil usaha Anda di Portal Web Kelurahan Woloan 1 Utara. Saya ingin bertanya mengenai produk dan pemesanan. Terima kasih.`;
    return whatsappUrl(store.phone, text) || "#";
  };

  const getProductWaLink = (product: UMKMProductItem, store: UMKMStore) => {
    const text = `Halo ${store.name}, saya tertarik memesan produk "${product.name}" (${product.price}) dari etalase UMKM Web Woloan 1 Utara. Apakah produk ini tersedia? Terima kasih.`;
    return whatsappUrl(product.phone || store.phone, text) || "#";
  };

  return (
    <div className="py-6 sm:py-10 bg-warm-50/70 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-warm-200">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-warm-700 hover:text-wood-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="text-xs text-warm-500 hidden sm:block">
            <span>Beranda</span> &gt;{" "}
            <strong className="text-forest-900 font-bold">
              Direktori Toko & Produk UMKM
            </strong>
          </div>
        </div>

        {/* Page Banner Header */}
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-warm-lg border border-forest-800 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-forest-500/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <Store className="w-3.5 h-3.5" />
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Sentra Usaha & Toko UMKM Woloan 1 Utara
              </h1>
              <p className="mt-2.5 text-forest-200 text-xs sm:text-sm lg:text-base leading-relaxed">
                Jelajahi etalase usaha warga Woloan 1 Utara per toko. Dilengkapi
                titik alamat Google Maps, daftar produk per unit usaha, serta
                pemesanan langsung ke WhatsApp pemilik toko.
              </p>
            </div>

          </div>
        </div>

        {/* Filters, View Toggle & Search Bar */}
        <div className={`bg-white rounded-2xl p-4 sm:p-5 shadow-warm-sm border border-wood-200 mb-8 space-y-4 ${umkmStores.length === 0 ? "hidden" : ""}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* View Mode Switcher: Toko vs Produk */}
            <div className="flex items-center p-1 bg-warm-100 rounded-xl self-start border border-warm-200">
              <button
                type="button"
                onClick={() => setViewMode("stores")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "stores"
                    ? "bg-forest-800 text-white shadow-xs"
                    : "text-warm-700 hover:text-warm-950"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Katalog Toko ({filteredStores.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("products")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "products"
                    ? "bg-forest-800 text-white shadow-xs"
                    : "text-warm-700 hover:text-warm-950"
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Semua Produk ({allProductsWithStore.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-warm-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label={viewMode === "stores" ? "Cari toko, pemilik, atau produk" : "Cari produk"}
                placeholder={
                  viewMode === "stores"
                    ? "Cari nama toko, pemilik, atau produk..."
                    : "Cari klappertaart, souvenir kayu, kopi..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warm-200 focus:outline-none focus:ring-2 focus:ring-forest-500 text-xs sm:text-sm text-warm-900 bg-warm-50/50"
              />
            </div>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar border-t border-warm-100">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-forest-800 text-white shadow-xs font-bold"
                      : "bg-warm-100 text-warm-700 hover:bg-forest-50 hover:text-forest-900"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${isSelected ? "text-amber-300" : "text-warm-500"}`}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter Info */}
        <div className={`flex items-center justify-between text-xs text-warm-600 mb-6 ${umkmStores.length === 0 ? "hidden" : ""}`}>
          <span>
            {viewMode === "stores" ? (
              <>
                Menampilkan{" "}
                <strong className="text-forest-950 font-bold">
                  {filteredStores.length}
                </strong>{" "}
                toko UMKM di Woloan 1 Utara
              </>
            ) : (
              <>
                Menampilkan{" "}
                <strong className="text-forest-950 font-bold">
                  {allProductsWithStore.length}
                </strong>{" "}
                produk dari seluruh toko
              </>
            )}
          </span>

          {(searchQuery || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-forest-700 hover:underline font-bold"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* ================= VIEW MODE 1: PER TOKO (STORE-BASED) ================= */}
        {catalogLoading ? <div role="status" className="rounded-2xl bg-white p-8 text-center text-sm text-warm-600">Memuat katalog UMKM…</div> : viewMode === "stores" && (
          <>
            {paginatedStores.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {paginatedStores.map((store) => (
                    <div
                      key={store.id}
                      className="bg-white rounded-2xl overflow-hidden border border-wood-200/90 shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col h-full group"
                    >
                      {/* Store Banner */}
                      <div
                        className="relative aspect-[16/10] overflow-hidden bg-wood-100 cursor-pointer shrink-0"
                        onClick={() => onSelectStore(store)}
                      >
                        {store.imageUrl ? <img
                          src={store.imageUrl}
                          alt={store.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        /> : <div className="flex h-full items-center justify-center text-forest-700"><Store className="h-10 w-10"/></div>}
                        <div className="absolute inset-0 bg-gradient-to-t from-wood-950/75 via-transparent to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {store.badge && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-wood-950 shadow-xs">
                              {store.badge}
                            </span>
                          )}
                          {store.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-900/85 backdrop-blur-md text-forest-200 border border-forest-600">
                              <CheckCircle2 className="w-3 h-3 text-forest-400" />
                              Terverifikasi
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-900/85 backdrop-blur-md text-amber-200 border border-amber-600">
                              Belum diverifikasi
                            </span>
                          )}
                        </div>

                        {/* Product count tag */}
                        <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-amber-300" />
                          <span>{store.products.length} Produk</span>
                        </div>
                      </div>

                      {/* Store Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Store Name & Owner */}
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                              {store.category}
                            </span>
                            <span className="text-[11px] text-warm-500 truncate max-w-[150px]">
                              Pemilik:{" "}
                              <strong className="text-warm-800">
                                {store.ownerName}
                              </strong>
                            </span>
                          </div>

                          <button type="button"
                            onClick={() => onSelectStore(store)}
                            className="mt-1 min-h-[1.5rem] w-full text-left font-serif font-bold text-base sm:text-lg text-wood-950 group-hover:text-forest-800 transition-colors leading-snug line-clamp-1"
                          >
                            {store.name}
                          </button>

                          <p className="text-xs text-warm-600 mt-1.5 line-clamp-2 leading-relaxed min-h-[2rem]">
                            {store.description}
                          </p>

                          {/* Address & Google Maps link */}
                          <div className="mt-3.5 pt-3 border-t border-warm-100 flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-1.5 text-warm-700 truncate max-w-[190px]">
                              <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                              <span className="truncate">{store.address}</span>
                            </div>

                            {store.mapsUrl ? (
                              <a
                                href={store.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-forest-700 hover:text-forest-950 bg-forest-50 hover:bg-forest-100 px-2 py-0.5 rounded-lg border border-forest-200 shrink-0 transition-colors"
                                title="Buka Titik Lokasi Toko di Google Maps"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MapPin className="w-3 h-3 text-red-600" />
                                <span>Titik Maps</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <span className="text-[10px] text-warm-400">
                                Maps -
                              </span>
                            )}
                          </div>

                          {/* Product Preview Chips Row (Clean & Uniform) */}
                          <div className="mt-3 bg-warm-50/80 rounded-xl p-2.5 border border-warm-200">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-warm-500 block mb-1.5">
                              Daftar Produk:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {store.products.slice(0, 3).map((prod) => (
                                <span
                                  key={prod.id}
                                  onClick={() => onSelectProduct(prod, store)}
                                  className="inline-block text-[10px] font-medium text-warm-800 bg-white hover:bg-forest-50 px-2 py-0.5 rounded border border-warm-200 cursor-pointer truncate max-w-[180px]"
                                >
                                  {prod.name}
                                </span>
                              ))}
                              {store.products.length > 3 && (
                                <span className="text-[10px] font-bold text-forest-700 px-1 py-0.5">
                                  +{store.products.length - 3} lainnya
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Store Actions */}
                        <div className="mt-4 pt-3 border-t border-warm-200 flex items-center gap-2">
                          <button
                            onClick={() => onSelectStore(store)}
                            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-forest-900 bg-forest-50 hover:bg-forest-100 border border-forest-200 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-forest-700" />
                            <span>Katalog Toko</span>
                          </button>

                          {store.phone && <a
                            href={getStoreWaLink(store)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-forest-200" />
                            <span>WA Toko</span>
                          </a>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination (10 Stores per Page) */}
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredStores.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  itemName="toko UMKM"
                />
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-warm-200 p-8 max-w-lg mx-auto shadow-warm-sm">
                <Store className="w-12 h-12 text-warm-400 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-warm-900">
                  Toko UMKM Tidak Ditemukan
                </h4>
                <p className="text-xs text-warm-600 mt-1 mb-4">
                  Belum ada toko yang sesuai dengan pencarian atau filter yang
                  dipilih.
                </p>
              </div>
            )}
          </>
        )}

        {/* ================= VIEW MODE 2: PER PRODUK (10 PRODUK PER HALAMAN) ================= */}
        {!catalogLoading && viewMode === "products" && (
          <>
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map(({ product, store }) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl overflow-hidden border border-wood-200 shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col h-full group"
                    >
                      {/* Product Image */}
                      <div
                        className="relative aspect-[4/3] overflow-hidden bg-wood-100 cursor-pointer shrink-0"
                        onClick={() => onSelectProduct(product, store)}
                      >
                        {product.imageUrl ? <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        /> : <div className="flex h-full items-center justify-center text-wood-600"><Package className="h-10 w-10"/></div>}
                        <div className="absolute top-3 left-3 bg-forest-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {store.category}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Store attribution */}
                          <button type="button"
                            onClick={() => onSelectStore(store)}
                            className="mb-1 flex items-center gap-1.5 truncate text-left text-xs font-bold text-forest-700 hover:underline"
                          >
                            <Store className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{store.name}</span>
                          </button>

                          <button type="button"
                            onClick={() => onSelectProduct(product, store)}
                            className="min-h-[2.5rem] w-full text-left font-serif font-bold text-base text-wood-950 group-hover:text-forest-800 transition-colors line-clamp-2 leading-snug"
                          >
                            {product.name}
                          </button>

                          <p className="text-xs text-warm-600 mt-1 line-clamp-2 leading-relaxed min-h-[2rem]">
                            {product.description ||
                              "Lihat detail atau hubungi toko untuk informasi produk."}
                          </p>

                          {/* Address & Maps */}
                          <div className="flex items-center justify-between text-[11px] text-warm-600 mt-3 pt-3 border-t border-warm-100">
                            <span className="truncate max-w-[190px]">
                              {store.address}
                            </span>
                            {(product.mapsUrl || store.mapsUrl) && (
                              <a
                                href={product.mapsUrl || store.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-forest-700 hover:text-forest-900 bg-forest-50 px-2 py-0.5 rounded"
                                title={product.mapsUrl ? "Buka titik produk di Google Maps" : "Buka titik usaha di Google Maps"}
                              >
                                <MapPin className="w-3 h-3 text-red-600" />
                                <span>Maps</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="mt-4 pt-3 border-t border-warm-200 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-warm-500 block font-bold uppercase">
                              Harga:
                            </span>
                            <span className="font-serif text-base font-bold text-forest-900">
                              {product.price || "Hubungi penjual"}
                            </span>
                            {product.unit && (
                              <span className="text-[10px] text-warm-500 ml-1">
                                ({product.unit})
                              </span>
                            )}
                          </div>

                          {(product.phone || store.phone) && <a
                            href={getProductWaLink(product, store)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-all shadow-2xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-forest-200" />
                            <span>Pesan</span>
                          </a>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination (10 Products per Page) */}
                <Pagination
                  currentPage={currentPage}
                  totalItems={allProductsWithStore.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  itemName="produk UMKM"
                />
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-warm-200 p-8 max-w-lg mx-auto shadow-warm-sm">
                <Package className="w-12 h-12 text-warm-400 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-warm-900">
                  {umkmStores.length === 0 ? "Informasi UMKM sedang disiapkan" : allProductsWithStore.length === 0 && !searchQuery ? "Belum ada produk di etalase" : "Produk tidak ditemukan"}
                </h4>
                <p className="text-xs text-warm-600 mt-1 mb-4">
                  {umkmStores.length === 0 ? "Daftar toko dan produk akan ditampilkan setelah diperbarui serta dikonfirmasi kelurahan." : allProductsWithStore.length === 0 && !searchQuery ? "Petugas kelurahan belum menambahkan produk untuk toko yang terdaftar." : "Coba ubah kata kunci atau kategori untuk melihat hasil lainnya."}
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-forest-700 text-white"
                >
                  Tampilkan Semua Produk
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
