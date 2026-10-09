import React from 'react';
import { WOOD_SPECIALITIES } from '../data/mockData';
import { Sparkles, ShieldCheck, RefreshCw, Trees, ArrowRight } from 'lucide-react';

interface SpecialitySectionProps {
  onNavigateToCatalog: () => void;
}

export const SpecialitySection: React.FC<SpecialitySectionProps> = ({ onNavigateToCatalog }) => {
  const steps = [
    {
      num: '01',
      title: 'Pemilihan & Pengeringan Kayu',
      desc: 'Hanya kayu pilihan berumur matang (Aliwowos & Cempaka Wasian) yang digunakan. Kayu dikeringkan melalui sistem kiln-dry dan pengawetan alami anti-hama.'
    },
    {
      num: '02',
      title: 'Pemahatan & Sistem Pasak (Purus)',
      desc: 'Tukang kayu ahli Woloan memahat sambungan lidah-alur dan pasak kayu presisi tanpa bergantung pada paku, menghasilkan struktur lentur yang tahan getaran gempa.'
    },
    {
      num: '03',
      title: 'Perakitan Percobaan di Bengkel',
      desc: 'Setiap unit rumah didirikan 100% utuh terlebih dahulu di workshop Woloan 1 Utara untuk memastikan seluruh sambungan, jendela, dan atap terpasang presisi.'
    },
    {
      num: '04',
      title: 'Penomoran Kode & Pengepakan',
      desc: 'Setiap balok dan papan diberi kode nomor identitas unik sebelum dibongkar rapi (knockdown) dan dikemas rapat ke dalam kontainer pelayaran.'
    },
    {
      num: '05',
      title: 'Pemasangan di Lokasi Pembeli',
      desc: 'Tim perajin dari Woloan dapat diberangkatkan langsung ke lokasi tujuan (di seluruh Indonesia atau mancanegara) untuk merakit kembali rumah hingga siap huni.'
    }
  ];

  return (
    <section id="speciality" className="py-16 lg:py-24 bg-wood-pattern relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Keistimewaan & Identitas Budaya</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-wood-950 tracking-tight">
            Mengapa Rumah Panggung Woloan Termasyhur di Dunia?
          </h2>
          <p className="mt-4 text-warm-700 text-base sm:text-lg leading-relaxed">
            Perpaduan harmonis antara kearifan lokal leluhur Minahasa, kekuatan jenis kayu tropis terbaik, 
            serta rekayasa konstruksi knockdown tahan gempa yang menjadikannya primadona arsitektur dunia.
          </p>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-7 border border-wood-200/90 shadow-warm-md hover:shadow-warm-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-forest-700" />
            </div>
            <h3 className="font-serif text-xl font-bold text-wood-950 mb-2">
              Rekayasa Alami Tahan Gempa
            </h3>
            <p className="text-warm-700 text-sm leading-relaxed">
              Arsitektur rumah panggung Minahasa dirancang dengan struktur tiang gantung dan sambungan pasak elastis. 
              Saat gelombang seismik gempa mengguncang, struktur kayu akan mendistribusikan getaran secara fleksibel 
              tanpa risiko retak atau runtuh seperti bangunan semen kaku.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-wood-200/90 shadow-warm-md hover:shadow-warm-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="font-serif text-xl font-bold text-wood-950 mb-2">
              Sistem Bongkar-Pasang (Knockdown)
            </h3>
            <p className="text-warm-700 text-sm leading-relaxed">
              Seluruh bagian rumah—mulai dari umpak tiang, balok lantai, papan dinding, kusen jendela hingga kuda-kuda atap—dapat 
              dibongkar pasang dengan presisi tinggi. Memungkinkan pengiriman praktis via kontainer darat dan laut ke mana saja di seluruh dunia.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-wood-200/90 shadow-warm-md hover:shadow-warm-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-wood-100 text-wood-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Trees className="w-6 h-6 text-wood-700" />
            </div>
            <h3 className="font-serif text-xl font-bold text-wood-950 mb-2">
              Kayu Pilihan Berumur Panjang
            </h3>
            <p className="text-warm-700 text-sm leading-relaxed">
              Woloan 1 Utara sangat menjunjung standar penggunaan kayu keras kelas satu seperti Kayu Aliwowos, 
              Cempaka Wasian harum, dan Kayu Besi. Bebas bubuk dan rayap, berumur panjang puluhan hingga ratusan tahun 
              dengan finishing alami yang ramah lingkungan.
            </p>
          </div>
        </div>

        {/* Deep Dive: Jenis Kayu Andalan Woloan */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-wood-200 shadow-warm-md mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full border border-forest-200">
                Spesifikasi Material Pilihan
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-wood-950 mt-2">
                Jenis Kayu Khas Mahakarya Woloan
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-warm-600 max-w-md">
              Kualitas dan daya tahan sebuah rumah panggung ditentukan oleh ketepatan pemilihan bahan kayu pada tiap bagian strukturnya.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {WOOD_SPECIALITIES.map((wood, idx) => (
              <div
                key={idx}
                className="bg-warm-50/80 rounded-2xl p-6 border border-wood-200 flex flex-col justify-between hover:border-wood-400 transition-colors"
              >
                <div>
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-serif text-lg font-bold text-wood-950">{wood.name}</h4>
                    <span className="text-[11px] font-semibold text-wood-700 bg-wood-200/70 px-2 py-0.5 rounded">
                      {wood.strength}
                    </span>
                  </div>
                  <p className="text-xs italic text-warm-500 font-mono mt-0.5">{wood.scientific}</p>

                  <div className="mt-4 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-warm-900">Ketahanan: </span>
                      <span className="text-warm-700">{wood.durability}</span>
                    </div>
                    <div>
                      <span className="font-bold text-warm-900">Fungsi Utama: </span>
                      <span className="text-warm-700">{wood.usage}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-warm-600 bg-white/80 p-3 rounded-xl border border-warm-200 leading-relaxed">
                    "{wood.highlight}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Step Process Timeline */}
        <div className="bg-wood-900 text-white rounded-3xl p-8 sm:p-12 shadow-warm-lg border border-wood-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
              Alur Produksi Ahli
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-3 text-white">
              5 Tahapan Pembuatan Rumah Panggung Knockdown
            </h3>
            <p className="text-xs sm:text-sm text-wood-200 mt-2">
              Dari batang gelondongan kayu terbaik hingga siap berdiri megah di pekarangan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st, i) => (
              <div
                key={i}
                className="bg-wood-800/80 rounded-2xl p-5 border border-wood-700/80 flex flex-col justify-between relative group hover:bg-wood-800 transition-colors"
              >
                <div>
                  <div className="font-serif text-2xl font-bold text-amber-400 mb-2">
                    {st.num}
                  </div>
                  <h4 className="font-bold text-sm text-white mb-2 leading-snug">
                    {st.title}
                  </h4>
                  <p className="text-xs text-wood-200 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-wood-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-wood-200 text-center sm:text-left">
              Ingin memesan atau melihat katalog model rumah panggung yang telah dirakit?
            </p>
            <button
              onClick={onNavigateToCatalog}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-wood-950 font-bold text-xs sm:text-sm shadow-warm-sm transition-all"
            >
              <span>Lihat Katalog Rumah Panggung</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
