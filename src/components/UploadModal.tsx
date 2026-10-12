import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { HouseType, UMKMCategory, UMKMProductItem } from '../types';
import { 
  X, Upload, Hammer, Store, 
  CheckCircle2, Sparkles, MapPin, 
  Plus, Trash2, Package 
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { addHouse, addStore } = useData();

  const [activeForm, setActiveForm] = useState<'house' | 'store'>('store');

  // ================= Rumah Panggung Form State =================
  const [houseTitle, setHouseTitle] = useState('');
  const [houseType, setHouseType] = useState<HouseType>('tradisional');
  const [houseDimensions, setHouseDimensions] = useState('8 x 10 Meter');
  const [houseWood, setHouseWood] = useState<string[]>(['Kayu Aliwowos', 'Kayu Cempaka Wasian']);
  const [houseBedrooms, setHouseBedrooms] = useState(3);
  const [houseBathrooms, setHouseBathrooms] = useState(2);
  const [houseFloors, setHouseFloors] = useState(1);
  const [housePrice, setHousePrice] = useState('Rp 150.000.000 - Rp 180.000.000');
  const [houseMinBudget] = useState(150000000);
  const [craftsmanName, setCraftsmanName] = useState('');
  const [craftsmanPhone, setCraftsmanPhone] = useState('');
  const [craftsmanAddress, setCraftsmanAddress] = useState('Lingkungan II, Kelurahan Woloan 1 Utara');
  const [houseMapsUrl, setHouseMapsUrl] = useState('');
  const [houseDesc, setHouseDesc] = useState('');
  const [houseFeatures] = useState(
    'Kayu oven pilihan, Sistem pasak knockdown tahan gempa, Termasuk tangga ukir Minahasa'
  );
  const [houseImage, setHouseImage] = useState(
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
  );

  // ================= Toko UMKM (Store-based) Form State =================
  const [storeName, setStoreName] = useState('');
  const [storeOwner, setStoreOwner] = useState('');
  const [storeCategory, setStoreCategory] = useState<UMKMCategory>('kuliner');
  const [storePhone, setStorePhone] = useState('');
  const [storeAddress, setStoreAddress] = useState('Lingkungan I, Woloan 1 Utara');
  const [storeMapsUrl, setStoreMapsUrl] = useState('');
  const [storeDesc, setStoreDesc] = useState('');
  const [storeBadge, setStoreBadge] = useState('Produk Unggulan Woloan');
  const [storeImage, setStoreImage] = useState(
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80'
  );

  // Dynamic products list within store
  const [storeProducts, setStoreProducts] = useState<Omit<UMKMProductItem, 'id'>[]>([
    {
      name: '',
      price: '',
      priceNum: 0,
      unit: 'per pcs / kemasan',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  if (!isOpen) return null;

  // File to base64 preview handler
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'house' | 'store' | number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (type === 'house') {
            setHouseImage(reader.result);
          } else if (type === 'store') {
            setStoreImage(reader.result);
          } else if (typeof type === 'number') {
            const updated = [...storeProducts];
            updated[type].imageUrl = reader.result;
            setStoreProducts(updated);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProductField = () => {
    setStoreProducts([
      ...storeProducts,
      {
        name: '',
        price: '',
        priceNum: 0,
        unit: 'per pcs / kemasan',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80'
      }
    ]);
  };

  const handleRemoveProductField = (index: number) => {
    if (storeProducts.length <= 1) return;
    setStoreProducts(storeProducts.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: keyof Omit<UMKMProductItem, 'id'>, value: any) => {
    const updated = [...storeProducts];
    updated[index] = { ...updated[index], [field]: value };
    setStoreProducts(updated);
  };

  const handleHouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseTitle.trim() || !craftsmanName.trim() || !craftsmanPhone.trim()) {
      alert('Mohon lengkapi nama rumah, nama bengkel, dan nomor WhatsApp!');
      return;
    }

    addHouse({
      title: houseTitle,
      type: houseType,
      dimensions: houseDimensions,
      woodTypes: houseWood,
      bedrooms: Number(houseBedrooms),
      bathrooms: Number(houseBathrooms),
      floors: Number(houseFloors),
      priceEstimated: housePrice,
      minBudget: Number(houseMinBudget) || 100000000,
      craftsmanName,
      craftsmanPhone,
      craftsmanAddress,
      mapsUrl: houseMapsUrl || undefined,
      description: houseDesc || 'Rumah panggung kayu knockdown produksi pengrajin Woloan 1 Utara.',
      features: houseFeatures.split(',').map((f) => f.trim()).filter(Boolean),
      imageUrl: houseImage,
      galleryUrls: [houseImage],
      isCustomAllowed: true
    });

    onClose();
  };

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !storeOwner.trim() || !storePhone.trim()) {
      alert('Mohon lengkapi nama toko/usaha, nama pemilik, dan nomor WhatsApp!');
      return;
    }

    // Filter valid products
    const validProducts: UMKMProductItem[] = storeProducts
      .filter((p) => p.name.trim() !== '')
      .map((p, idx) => ({
        id: 'prod-' + Date.now() + '-' + idx,
        name: p.name,
        price: p.price || 'Rp 0',
        priceNum: Number(p.priceNum) || 0,
        unit: p.unit,
        description: p.description,
        imageUrl: p.imageUrl
      }));

    addStore({
      name: storeName,
      ownerName: storeOwner,
      category: storeCategory,
      phone: storePhone,
      address: storeAddress,
      mapsUrl: storeMapsUrl || undefined,
      description: storeDesc || `Unit usaha ${storeName} di Woloan 1 Utara.`,
      imageUrl: storeImage,
      badge: storeBadge,
      products: validProducts.length > 0 ? validProducts : [
        {
          id: 'prod-' + Date.now(),
          name: 'Produk Utama ' + storeName,
          price: 'Hubungi Penjual',
          priceNum: 0,
          unit: 'per unit',
          description: storeDesc,
          imageUrl: storeImage
        }
      ]
    });

    onClose();
  };

  const toggleWoodOption = (wood: string) => {
    setHouseWood((prev) =>
      prev.includes(wood) ? prev.filter((w) => w !== wood) : [...prev, wood]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-warm-lg border border-wood-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-wood-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-wood-900">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
              WADAH PENGUSAHA & PELAKU UMKM WOLOAN 1 UTARA
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
              Pendaftaran Usaha & Katalog Produk
            </h3>
            <p className="text-xs text-wood-200 mt-0.5">
              Daftarkan toko UMKM Anda beserta katalog produk & titik lokasi Google Maps agar mudah dijangkau pelanggan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-wood-800 hover:bg-wood-700 text-wood-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Toko UMKM vs Rumah Panggung */}
        <div className="flex border-b border-warm-200 bg-warm-50 px-6 pt-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveForm('store')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
              activeForm === 'store'
                ? 'border-forest-700 text-forest-900'
                : 'border-transparent text-warm-600 hover:text-forest-800'
            }`}
          >
            <Store className="w-4 h-4 text-forest-700" />
            <span>Pendaftaran Toko / Usaha UMKM (Per Toko)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveForm('house')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
              activeForm === 'house'
                ? 'border-wood-800 text-wood-950'
                : 'border-transparent text-warm-600 hover:text-wood-800'
            }`}
          >
            <Hammer className="w-4 h-4 text-wood-700" />
            <span>Katalog Rumah Panggung Kayu</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ================= FORM TOKO UMKM (STORE-BASED) ================= */}
          {activeForm === 'store' && (
            <form onSubmit={handleStoreSubmit} className="space-y-6">
              <div className="bg-forest-50 p-4 rounded-2xl border border-forest-200 text-xs text-forest-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Konsep Berbasis Toko:</strong> Anda mendaftarkan profil toko/usaha Anda lengkap dengan titik Google Maps, dan dapat memasukkan produk-produk yang dijual oleh toko Anda sekaligus!
                </span>
              </div>

              {/* Bagian 1: Data Profil Toko */}
              <div className="border border-warm-200 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                <h4 className="font-serif font-bold text-base text-wood-950 flex items-center gap-2">
                  <Store className="w-4 h-4 text-forest-700" />
                  <span>1. Informasi Toko / Usaha UMKM</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-warm-800 mb-1">
                      Nama Toko / Usaha *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Dapur Mama Woloan / Souvenir Cempaka"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-warm-800 mb-1">
                      Nama Pemilik Usaha *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ibu Mathilda Supit"
                      value={storeOwner}
                      onChange={(e) => setStoreOwner(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-warm-800 mb-1">
                      Kategori Usaha
                    </label>
                    <select
                      value={storeCategory}
                      onChange={(e) => setStoreCategory(e.target.value as UMKMCategory)}
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white"
                    >
                      <option value="kuliner">Kuliner & Oleh-Oleh Khas</option>
                      <option value="kerajinan">Kerajinan Kayu & Souvenir</option>
                      <option value="pertanian">Pertanian, Kopi & Bunga Krisan</option>
                      <option value="jasa">Jasa & Pertukangan</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-warm-800 mb-1">
                      Nomor WhatsApp Toko *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 08123456789 atau 628123456789"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Alamat Fisik & Titik Google Maps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-warm-800 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-forest-700" />
                      <span>Alamat Fisik di Woloan 1 Utara *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Lingkungan I, Dekat Lapangan Woloan"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-warm-800 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Titik Alamat Google Maps (Tautan / Link)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="Contoh: https://maps.app.goo.gl/... atau koordinat"
                      value={storeMapsUrl}
                      onChange={(e) => setStoreMapsUrl(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 placeholder:text-warm-400"
                    />
                    <span className="text-[10px] text-warm-500 mt-1 block">
                      *Buka Google Maps di HP/Laptop &gt; Bagikan Lokasi &gt; Salin tautan ke sini.
                    </span>
                  </div>
                </div>

                {/* Foto Profil / Banner Toko */}
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Foto Toko / Banner Usaha
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <label className="w-full sm:w-auto px-4 py-2 rounded-xl border border-forest-300 bg-forest-50 hover:bg-forest-100 text-forest-900 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4 text-forest-700" />
                      <span>Upload Foto Toko</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'store')}
                      />
                    </label>
                    <span className="text-xs text-warm-400">atau tautan URL:</span>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={storeImage}
                      onChange={(e) => setStoreImage(e.target.value)}
                      className="flex-1 w-full px-3 py-1.5 rounded-xl border border-warm-200 text-xs text-warm-900"
                    />
                  </div>
                  {storeImage && (
                    <div className="mt-2.5 relative w-24 h-20 rounded-xl overflow-hidden border border-warm-200 bg-warm-100">
                      <img src={storeImage} alt="Preview Toko" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Deskripsi Toko */}
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Profil & Deskripsi Toko
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ceritakan keunggulan usaha Anda, resep legendaris, atau jam buka toko..."
                    value={storeDesc}
                    onChange={(e) => setStoreDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bagian 2: Produk-Produk Toko */}
              <div className="border border-warm-200 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-wood-950 flex items-center gap-2">
                    <Package className="w-4 h-4 text-forest-700" />
                    <span>2. Produk-Produk yang Dijual di Toko Ini ({storeProducts.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddProductField}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-forest-800 bg-forest-100 hover:bg-forest-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Produk Lain</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {storeProducts.map((prod, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-warm-200 bg-warm-50/60 relative space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-warm-200">
                        <span className="text-xs font-bold text-forest-900">Produk #{idx + 1}</span>
                        {storeProducts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProductField(idx)}
                            className="text-red-500 hover:text-red-700 p-1 text-xs flex items-center gap-1"
                            title="Hapus produk ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-warm-700 mb-1">
                            Nama Produk *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Klappertaart Panggang / Miniatur Kayu"
                            value={prod.name}
                            onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-warm-200 text-xs text-warm-900 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-warm-700 mb-1">
                            Harga & Satuan *
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Rp 45.000"
                              value={prod.price}
                              onChange={(e) => handleProductChange(idx, 'price', e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-lg border border-warm-200 text-xs text-warm-900 bg-white"
                            />
                            <input
                              type="text"
                              placeholder="per loyang / box"
                              value={prod.unit || ''}
                              onChange={(e) => handleProductChange(idx, 'unit', e.target.value)}
                              className="w-28 px-3 py-1.5 rounded-lg border border-warm-200 text-xs text-warm-900 bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-warm-700 mb-1">
                          Foto Produk
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="px-3 py-1 rounded-lg border border-warm-300 bg-white hover:bg-warm-100 text-[11px] font-semibold cursor-pointer shrink-0">
                            Pilih Foto
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, idx)}
                            />
                          </label>
                          <input
                            type="url"
                            placeholder="atau tautan URL gambar..."
                            value={prod.imageUrl}
                            onChange={(e) => handleProductChange(idx, 'imageUrl', e.target.value)}
                            className="flex-1 px-3 py-1 rounded-lg border border-warm-200 text-[11px] text-warm-900 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-warm-700 mb-1">
                          Deskripsi Singkat Produk
                        </label>
                        <input
                          type="text"
                          placeholder="Bahan kelapa muda, kayu manis, kismis..."
                          value={prod.description || ''}
                          onChange={(e) => handleProductChange(idx, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-warm-200 text-xs text-warm-900 bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-warm-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Daftarkan Toko UMKM & Produk ke Portal</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= FORM RUMAH PANGGUNG ================= */}
          {activeForm === 'house' && (
            <form onSubmit={handleHouseSubmit} className="space-y-5">
              <div className="bg-wood-50/70 p-4 rounded-2xl border border-wood-200 text-xs text-wood-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Informasi rumah panggung Anda akan terdaftar di katalog resmi Woloan 1 Utara lengkap dengan titik alamat Google Maps workshop pengrajin.
                </span>
              </div>

              {/* Title & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Nama / Judul Model Rumah *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rumah Panggung Walewangko Klasik 8x10m"
                    value={houseTitle}
                    onChange={(e) => setHouseTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-wood-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Tipe Rumah</label>
                  <select
                    value={houseType}
                    onChange={(e) => setHouseType(e.target.value as HouseType)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-wood-500 focus:outline-none bg-white"
                  >
                    <option value="tradisional">Tradisional Walewangko Minahasa</option>
                    <option value="dua_lantai">Villa Tropis 2 Lantai</option>
                    <option value="minimalis">Rumah Panggung Minimalis</option>
                    <option value="villa">Cottage / Resor Studio</option>
                    <option value="gazebo">Gazebo & Bale Ukir</option>
                  </select>
                </div>
              </div>

              {/* Craftsman Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Nama Bengkel / Pengrajin *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bengkel Kayu Makatana Woloan"
                    value={craftsmanName}
                    onChange={(e) => setCraftsmanName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-wood-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Nomor WhatsApp Pengrajin *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890"
                    value={craftsmanPhone}
                    onChange={(e) => setCraftsmanPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-wood-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Address & Google Maps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Alamat Workshop / Lingkungan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lingkungan II, Woloan 1 Utara"
                    value={craftsmanAddress}
                    onChange={(e) => setCraftsmanAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>Titik Lokasi Google Maps</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.app.goo.gl/... atau koordinat"
                    value={houseMapsUrl}
                    onChange={(e) => setHouseMapsUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>
              </div>

              {/* Dimensions & Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Dimensi</label>
                  <input
                    type="text"
                    placeholder="8 x 10 Meter"
                    value={houseDimensions}
                    onChange={(e) => setHouseDimensions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Kamar Tidur</label>
                  <input
                    type="number"
                    min="0"
                    value={houseBedrooms}
                    onChange={(e) => setHouseBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Kamar Mandi</label>
                  <input
                    type="number"
                    min="0"
                    value={houseBathrooms}
                    onChange={(e) => setHouseBathrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Lantai</label>
                  <select
                    value={houseFloors}
                    onChange={(e) => setHouseFloors(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 bg-white"
                  >
                    <option value={1}>1 Lantai</option>
                    <option value={2}>2 Lantai</option>
                  </select>
                </div>
              </div>

              {/* Wood Type Multi-select */}
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1.5">
                  Bahan Kayu yang Digunakan:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Kayu Aliwowos',
                    'Kayu Cempaka Wasian',
                    'Kayu Besi',
                    'Kayu Nantu',
                    'Kayu Jati Lokal'
                  ].map((wood) => {
                    const checked = houseWood.includes(wood);
                    return (
                      <button
                        key={wood}
                        type="button"
                        onClick={() => toggleWoodOption(wood)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          checked
                            ? 'bg-wood-800 text-white border-wood-800'
                            : 'bg-warm-50 text-warm-700 border-warm-200 hover:bg-wood-100'
                        }`}
                      >
                        {checked && '✓ '}
                        {wood}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Estimasi Kisaran Biaya
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 160.000.000 - Rp 190.000.000"
                    value={housePrice}
                    onChange={(e) => setHousePrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Foto Rumah Panggung
                  </label>
                  <div className="flex gap-2">
                    <label className="px-3 py-2 rounded-xl border border-wood-300 bg-wood-50 text-xs font-semibold cursor-pointer shrink-0">
                      Pilih Foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'house')}
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="URL foto..."
                      value={houseImage}
                      onChange={(e) => setHouseImage(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-warm-200 text-xs text-warm-900"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  Deskripsi Keunggulan Rumah
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail arsitektur, kelengkapan ukiran, sistem bongkar pasang, dan garansi..."
                  value={houseDesc}
                  onChange={(e) => setHouseDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-wood-800 hover:bg-wood-900 text-white font-bold text-sm shadow-warm-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Terbitkan Rumah Panggung ke Katalog</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
