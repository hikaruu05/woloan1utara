import React, { useState } from 'react';
import { MapPin, Phone, Clock, Send, GraduationCap, Compass } from 'lucide-react';
import { useData } from '../context/DataContext';

export const VillageMapAndContact: React.FC = () => {
  const { showToast } = useData();

  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderMsg, setSenderMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderMsg.trim()) return;

    // Simulate sending message to village admin
    showToast(
      'Pesan Terkirim!',
      'Terima kasih! Pesan/aspirasi Anda telah disampaikan ke pihak Kelurahan Woloan 1 Utara.',
      'success'
    );
    setSenderName('');
    setSenderPhone('');
    setSenderMsg('');
  };

  return (
    <section id="kontak" className="py-16 lg:py-24 bg-warm-100/60 border-t border-wood-200">
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
            Kunjungi sentra bengkel rumah panggung terbuka di Woloan 1 Utara atau hubungi perangkat kelurahan 
            dan tim KKT untuk informasi lebih lanjut.
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15954.912643892784!2d124.7952763!3d1.3283333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32873ee0ff0fdb39%3A0x6e9f138e217d473b!2sWoloan%20Satu%2C%20Kec.%20Tomohon%20Bar.%2C%20Kota%20Tomohon%2C%20Sulawesi%20Utara!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
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
                    <span className="font-bold text-wood-800">• Dari Pusat Kota Tomohon:</span>
                    <span>Hanya berjarak sekitar 3 km (± 8–10 menit perjalanan darat ke arah Tomohon Barat).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-wood-800">• Dari Bandara Sam Ratulangi (Manado):</span>
                    <span>± 35 km menyusuri jalur wisata Manado - Tomohon (± 60 menit dengan mobil).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-wood-800">• Suasana Kunjungan:</span>
                    <span>Di sepanjang jalan utama Woloan 1 Utara, pengunjung dapat melihat langsung proses perakitan rumah panggung kayu di bengkel-bengkel terbuka.</span>
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
                <h5 className="font-bold text-sm text-warm-900">Jam Pelayanan Kelurahan</h5>
                <p className="text-xs text-warm-600 mt-1">
                  Senin s/d Jumat: 08.00 - 16.00 WITA<br />
                  Sabtu, Minggu & Hari Libur Nasional Tutup
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-wood-200 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5 text-forest-700" />
                </div>
                <h5 className="font-bold text-sm text-warm-900">Saluran Kontak</h5>
                <p className="text-xs text-warm-600 mt-1">
                  WhatsApp Pelayanan: 0812-4411-XXXX<br />
                  Email: kel.woloan1utara@tomohon.go.id
                </p>
              </div>
            </div>
          </div>

          {/* Contact / Inquiry Form & KKT Highlight */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-wood-200 shadow-warm-md">
              <h3 className="font-serif text-xl font-bold text-wood-950 mb-1">
                Kirim Pertanyaan & Saran
              </h3>
              <p className="text-xs text-warm-600 mb-5">
                Ada pertanyaan tentang izin usaha, pemesanan rumah panggung, atau produk UMKM? Tuliskan pesan Anda di bawah ini.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-warm-200 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-wood-500 bg-warm-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-warm-200 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-wood-500 bg-warm-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 mb-1">Isi Pesan / Pertanyaan *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pertanyaan mengenai pemesanan rumah panggung, produk UMKM, atau aspirasi kelurahan..."
                    value={senderMsg}
                    onChange={(e) => setSenderMsg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-warm-200 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-wood-500 bg-warm-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-wood-800 hover:bg-wood-900 transition-all flex items-center justify-center gap-2 shadow-warm-sm"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </form>
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
                Platform ini dipersembahkan oleh Mahasiswa Kuliah Kerja Terpadu (KKT) dalam upaya 
                mendukung akselerasi digital bagi Kelurahan Woloan Satu Utara. Bersama memajukan 
                warisan budaya rumah panggung Minahasa dan memberdayakan seluruh UMKM warga.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
