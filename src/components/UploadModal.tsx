import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { HouseType, UMKMCategory } from '../types';
import { 
  X, Upload, Hammer, Store, 
  CheckCircle2, Sparkles 
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { addHouse, addUMKM } = useData();

  const [activeForm, setActiveForm] = useState<'house' | 'umkm'>('house');

  // Rumah Panggung Form State
  const [houseTitle, setHouseTitle] = useState('');
  const [houseType, setHouseType] = useState<HouseType>('tradisional');
  const [houseDimensions, setHouseDimensions] = useState('8 x 10 Meter');
  const [houseWood, setHouseWood] = useState<string[]>(['Kayu Aliwowos', 'Kayu Cempaka Wasian']);
  const [houseBedrooms, setHouseBedrooms] = useState(3);
  const [houseBathrooms, setHouseBathrooms] = useState(2);
  const [houseFloors, setHouseFloors] = useState(1);
  const [housePrice, setHousePrice] = useState('Rp 150.000.000 - Rp 180.000.000');
  const [houseMinBudget, setHouseMinBudget] = useState(150000000);
  const [craftsmanName, setCraftsmanName] = useState('');
  const [craftsmanPhone, setCraftsmanPhone] = useState('');
  const [craftsmanAddress, setCraftsmanAddress] = useState('Lingkungan II, Kelurahan Woloan 1 Utara');
  const [houseDesc, setHouseDesc] = useState('');
  const [houseFeatures, setHouseFeatures] = useState(
    'Kayu oven pilihan, Sistem pasak knockdown tahan gempa, Termasuk tangga ukir Minahasa'
  );
  const [houseImage, setHouseImage] = useState(
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
  );

  // UMKM Form State
  const [umkmName, setUmkmName] = useState('');
  const [umkmCategory, setUmkmCategory] = useState<UMKMCategory>('kuliner');
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [umkmPrice, setUmkmPrice] = useState('Rp 35.000');
  const [umkmPriceNum, setUmkmPriceNum] = useState(35000);
  const [umkmUnit, setUmkmUnit] = useState('per pack / kemasan');
  const [umkmPhone, setUmkmPhone] = useState('');
  const [umkmAddress, setUmkmAddress] = useState('Lingkungan I, Woloan 1 Utara');
  const [umkmDesc, setUmkmDesc] = useState('');
  const [umkmBadge, setUmkmBadge] = useState('Produk Unggulan');
  const [umkmImage, setUmkmImage] = useState(
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80'
  );

  if (!isOpen) return null;

  // File to base64 preview handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isHouse: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (isHouse) {
            setHouseImage(reader.result);
          } else {
            setUmkmImage(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseTitle.trim() || !craftsmanName.trim() || !craftsmanPhone.trim()) {
      alert('Mohon lengkapi judul rumah, nama bengkel/pengrajin, dan nomor WhatsApp!');
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
      description: houseDesc || 'Rumah panggung kayu knockdown produksi pengrajin Woloan 1 Utara.',
      features: houseFeatures.split(',').map((f) => f.trim()).filter(Boolean),
      imageUrl: houseImage,
      galleryUrls: [houseImage],
      isCustomAllowed: true
    });

    onClose();
  };

  const handleUMKMSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!umkmName.trim() || !businessName.trim() || !umkmPhone.trim()) {
      alert('Mohon lengkapi nama produk, nama usaha/toko, dan nomor WhatsApp!');
      return;
    }

    addUMKM({
      name: umkmName,
      category: umkmCategory,
      businessName,
      ownerName: ownerName || businessName,
      price: umkmPrice,
      priceNum: Number(umkmPriceNum) || 0,
      unit: umkmUnit,
      phone: umkmPhone,
      address: umkmAddress,
      description: umkmDesc || 'Produk UMKM khas warga Woloan Satu Utara.',
      imageUrl: umkmImage,
      badge: umkmBadge
    });

    onClose();
  };

  const toggleWoodOption = (wood: string) => {
    setHouseWood((prev) =>
      prev.includes(wood) ? prev.filter((w) => w !== wood) : [...prev, wood]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-warm-lg border border-wood-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-wood-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-wood-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
              WADAH PENGUSAHA & UMKM WOLOAN 1 UTARA
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
              Pasang & Promosikan Produk Anda
            </h3>
            <p className="text-xs text-wood-200 mt-0.5">
              Gratis untuk seluruh pengrajin rumah panggung dan pelaku UMKM Kelurahan Woloan Satu Utara
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-wood-800 hover:bg-wood-700 text-wood-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-warm-200 bg-warm-50 px-6 pt-3 gap-3">
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

          <button
            type="button"
            onClick={() => setActiveForm('umkm')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
              activeForm === 'umkm'
                ? 'border-forest-700 text-forest-900'
                : 'border-transparent text-warm-600 hover:text-forest-800'
            }`}
          >
            <Store className="w-4 h-4 text-forest-700" />
            <span>Produk UMKM & Kuliner</span>
          </button>
        </div>

        {/* Form Body with Scroll */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ================= FORM RUMAH PANGGUNG ================= */}
          {activeForm === 'house' && (
            <form onSubmit={handleHouseSubmit} className="space-y-5">
              <div className="bg-wood-50/70 p-4 rounded-2xl border border-wood-200 text-xs text-wood-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Informasi yang Anda isi akan langsung tampil di etalase resmi Rumah Panggung Woloan 1 Utara dan dapat dihubungi langsung oleh calon pembeli via WhatsApp.
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
                    placeholder="Contoh: 081234567890 atau 628123456789"
                    value={craftsmanPhone}
                    onChange={(e) => setCraftsmanPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-wood-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dimensions & Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Dimensi (P x L)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 8 x 10 Meter"
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
                  <label className="block text-xs font-bold text-warm-800 mb-1">Jumlah Lantai</label>
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

              {/* Price Range & Address */}
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
                    Alamat Workshop / Lingkungan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Lingkungan II, Woloan 1 Utara"
                    value={craftsmanAddress}
                    onChange={(e) => setCraftsmanAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  Foto Rumah Panggung
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto px-4 py-2 rounded-xl border border-wood-300 bg-wood-50 hover:bg-wood-100 text-wood-900 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-wood-700" />
                    <span>Pilih Foto dari Galeri / Kamera</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, true)}
                    />
                  </label>
                  <span className="text-xs text-warm-400">atau tautan URL:</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={houseImage}
                    onChange={(e) => setHouseImage(e.target.value)}
                    className="flex-1 w-full px-3 py-1.5 rounded-xl border border-warm-200 text-xs text-warm-900"
                  />
                </div>

                {houseImage && (
                  <div className="mt-3 relative w-32 h-20 rounded-xl overflow-hidden border border-warm-200 bg-warm-100">
                    <img src={houseImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  Deskripsi & Keunggulan Rumah
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan detail keistimewaan arsitektur, kelengkapan ukiran, sistem bongkar pasang, dan garansi..."
                  value={houseDesc}
                  onChange={(e) => setHouseDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-wood-500 focus:outline-none"
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

          {/* ================= FORM PRODUK UMKM ================= */}
          {activeForm === 'umkm' && (
            <form onSubmit={handleUMKMSubmit} className="space-y-5">
              <div className="bg-forest-50 p-4 rounded-2xl border border-forest-200 text-xs text-forest-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                <span>
                  Portal ini membantu memperluas jangkauan pembeli produk UMKM Anda—mulai dari wisatawan Tomohon hingga pesanan luar kota secara gratis.
                </span>
              </div>

              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Nama Produk UMKM *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Klappertaart Panggang Kelapa Muda Khas Tomohon"
                    value={umkmName}
                    onChange={(e) => setUmkmName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Kategori Produk</label>
                  <select
                    value={umkmCategory}
                    onChange={(e) => setUmkmCategory(e.target.value as UMKMCategory)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white"
                  >
                    <option value="kuliner">Kuliner & Oleh-Oleh Khas</option>
                    <option value="kerajinan">Kerajinan Kayu & Souvenir Miniatur</option>
                    <option value="pertanian">Pertanian, Kopi & Bunga Krisan</option>
                    <option value="jasa">Jasa & Jasa Pengrajin</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Business Name, Owner & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Nama Toko / Brand UMKM *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dapur Mama Woloan"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Nama Pemilik</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ibu Grace Pontoh"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">
                    Nomor WhatsApp Order *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 08123456789"
                    value={umkmPhone}
                    onChange={(e) => setUmkmPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>
              </div>

              {/* Price & Unit & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Harga Produk</label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 35.000"
                    value={umkmPrice}
                    onChange={(e) => setUmkmPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Satuan / Kemasan</label>
                  <input
                    type="text"
                    placeholder="Contoh: per box / per cup / per kg"
                    value={umkmUnit}
                    onChange={(e) => setUmkmUnit(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Label / Keunggulan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Resep Warisan / Organik"
                    value={umkmBadge}
                    onChange={(e) => setUmkmBadge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  Alamat Usaha di Woloan 1 Utara
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Lingkungan I, Depan Lapangan Woloan 1 Utara"
                  value={umkmAddress}
                  onChange={(e) => setUmkmAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900"
                />
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">Foto Produk</label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto px-4 py-2 rounded-xl border border-forest-300 bg-forest-50 hover:bg-forest-100 text-forest-900 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-forest-700" />
                    <span>Upload Foto Produk</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, false)}
                    />
                  </label>
                  <span className="text-xs text-warm-400">atau masukkan URL foto:</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={umkmImage}
                    onChange={(e) => setUmkmImage(e.target.value)}
                    className="flex-1 w-full px-3 py-1.5 rounded-xl border border-warm-200 text-xs text-warm-900"
                  />
                </div>

                {umkmImage && (
                  <div className="mt-3 relative w-24 h-24 rounded-xl overflow-hidden border border-warm-200 bg-warm-100">
                    <img src={umkmImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  Deskripsi Produk & Cara Order
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan cita rasa, bahan baku lokal, atau keunikan kerajinan tangan Anda..."
                  value={umkmDesc}
                  onChange={(e) => setUmkmDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-warm-200 text-sm text-warm-900 focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-warm-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Daftarkan Produk UMKM</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
