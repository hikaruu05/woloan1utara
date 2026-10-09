import React, { useState } from 'react';
import { Calculator, MessageCircle, Info } from 'lucide-react';

export const CostCalculator: React.FC = () => {
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(8);
  const [floors, setFloors] = useState<number>(1);
  const [woodChoice, setWoodChoice] = useState<'aliwowos_cempaka' | 'cempaka_super' | 'kayu_besi_aliwowos'>('aliwowos_cempaka');
  const [destination, setDestination] = useState<'sulut' | 'antar_pulau' | 'ekspor'>('antar_pulau');

  // Calculation parameters
  const area = length * width * floors;

  // Base rate per square meter (IDR)
  const woodRates: Record<string, { min: number; max: number; label: string }> = {
    aliwowos_cempaka: { min: 2100000, max: 2500000, label: 'Kombinasi Kayu Aliwowos & Cempaka Wasian (Standar Primadona)' },
    cempaka_super: { min: 2400000, max: 2800000, label: 'Kayu Cempaka Wasian Full Super (Serat Emas Halus & Harum)' },
    kayu_besi_aliwowos: { min: 2800000, max: 3400000, label: 'Tiang Kayu Besi Solid + Rangka Aliwowos (Maksimal Abadi)' }
  };

  const selectedRate = woodRates[woodChoice];
  const floorMultiplier = floors === 2 ? 1.05 : 1.0; // slight extra for 2nd floor scaffolding & high elevation

  const estMinBuilding = Math.round(area * selectedRate.min * floorMultiplier);
  const estMaxBuilding = Math.round(area * selectedRate.max * floorMultiplier);

  // Estimated production time
  const prodDays = Math.max(30, Math.round(area * 0.45 + (floors === 2 ? 15 : 0)));
  const installDays = Math.max(5, Math.round(area * 0.08 + (floors === 2 ? 4 : 0)));

  const destinationLabels: Record<string, string> = {
    sulut: 'Wilayah Lokal Sulawesi Utara (Manado, Minahasa, Tomohon, Bitung)',
    antar_pulau: 'Antar-Pulau Indonesia (Jawa, Bali, Lombok, NTT, Papua, Kalimantan, Sumatera)',
    ekspor: 'Ekspor Mancanegara (Maladewa, Karibia, Pasifik, Australia, Eropa)'
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleConsultWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo Pengrajin Rumah Panggung Kelurahan Woloan 1 Utara,\n\nSaya telah melakukan simulasi perhitungan rumah panggung di Portal Web Woloan 1 Utara dengan rincian berikut:\n- Dimensi: ${length} m x ${width} m (${floors} Lantai, Luas: ${area} m²)\n- Material Kayu: ${selectedRate.label}\n- Lokasi Pemasangan: ${destinationLabels[destination]}\n- Estimasi Kisaran Biaya Bangunan: ${formatRupiah(estMinBuilding)} s/d ${formatRupiah(estMaxBuilding)}\n- Estimasi Pengerjaan: ~${prodDays} hari kerja\n\nSaya ingin berkonsultasi lebih lanjut mengenai desain kustom dan penawaran resminya. Terima kasih.`
    );
    window.open(`https://wa.me/6281244556677?text=${text}`, '_blank');
  };

  return (
    <section id="kalkulator" className="py-16 lg:py-24 bg-wood-50/70 border-t border-wood-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3 border border-amber-300">
            <Calculator className="w-3.5 h-3.5 text-amber-700" />
            <span>Simulasi & Estimasi Online</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wood-950 tracking-tight">
            Kalkulator Estimasi Rumah Panggung Woloan
          </h2>
          <p className="mt-3 text-warm-700 text-sm sm:text-base leading-relaxed">
            Rencanakan hunian panggung kayu impian Anda. Tentukan dimensi, pilihan kayu terbaik, 
            dan dapatkan simulasi biaya serta waktu pengerjaan secara transparan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-wood-200 shadow-warm-md space-y-6">
            <h3 className="font-serif text-xl font-bold text-wood-950 border-b border-warm-200 pb-3">
              1. Konfigurasi Ukuran & Arsitektur
            </h3>

            {/* Length & Width */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-warm-700 mb-1.5">
                  Panjang Bangunan: <span className="text-wood-800 text-base">{length} Meter</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="18"
                  step="1"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-2 bg-warm-200 rounded-lg appearance-none cursor-pointer accent-wood-700"
                />
                <div className="flex justify-between text-[11px] text-warm-500 mt-1">
                  <span>4 m</span>
                  <span>10 m</span>
                  <span>18 m</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-warm-700 mb-1.5">
                  Lebar Bangunan: <span className="text-wood-800 text-base">{width} Meter</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="14"
                  step="1"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full h-2 bg-warm-200 rounded-lg appearance-none cursor-pointer accent-wood-700"
                />
                <div className="flex justify-between text-[11px] text-warm-500 mt-1">
                  <span>4 m</span>
                  <span>8 m</span>
                  <span>14 m</span>
                </div>
              </div>
            </div>

            {/* Quick preset buttons */}
            <div>
              <span className="text-xs font-medium text-warm-600 block mb-2">Preset Ukuran Populer:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { l: 6, w: 8, label: '6 x 8 m (Cottage/Villa)' },
                  { l: 8, w: 10, label: '8 x 10 m (Rumah Tinggal Standar)' },
                  { l: 9, w: 12, label: '9 x 12 m (Walewangko Besar)' },
                  { l: 4, w: 4, label: '4 x 4 m (Gazebo)' },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setLength(preset.l);
                      setWidth(preset.w);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      length === preset.l && width === preset.w
                        ? 'bg-wood-800 text-white border-wood-800 shadow-xs'
                        : 'bg-warm-50 text-warm-700 border-warm-200 hover:bg-wood-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Floors */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warm-700 mb-2">
                Jumlah Tingkat / Lantai:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFloors(1)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    floors === 1
                      ? 'border-wood-700 bg-wood-50 text-wood-950 font-bold shadow-xs'
                      : 'border-warm-200 bg-white text-warm-700 hover:bg-warm-50'
                  }`}
                >
                  <span className="block text-sm">1 Lantai (Standar Panggung)</span>
                  <span className="block text-xs text-warm-500 font-normal mt-0.5">Kolong panggung 1.5 - 2 meter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFloors(2)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    floors === 2
                      ? 'border-wood-700 bg-wood-50 text-wood-950 font-bold shadow-xs'
                      : 'border-warm-200 bg-white text-warm-700 hover:bg-warm-50'
                  }`}
                >
                  <span className="block text-sm">2 Lantai (Tingkat / Villa)</span>
                  <span className="block text-xs text-warm-500 font-normal mt-0.5">Balkon luas di lantai atas</span>
                </button>
              </div>
            </div>

            {/* Wood Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warm-700 mb-2">
                2. Spesifikasi Material Kayu:
              </label>
              <div className="space-y-2.5">
                {[
                  {
                    id: 'aliwowos_cempaka',
                    title: 'Aliwowos (Tiang/Balok) + Cempaka Wasian (Dinding/Lantai)',
                    desc: 'Kombinasi paling populer di Woloan. Sangat kokoh, harum, dan tahan rayap alami.'
                  },
                  {
                    id: 'cempaka_super',
                    title: 'Full Kayu Cempaka Wasian Grade Super',
                    desc: 'Kayu khas Minahasa beraroma wangi, serat keemasan mewah, ideal untuk finishing natural premium.'
                  },
                  {
                    id: 'kayu_besi_aliwowos',
                    title: 'Tiang Kayu Besi Solid + Rangka Aliwowos & Cempaka',
                    desc: 'Konstruksi kelas satu terkuat. Tahan cuaca ekstrem pantai dan lembab tropis puluhan tahun.'
                  }
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      woodChoice === item.id
                        ? 'border-wood-700 bg-wood-50/80 shadow-xs'
                        : 'border-warm-200 bg-white hover:bg-warm-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="woodChoice"
                      value={item.id}
                      checked={woodChoice === item.id}
                      onChange={() => setWoodChoice(item.id as any)}
                      className="mt-1 accent-wood-700"
                    />
                    <div>
                      <span className="block text-xs sm:text-sm font-bold text-warm-900">{item.title}</span>
                      <span className="block text-xs text-warm-600 mt-0.5">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warm-700 mb-2">
                3. Wilayah Pengiriman & Lokasi Pasang:
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-200 focus:outline-none focus:ring-2 focus:ring-wood-500 text-sm text-warm-900 bg-white"
              >
                <option value="sulut">Sulawesi Utara (Manado, Tomohon, Minahasa, Bitung)</option>
                <option value="antar_pulau">Luar Pulau / Antar-Pulau (Jawa, Bali, NTT, Papua, Sumatera, Kalimantan)</option>
                <option value="ekspor">Mancanegara / Ekspor (Maladewa, Karibia, Pasifik, Australia, Eropa)</option>
              </select>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-wood-900 text-white rounded-3xl p-6 sm:p-8 shadow-warm-lg border border-wood-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12" />

              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                Hasil Simulasi Real-Time
              </span>

              <div className="mt-4">
                <span className="text-xs text-wood-300">Estimasi Luas Bangunan:</span>
                <div className="font-serif text-3xl font-extrabold text-amber-300">
                  {area} m²{' '}
                  <span className="text-sm font-normal text-wood-200">
                    ({length}m × {width}m × {floors} lt)
                  </span>
                </div>
              </div>

              {/* Price Range Box */}
              <div className="my-6 p-4 rounded-2xl bg-wood-800/90 border border-wood-700/80">
                <span className="text-xs text-wood-300 block mb-1">
                  Kisaran Estimasi Biaya Bangunan:
                </span>
                <div className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  {formatRupiah(estMinBuilding)}
                </div>
                <div className="text-xs text-wood-300 my-0.5">sampai dengan</div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-amber-200 leading-tight">
                  {formatRupiah(estMaxBuilding)}
                </div>
                <p className="text-[11px] text-wood-300 mt-2 italic leading-relaxed">
                  *Sudah termasuk bahan baku kayu oven kualitas super, pengerjaan pertukangan, uji rakit (trial assembly) di Woloan, dan sistem pasak knockdown.
                </p>
              </div>

              {/* Time Estimates */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-6">
                <div className="bg-wood-800/60 p-3 rounded-xl border border-wood-700/50">
                  <span className="text-wood-300 block">Waktu Produksi:</span>
                  <strong className="text-white text-sm">~{prodDays} Hari Kerja</strong>
                  <span className="text-[10px] text-wood-300 block mt-0.5">di bengkel Woloan</span>
                </div>
                <div className="bg-wood-800/60 p-3 rounded-xl border border-wood-700/50">
                  <span className="text-wood-300 block">Waktu Rakit:</span>
                  <strong className="text-white text-sm">~{installDays} - {installDays + 4} Hari</strong>
                  <span className="text-[10px] text-wood-300 block mt-0.5">di lokasi tujuan</span>
                </div>
              </div>

              {/* CTA Consult WhatsApp */}
              <button
                type="button"
                onClick={handleConsultWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-wood-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 transition-all flex items-center justify-center gap-2 shadow-warm-md hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4 text-wood-900" />
                <span>Konsultasikan Rencana Ini via WhatsApp</span>
              </button>
            </div>

            {/* Note alert */}
            <div className="bg-white rounded-2xl p-5 border border-wood-200 text-xs text-warm-700 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-warm-900">
                <Info className="w-4 h-4 text-wood-700" />
                <span>Informasi Tambahan:</span>
              </div>
              <p className="leading-relaxed">
                Biaya pengiriman peti kemas dan tiket akomodasi teknisi perakit di luar daerah Sulawesi Utara akan dihitung 
                secara terpisah berdasarkan jarak pelabuhan dan kondisi topografi lahan lokasi pemesan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
