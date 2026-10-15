import React, { useState } from "react";
import {
  VILLAGE_OFFICIALS,
  LINGKUNGAN_HEADS,
  LINGKUNGAN_DEPUTIES,
} from "../data/mockData";
import {
  Building2,
  Users,
  FileText,
  Compass,
  Award,
  MapPin,
  CheckCircle,
  GraduationCap,
} from "lucide-react";

export const ProfileKelurahan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "profil" | "struktur" | "layanan" | "kkt"
  >("profil");

  return (
    <section
      id="profil"
      className="scroll-mt-24 py-16 lg:py-24 bg-white border-y border-wood-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-3 border border-forest-200">
            <Building2 className="w-3.5 h-3.5" />
            <span>Pemerintahan & Profil Wilayah</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wood-950 tracking-tight">
            Mengenal Kelurahan Woloan Satu Utara
          </h2>
          <p className="mt-3 text-warm-700 text-base leading-relaxed">
            Pusat peradaban seni arsitektur kayu tradisional Minahasa yang
            bertumbuh di dataran tinggi sejuk Kota Tomohon dengan kearifan lokal
            gotong-royong{" "}
            <span className="italic font-semibold text-wood-900">Mapalus</span>.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-warm-200 pb-4">
          <button
            onClick={() => setActiveTab("profil")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "profil"
                ? "bg-wood-800 text-white shadow-warm-sm"
                : "text-warm-700 hover:text-wood-900 hover:bg-warm-100"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Sekilas Wilayah & Visi Misi</span>
          </button>

          <button
            onClick={() => setActiveTab("struktur")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "struktur"
                ? "bg-wood-800 text-white shadow-warm-sm"
                : "text-warm-700 hover:text-wood-900 hover:bg-warm-100"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Aparatur & Kepala Lingkungan</span>
          </button>

          <button
            onClick={() => setActiveTab("layanan")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "layanan"
                ? "bg-wood-800 text-white shadow-warm-sm"
                : "text-warm-700 hover:text-wood-900 hover:bg-warm-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Layanan Administrasi Warga</span>
          </button>

          <button
            onClick={() => setActiveTab("kkt")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "kkt"
                ? "bg-wood-800 text-white shadow-warm-sm"
                : "text-warm-700 hover:text-wood-900 hover:bg-warm-100"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Inisiatif Program KKT</span>
          </button>
        </div>

        {/* Tab 1: Profil Wilayah & Visi Misi */}
        {activeTab === "profil" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-warm-50 rounded-2xl p-6 sm:p-8 border border-wood-200/80 shadow-warm-sm">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-wood-950 mb-3">
                  Karakteristik & Potensi Wilayah
                </h3>
                <p className="text-warm-800 text-sm sm:text-base leading-relaxed mb-4">
                  Kelurahan Woloan Satu Utara berada di Kecamatan Tomohon Barat,
                  Kota Tomohon, Provinsi Sulawesi Utara. Terletak di lembah
                  subur di bawah kaki Gunung Lokon pada ketinggian sekitar 750 –
                  850 mdpl, wilayah ini dianugerahi udara sejuk serta tanah
                  vulkanik yang subur.
                </p>
                <p className="text-warm-800 text-sm sm:text-base leading-relaxed">
                  Sejak dekade 1960-an, masyarakat Woloan telah mewarisi
                  keahlian pertukangan kayu tingkat tinggi yang berevolusi
                  menjadi industri rumah panggung kayu sistem knockdown
                  (bongkar-pasang). Hari ini, Woloan 1 Utara diakui sebagai
                  salah satu sentra kerajinan kayu arsitektur terbesar di
                  Indonesia yang produknya diekspor ke berbagai benua.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-wood-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-wood-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-warm-600">
                        Batas Wilayah
                      </h4>
                      <p className="text-xs text-warm-900 mt-1 leading-snug">
                        Utara: Kel. Woloan Satu • Selatan: Kel. Woloan Dua •
                        Timur: Taratara • Barat: Lereng Lokon
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-warm-600">
                        Keunggulan Utama
                      </h4>
                      <p className="text-xs text-warm-900 mt-1 leading-snug">
                        Sentra Ekspor Rumah Kayu, Holtikultura Krisan, serta
                        Kerajinan & Kuliner Tradisional Minahasa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visi & Misi */}
              <div className="bg-wood-900 text-white rounded-2xl p-6 sm:p-8 shadow-warm-md border border-wood-800">
                <div className="inline-block px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
                  VISI & MISI KELURAHAN
                </div>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-amber-200 mb-2">
                  "Terwujudnya Kelurahan Woloan Satu Utara yang Maju, Berdaya
                  Saing, Berbasis Industri Rumah Kayu dan UMKM yang
                  Berkelanjutan"
                </h4>
                <div className="mt-4 space-y-2.5 text-xs sm:text-sm text-wood-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Meningkatkan kualitas pelayanan administrasi kelurahan
                      yang transparan, cepat, dan berbasis digital.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Mendorong ekosistem industri rumah panggung kayu Woloan
                      berstandar global dengan kelestarian bahan baku.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Memberdayakan ekonomi kerakyatan melalui digitalisasi dan
                      pendampingan UMKM kuliner dan kerajinan.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Memperkokoh kerukunan masyarakat berlandaskan kearifan
                      lokal Mapalus dan nilai budaya Minahasa.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Mini Highlights Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-forest-900 text-white rounded-2xl p-6 sm:p-7 shadow-warm-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-forest-700/30 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                <span className="text-xs uppercase font-bold tracking-wider text-forest-300 bg-forest-800/80 px-2.5 py-1 rounded">
                  Filosofi Budaya
                </span>
                <h4 className="font-serif text-xl font-bold mt-3 mb-2 text-white">
                  Semangat Mapalus Warga Woloan
                </h4>
                <p className="text-xs sm:text-sm text-forest-100 leading-relaxed">
                  Mapalus adalah sistem gotong-royong tradisional suku Minahasa.
                  Di Woloan 1 Utara, ketika seorang perajin membangun atau
                  merakit kerangka rumah panggung besar, para tetangga dan
                  sesama tukang kayu saling bahu-membahu menegakkan tiang
                  pancang. Semangat kekeluargaan inilah yang menjaga kualitas
                  seni kayu tetap abadi.
                </p>
                <div className="mt-5 p-3 rounded-xl bg-forest-800/70 border border-forest-700/60 text-xs text-forest-200">
                  <span className="font-semibold text-amber-300">
                    Si Tou Timou Tumou Tou:
                  </span>{" "}
                  Manusia hidup untuk memanusiakan orang lain — filosofi Sam
                  Ratulangi yang senantiasa dihidupi warga Woloan.
                </div>
              </div>

              <div className="bg-warm-50 rounded-2xl p-6 border border-warm-200 shadow-warm-sm">
                <h4 className="font-serif text-base font-bold text-wood-950 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-wood-700" />
                  <span>Kantor Kelurahan Woloan Satu Utara</span>
                </h4>
                <ul className="text-xs sm:text-sm text-warm-700 space-y-2">
                  <li className="flex justify-between py-1 border-b border-warm-200">
                    <span className="text-warm-500">Alamat:</span>
                    <span className="font-medium text-warm-900 text-right">
                      Jl. Raya Woloan, Tomohon Barat
                    </span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-warm-200">
                    <span className="text-warm-500">Jam Pelayanan:</span>
                    <span className="font-medium text-warm-900">
                      Senin - Jumat (08.00 - 16.00 WITA)
                    </span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-warm-200">
                    <span className="text-warm-500">Wilayah Lingkungan:</span>
                    <span className="font-medium text-warm-900">
                      6 Lingkungan (Lingk. I - VI)
                    </span>
                  </li>
                  <li className="flex justify-between py-1">
                    <span className="text-warm-500">Kode Pos:</span>
                    <span className="font-medium text-warm-900">95431</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Struktur Organisasi */}
        {activeTab === "struktur" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-wood-950 mb-2 text-center">
                Aparatur Pemerintah Kelurahan
              </h3>
              <p className="text-xs sm:text-sm text-warm-600 text-center mb-8">
                Pelayan masyarakat yang berdedikasi memajukan Woloan Satu Utara
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {VILLAGE_OFFICIALS.map((official, idx) => (
                  <div
                    key={idx}
                    className="bg-warm-50 rounded-2xl overflow-hidden border border-wood-200/80 shadow-warm-sm hover:shadow-warm-md transition-all group"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-wood-200">
                      <img
                        src={official.photoUrl}
                        alt={official.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h4 className="font-serif font-bold text-base text-wood-950 leading-snug">
                        {official.name}
                      </h4>
                      <p className="text-xs font-semibold text-wood-700 mt-1">
                        {official.position}
                      </p>
                      {official.nip && (
                        <p className="text-[11px] text-warm-500 font-mono mt-1">
                          NIP: {official.nip}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kepala Lingkungan (Pala) */}
            <div className="space-y-6">
              <div className="bg-warm-100/70 rounded-2xl p-5 sm:p-7 border border-wood-200">
                <h4 className="font-serif text-lg font-bold text-wood-950 mb-1 text-center">
                  Kepala Lingkungan (Pala) Woloan Satu Utara
                </h4>
                <p className="text-xs text-warm-600 text-center mb-6">
                  Ujung tombak pelayanan ketertiban dan kemasyarakatan di
                  tingkat lingkungan
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LINGKUNGAN_HEADS.map((head, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-4 border border-warm-200 shadow-2xs hover:border-wood-400 transition-colors min-w-0"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                        Lingkungan {idx + 1}
                      </span>
                      <h5 className="font-bold text-sm text-warm-900 mt-2 break-words">
                        {head.name || "Nama belum tersedia"}
                      </h5>
                      <p className="text-xs text-wood-700 font-medium">
                        {head.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-warm-100/70 rounded-2xl p-5 sm:p-7 border border-wood-200">
                <h4 className="font-serif text-lg font-bold text-wood-950 mb-1 text-center">
                  Wakil Kepala Lingkungan
                </h4>
                <p className="text-xs text-warm-600 text-center mb-6">
                  Perwakilan pelayanan untuk enam lingkungan di Woloan Satu
                  Utara
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LINGKUNGAN_DEPUTIES.map((deputy, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-4 border border-warm-200 shadow-2xs hover:border-wood-400 transition-colors min-w-0"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                        Lingkungan {idx + 1}
                      </span>
                      <h5 className="font-bold text-sm text-warm-900 mt-2 break-words">
                        {deputy.name || "Nama belum tersedia"}
                      </h5>
                      <p className="text-xs text-wood-700 font-medium">
                        {deputy.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Layanan Administrasi */}
        {activeTab === "layanan" && (
          <div className="animate-in fade-in duration-300">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-warm-50 rounded-2xl p-6 border border-wood-200 shadow-warm-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-wood-100 text-wood-800 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-lg font-bold text-wood-950">
                      Surat Keterangan Usaha (SKU) & Rekomendasi Industri Kayu
                    </h4>
                    <p className="text-xs sm:text-sm text-warm-700 mt-1 leading-relaxed">
                      Layanan bagi para perajin rumah panggung dan pelaku UMKM
                      di Woloan 1 Utara yang membutuhkan legalitas kelurahan
                      untuk pengajuan izin usaha, permodalan perbankan (KUR),
                      maupun verifikasi kemitraan ekspor.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-warm-600">
                      <span className="bg-white px-2 py-1 rounded border border-warm-200">
                        Persyaratan: KTP & KK Woloan
                      </span>
                      <span className="bg-white px-2 py-1 rounded border border-warm-200">
                        Surat Pengantar Kepala Lingkungan (Pala)
                      </span>
                      <span className="bg-white px-2 py-1 rounded border border-warm-200">
                        Foto Lokasi Usaha
                      </span>
                      <span className="bg-forest-100 text-forest-800 px-2 py-1 rounded font-bold">
                        Waktu Selesai: 1 Hari Kerja (Gratis)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-warm-50 rounded-2xl p-6 border border-wood-200 shadow-warm-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-wood-100 text-wood-800 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-lg font-bold text-wood-950">
                      Surat Keterangan Asal-Usul & Pengiriman Kayu (SKAU
                      Pengantar)
                    </h4>
                    <p className="text-xs sm:text-sm text-warm-700 mt-1 leading-relaxed">
                      Pengantar administratif bagi pengusaha rumah panggung yang
                      hendak mengirimkan rakitan rumah kayu knockdown ke luar
                      daerah Tomohon, lintas provinsi, maupun pelabuhan peti
                      kemas Bitung.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-warm-600">
                      <span className="bg-white px-2 py-1 rounded border border-warm-200">
                        Rincian Dokumen Bahan Baku Kayu
                      </span>
                      <span className="bg-white px-2 py-1 rounded border border-warm-200">
                        Data Pemesan / Lokasi Tujuan
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-warm-50 rounded-2xl p-6 border border-wood-200 shadow-warm-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-wood-100 text-wood-800 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-lg font-bold text-wood-950">
                      Layanan Administrasi Kependudukan Umum
                    </h4>
                    <p className="text-xs sm:text-sm text-warm-700 mt-1 leading-relaxed">
                      Pelayanan surat pengantar pembuatan KTP-el, Kartu
                      Keluarga, Akta Kelahiran, Surat Keterangan Domisili, dan
                      Surat Keterangan Tidak Mampu (SKTM).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Program KKT */}
        {activeTab === "kkt" && (
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-warm-100 via-wood-50 to-warm-100 rounded-3xl p-6 sm:p-10 border border-wood-300 shadow-warm-md animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-wood-800 text-white flex items-center justify-center shadow-warm-sm">
                <GraduationCap className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-2 py-0.5 rounded">
                  PENGABDIAN MASYARAKAT
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-wood-950">
                  Kolaborasi Proyek KKT Mahasiswa 2026
                </h3>
              </div>
            </div>

            <p className="text-warm-800 text-sm sm:text-base leading-relaxed mb-6">
              Website ini dikembangkan sebagai karya nyata program Kuliah Kerja
              Terpadu (KKT) dalam rangka mendukung digitalisasi potensi desa di
              Kelurahan Woloan Satu Utara. Mengintegrasikan profil resmi
              pemerintahan dengan platform promosi komersial bagi perajin rumah
              panggung dan pelaku UMKM lokal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-wood-200">
              <div className="bg-white/80 p-4 rounded-xl border border-warm-200">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2 font-bold text-sm">
                  01
                </div>
                <h5 className="font-bold text-sm text-warm-900">
                  Etalase Digital Global
                </h5>
                <p className="text-xs text-warm-600 mt-1">
                  Membuka akses pasar online lebih luas bagi bengkel rumah
                  panggung ke kancah internasional.
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-xl border border-warm-200">
                <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center mb-2 font-bold text-sm">
                  02
                </div>
                <h5 className="font-bold text-sm text-warm-900">
                  Pemberdayaan UMKM
                </h5>
                <p className="text-xs text-warm-600 mt-1">
                  Mendata dan mempromosikan produk lokal seperti souvenir
                  miniatur, klappertaart, dan kopi lereng Lokon.
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-xl border border-warm-200">
                <div className="w-8 h-8 rounded-lg bg-wood-100 text-wood-800 flex items-center justify-center mb-2 font-bold text-sm">
                  03
                </div>
                <h5 className="font-bold text-sm text-warm-900">
                  Transparansi Profil Desa
                </h5>
                <p className="text-xs text-warm-600 mt-1">
                  Menyajikan informasi wilayah, struktur aparatur, dan panduan
                  layanan publik secara informatif.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
