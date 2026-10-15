import React from "react";
import { MapPin, Phone, Clock, GraduationCap, Compass } from "lucide-react";

export const VillageMapAndContact: React.FC = () => {
  return (
    <section
      id="kontak"
      className="scroll-mt-24 py-16 lg:py-24 bg-warm-100/60 border-t border-wood-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wood-200 text-wood-950 text-xs font-semibold mb-3 border border-wood-300">
            <Compass className="w-3.5 h-3.5 text-wood-700" />
            <span>Peta & Pusat Informasi</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wood-950 tracking-tight">
            Lokasi Kelurahan & Hubungi Kami
          </h2>
          <p className="mt-3 text-warm-700 text-sm sm:text-base leading-relaxed">
            Temukan lokasi kelurahan dan informasi kunjungan di Woloan 1 Utara.
            Saluran kontak resmi akan dimuat setelah dikonfirmasi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map & Direction Guidance */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-wood-200 shadow-warm-md">
              {/* Responsive Google Maps Embed for Tomohon Barat / Woloan */}
              <div className="aspect-[16/10] w-full bg-warm-200 relative">
                <iframe
                  title="Peta Kelurahan Woloan Satu Utara"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9774.52008326516!2d124.80911714450899!3d1.324638220649658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32876c61672ed08b%3A0xa93c835d0e1f8c66!2sNorth%20Woloan%20Satu%2C%20Tomohon%20Barat%2C%20Tomohon%20City%2C%20North%20Sulawesi!5e1!3m2!1sen!2sid!4v1792076420473!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Location notes */}
              <div className="p-6 bg-white">
                <h4 className="font-serif font-bold text-base text-wood-950 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-wood-700" />
                  <span>Petunjuk Arah Menuju Sentra Woloan 1 Utara:</span>
                </h4>
                <ul className="text-xs sm:text-sm text-warm-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-wood-800">
                      • Dari Pusat Kota Tomohon:
                    </span>
                    <span>
                      Hanya berjarak sekitar 3 km (± 8–10 menit perjalanan darat
                      ke arah Tomohon Barat).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-wood-800">
                      • Dari Bandara Sam Ratulangi (Manado):
                    </span>
                    <span>
                      ± 35 km menyusuri jalur wisata Manado - Tomohon (± 60
                      menit dengan mobil).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-wood-800">
                      • Suasana Kunjungan:
                    </span>
                    <span>
                      Di sepanjang jalan utama Woloan 1 Utara, pengunjung dapat
                      melihat langsung proses perakitan rumah panggung kayu di
                      bengkel-bengkel terbuka.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Office Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-wood-200 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-wood-100 text-wood-800 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-wood-700" />
                </div>
                <h5 className="font-bold text-sm text-warm-900">
                  Jam Pelayanan Kelurahan
                </h5>
                <p className="text-xs text-warm-600 mt-1">
                  Informasi jam pelayanan akan dimuat setelah dikonfirmasi oleh
                  kelurahan.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-wood-200 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5 text-forest-700" />
                </div>
                <h5 className="font-bold text-sm text-warm-900">
                  Saluran Kontak
                </h5>
                <p className="text-xs text-warm-600 mt-1">
                  Nomor telepon dan email resmi belum tersedia untuk
                  dipublikasikan.
                </p>
              </div>
            </div>
          </div>

          {/* Contact / Inquiry Form & KKT Highlight */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="font-serif text-xl font-bold text-wood-950">
                Informasi Kontak
              </h3>
              <p className="mt-2 text-sm leading-6 text-warm-700">
                Saluran pesan langsung belum tersedia. Kami akan menampilkan
                kontak kantor setelah petugas mengonfirmasi nomor dan alamat
                email resmi.
              </p>
            </div>

            {/* KKT Credits Badge Box */}
            <div className="bg-gradient-to-br from-wood-900 to-wood-950 text-white rounded-3xl p-6 sm:p-7 shadow-warm-md border border-wood-800 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                    KARYA PENGABDIAN
                  </span>
                  <h4 className="font-serif text-base font-bold text-white mt-0.5">
                    Proyek KKT Woloan 1 Utara 2026
                  </h4>
                </div>
              </div>
              <p className="text-xs text-wood-200 leading-relaxed">
                Platform ini dipersembahkan oleh Mahasiswa Kuliah Kerja Terpadu
                (KKT) dalam upaya mendukung akselerasi digital bagi Kelurahan
                Woloan Satu Utara. Bersama memajukan warisan budaya rumah
                panggung Minahasa dan memberdayakan seluruh UMKM warga.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
