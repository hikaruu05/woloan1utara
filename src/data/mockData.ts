import { RumahPanggung, UMKMStore, VillageOfficial, VillageStat } from '../types';

export const INITIAL_RUMAH_PANGGUNG: RumahPanggung[] = [
  {
    id: 'rp-1',
    title: 'Rumah Panggung Walewangko Klasik Minahasa (9 x 11 m)',
    type: 'tradisional',
    dimensions: '9 x 11 Meter',
    woodTypes: ['Kayu Aliwowos', 'Kayu Cempaka Wasian'],
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    priceEstimated: 'Rp 175.000.000 - Rp 215.000.000',
    minBudget: 175000000,
    craftsmanName: 'Bengkel Kayu "Matuari Indah Woloan"',
    craftsmanPhone: '6281244556677',
    craftsmanAddress: 'Jl. Rurukan Lingkungan II, Kelurahan Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.328333,124.795276',
    description: 'Rumah panggung arsitektur tradisional Minahasa tipe Walewangko dengan tiang balok kayu Aliwowos kokoh tahan gempa. Dilengkapi tangga kembar di fasad depan berukir motif relief khas Minahasa. Kayu telah melalui proses oven dan anti-rayap alami.',
    features: [
      'Kayu Aliwowos & Cempaka Grade Super',
      'Konstruksi Pasak Knockdown (Bongkar Pasang)',
      'Tangga Kembar Simetris Ukir Minahasa',
      'Rangka Plafon & Lisplang Kayu Profil Halus',
      'Termasuk Perakitan Percobaan di Bengkel',
      'Tahan Guncangan Gempa'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-02-15'
  },
  {
    id: 'rp-2',
    title: 'Villa Panggung Tropis Modern 2 Lantai (8 x 12 m)',
    type: 'dua_lantai',
    dimensions: '8 x 12 Meter',
    woodTypes: ['Kayu Besi', 'Kayu Aliwowos', 'Kayu Nantu'],
    bedrooms: 4,
    bathrooms: 3,
    floors: 2,
    priceEstimated: 'Rp 290.000.000 - Rp 360.000.000',
    minBudget: 290000000,
    craftsmanName: 'CV. Karya Esa Woloan Timber',
    craftsmanPhone: '6281398765432',
    craftsmanAddress: 'Kompleks Sentra Industri Kayu, Lingkungan I, Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.329100,124.793800',
    description: 'Desain villa panggung kontemporer dua lantai yang sangat digemari investor resort dan perumahan wisata di Bali, Lombok, hingga mancanegara. Lantai dasar multifungsi semi-terbuka dengan tiang ekspos gagah, serta balkon lantai dua berpemandangan panorama alam.',
    features: [
      'Struktur 2 Lantai dengan Tiang Kayu Besi Solid',
      'Balkon Luas Mengelilingi Lantai Atas',
      'Kusen Pintu & Jendela Kaca Geser Lebar',
      'Sistem Knockdown Teruji Ekspor ke 10+ Negara',
      'Finishing Natural Polyurethane / Water-based Eco-friendly',
      'Instalasi Listrik & Saluran Air Pre-drilled'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-03-01'
  },
  {
    id: 'rp-3',
    title: 'Rumah Kayu Panggung Minimalis Santai (7 x 9 m)',
    type: 'minimalis',
    dimensions: '7 x 9 Meter',
    woodTypes: ['Kayu Cempaka Wasian', 'Kayu Aliwowos'],
    bedrooms: 2,
    bathrooms: 1,
    floors: 1,
    priceEstimated: 'Rp 120.000.000 - Rp 150.000.000',
    minBudget: 120000000,
    craftsmanName: 'Bengkel Kayu "Tou Mu\'ung"',
    craftsmanPhone: '6282188990011',
    craftsmanAddress: 'Lingkungan III, Kelurahan Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.327500,124.796100',
    description: 'Pilihan ideal untuk rumah kebun, homestay asri, atau hunian keluarga berkonsep minimalis tropis. Menghadirkan kesejukan kayu cempaka wasian yang harum alami dengan tata ruang efisien dan pencahayaan matahari optimal.',
    features: [
      'Ukuran Ideal untuk Lahan Sedang',
      'Kayu Cempaka Wasian Pilihan Wangi Alami',
      'Teras Depan Lapang untuk Bersantai',
      'Pengerjaan Cepat (35 - 45 Hari Kerja)',
      'Bisa Diangkut dengan Kontainer Standar 20/40 Feet'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80'
    ],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-03-10'
  },
  {
    id: 'rp-4',
    title: 'Gazebo & Bale Kayu Artistik Ukiran Woloan (4 x 4 m)',
    type: 'gazebo',
    dimensions: '4 x 4 Meter',
    woodTypes: ['Kayu Aliwowos', 'Kayu Cempaka Wasian'],
    bedrooms: 0,
    bathrooms: 0,
    floors: 1,
    priceEstimated: 'Rp 28.000.000 - Rp 38.000.000',
    minBudget: 28000000,
    craftsmanName: 'Sanggar Ukir Kayu Woloan Indah',
    craftsmanPhone: '6285240112233',
    craftsmanAddress: 'Lingkungan IV, Kelurahan Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.326800,124.797200',
    description: 'Gazebo panggung peneduh taman, kafe terbuka, pelengkap villa, atau area santai keluarga. Tiang kayu solid bundar berukir rapi dengan atap sirap kayu / genteng metal yang tahan terhadap cuaca panas dan hujan tropis.',
    features: [
      'Ukiran Khas Ornamen Geometris Minahasa',
      'Tiang Kayu Bulat / Persegi Solid Aliwowos',
      'Pemasangan Sangat Cepat (1 Hari Selesai)',
      'Finishing Tahan Air & Cuaca Luar Ruang'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-03-12'
  },
  {
    id: 'rp-5',
    title: 'Cottage Panggung Resor Tipe Studio Wisata (6 x 8 m)',
    type: 'villa',
    dimensions: '6 x 8 Meter',
    woodTypes: ['Kayu Aliwowos', 'Kayu Nantu'],
    bedrooms: 1,
    bathrooms: 1,
    floors: 1,
    priceEstimated: 'Rp 95.000.000 - Rp 120.000.000',
    minBudget: 95000000,
    craftsmanName: 'Pengrajin Kayu "Lokon View Woodcraft"',
    craftsmanPhone: '6289655443322',
    craftsmanAddress: 'Lingkungan I, Dekat Jalur Agrowisata Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.330200,124.792500',
    description: 'Unit cottage panggung eksklusif yang sangat cocok untuk pengembangan ekowisata, glamping resort, dan penginapan boutique. Dibuat presisi sehingga saat dirakit di lokasi terpencil sekalipun dapat berdiri kuat tanpa alat berat.',
    features: [
      'Konsep Studio Room Terpadu dengan Kamar Mandi Dalam',
      'Balkon Depan dengan Pagar Silang Kayu Estetik',
      'Insulasi Atap Peredam Suara Hujan & Panas',
      'Pengepakan Kompak Siap Kirim Lintas Lautan'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80'
    ],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-03-18'
  },
  {
    id: 'rp-6',
    title: 'Rumah Adat Minahasa Walewangko Grand Heritage (10 x 14 m)',
    type: 'tradisional',
    dimensions: '10 x 14 Meter',
    woodTypes: ['Kayu Besi Tua', 'Kayu Aliwowos', 'Kayu Cempaka Wasian Super'],
    bedrooms: 4,
    bathrooms: 3,
    floors: 1,
    priceEstimated: 'Rp 340.000.000 - Rp 420.000.000',
    minBudget: 340000000,
    craftsmanName: 'Kelompok Pengrajin Bersatu Woloan Satu Utara',
    craftsmanPhone: '628114321789',
    craftsmanAddress: 'Pusat Workshop Kayu Terpadu, Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.328800,124.794400',
    description: 'Mahakarya arsitektur leluhur Minahasa dengan bentang ruang luas tanpa banyak sekat yang membatasi sirkulasi udara. Tiang utama penopang menggunakan kayu besi pilihan berdiameter besar, memberikan kegagahan dan keabadian tempat tinggal hingga lintas generasi.',
    features: [
      'Kayu Pilihan Berumur Tua dengan Pengeringan Maksimal',
      'Fasad Tradisional Penuh Detail Ukir Tumpal & Daun',
      'Ruang Tamu & Ruang Keluarga Berkonsep Open-Space Megah',
      'Pendampingan Teknisi Ahli Perakitan Langsung ke Lokasi Pembeli'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
    ],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-03-22'
  },
  {
    id: 'rp-7',
    title: 'Rumah Panggung Modern Minimalis Pintu Kaca (6 x 10 m)',
    type: 'minimalis',
    dimensions: '6 x 10 Meter',
    woodTypes: ['Kayu Aliwowos', 'Kayu Cempaka Wasian'],
    bedrooms: 2,
    bathrooms: 1,
    floors: 1,
    priceEstimated: 'Rp 115.000.000 - Rp 140.000.000',
    minBudget: 115000000,
    craftsmanName: 'Bengkel Kayu "Lestari Woloan"',
    craftsmanPhone: '6281255443322',
    craftsmanAddress: 'Jl. Utama Woloan 1 Utara, Lingkungan II',
    mapsUrl: 'https://maps.google.com/?q=1.328100,124.795000',
    description: 'Konsep modern yang menggabungkan kayu hangat dengan bukaan kaca lebar. Memberikan kesan lapang dan pencahayaan matahari berlimpah, sangat cocok untuk perumahan di perkotaan maupun vila perbukitan.',
    features: [
      'Desain Minimalis Kontemporer',
      'Pintu & Jendela Kaca Alami',
      'Lantai Kayu Halus Anti Gores',
      'Garansi Struktur Kayu 3 Tahun'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-03-25'
  },
  {
    id: 'rp-8',
    title: 'Villa Panggung Etnik Kayu Ulin & Besi (9 x 12 m)',
    type: 'dua_lantai',
    dimensions: '9 x 12 Meter',
    woodTypes: ['Kayu Besi', 'Kayu Cempaka Wasian'],
    bedrooms: 3,
    bathrooms: 3,
    floors: 2,
    priceEstimated: 'Rp 310.000.000 - Rp 380.000.000',
    minBudget: 310000000,
    craftsmanName: 'CV. Mahawu Megah Wood',
    craftsmanPhone: '6281344221100',
    craftsmanAddress: 'Lingkungan I, Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.329500,124.794200',
    description: 'Rumah panggung 2 lantai dengan sentuhan arsitektur etnik Minahasa modern. Bagian bawah dapat difungsikan sebagai ruang keluarga terbuka atau kafe mini santai.',
    features: [
      'Struktur Dua Lantai Tahan Gempa',
      'Balkon Luas View Pegunungan',
      'Kayu Besi Tua Anti Air & Rayap',
      'Sistem Knockdown Lengkap Kode Pemasangan'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-03-28'
  },
  {
    id: 'rp-9',
    title: 'Gazebo Paviliun Kayu Segi Enam Hexagonal (5 x 5 m)',
    type: 'gazebo',
    dimensions: '5 x 5 Meter',
    woodTypes: ['Kayu Aliwowos', 'Kayu Cempaka Wasian'],
    bedrooms: 0,
    bathrooms: 0,
    floors: 1,
    priceEstimated: 'Rp 35.000.000 - Rp 45.000.000',
    minBudget: 35000000,
    craftsmanName: 'Bengkel Ukir "Kawanua Sejahtera"',
    craftsmanPhone: '6285211223344',
    craftsmanAddress: 'Lingkungan IV, Dekat Lapangan Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.326500,124.796800',
    description: 'Paviliun gazebo unik berbentuk hexagonal (segi enam) dengan ornamen ukir khas Minahasa. Pilihan tepat untuk restoran, resort, atau tempat kumpul keluarga di pekarangan rumah.',
    features: [
      'Bentuk Hexagonal Artistik',
      'Ukiran Detail Halus di Tiang & Lisplang',
      'Atap Sirap Kayu Asli / Multi-atap',
      'Instalasi Mudah Cepat Selesai'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-04-01'
  },
  {
    id: 'rp-10',
    title: 'Rumah Panggung Keluarga Hangat Tipe Walewangko (8 x 10 m)',
    type: 'tradisional',
    dimensions: '8 x 10 Meter',
    woodTypes: ['Kayu Aliwowos', 'Kayu Cempaka Wasian'],
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    priceEstimated: 'Rp 160.000.000 - Rp 195.000.000',
    minBudget: 160000000,
    craftsmanName: 'Bengkel Kayu "Tou Mu\'ung"',
    craftsmanPhone: '6282188990011',
    craftsmanAddress: 'Lingkungan III, Kelurahan Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.327600,124.795800',
    description: 'Model rumah panggung paling favorit untuk keluarga inti. Ukuran yang pas untuk tanah perumahan dengan tata ruang 3 kamar tidur, ruang tamu luas, dan teras santai menghadap depan.',
    features: [
      'Model Paling Dicari & Teruji',
      'Kayu Cempaka Wasian Harum Alami',
      'Tangga Ganda Khas Rumah Minahasa',
      'Kualitas Ekspor Knockdown'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-04-03'
  },
  {
    id: 'rp-11',
    title: 'Cottage Glamping Resor Ekowisata (5 x 7 m)',
    type: 'villa',
    dimensions: '5 x 7 Meter',
    woodTypes: ['Kayu Aliwowos', 'Kayu Nantu'],
    bedrooms: 1,
    bathrooms: 1,
    floors: 1,
    priceEstimated: 'Rp 85.000.000 - Rp 105.000.000',
    minBudget: 85000000,
    craftsmanName: 'Pengrajin Kayu "Lokon View Woodcraft"',
    craftsmanPhone: '6289655443322',
    craftsmanAddress: 'Lingkungan I, Dekat Jalur Agrowisata Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.330200,124.792500',
    description: 'Unit mungil namun elegan untuk perhotelan alam, agrowisata, dan glamping. Cepat dipasang, hemat ruang, serta memiliki daya tarik foto yang disukai wisatawan.',
    features: [
      'Ukuran Kompak Siap Kirim Peti Kemas',
      'Kamar Mandi Dalam Terpadu',
      'Pencahayaan Alami Estetik',
      'Tahan Cuaca Pegunungan & Lembab'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80'],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-04-05'
  },
  {
    id: 'rp-12',
    title: 'Rumah Kayu Panggung Besar Komunal (12 x 16 m)',
    type: 'tradisional',
    dimensions: '12 x 16 Meter',
    woodTypes: ['Kayu Besi', 'Kayu Aliwowos', 'Kayu Cempaka Wasian'],
    bedrooms: 5,
    bathrooms: 4,
    floors: 1,
    priceEstimated: 'Rp 450.000.000 - Rp 580.000.000',
    minBudget: 450000000,
    craftsmanName: 'Kelompok Pengrajin Bersatu Woloan Satu Utara',
    craftsmanPhone: '628114321789',
    craftsmanAddress: 'Pusat Workshop Kayu Terpadu, Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.328800,124.794400',
    description: 'Mahakarya skala besar untuk rumah keluarga besar, aula serbaguna budaya, kantor perwakilan adat, maupun gedung pertemuan eksklusif bernuansa alam kayu Minahasa.',
    features: [
      'Bentang Ruang Sangat Luas Tanpa Sekat Rumit',
      'Tiang Kayu Besi Berdiameter Jumbo',
      'Sistem Sirkulasi Udara Silang Alami',
      'Ketahanan Struktur Jangka Panjang Lintas Generasi'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'],
    isVerified: true,
    isCustomAllowed: true,
    createdAt: '2026-04-08'
  }
];

export const INITIAL_UMKM_STORES: UMKMStore[] = [
  {
    id: 'store-1',
    name: 'Woloan Souvenir & Woodcraft Studio',
    ownerName: 'Bpk. Meidy Tangkuman',
    category: 'kerajinan',
    phone: '6281299887766',
    address: 'Lingkungan II, Depan Gereja GMIM Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.328333,124.795276',
    description: 'Pusat kerajinan miniatur rumah panggung Minahasa dan aneka cenderamata kayu cempaka wasian asli. Dibuat presisi oleh perajin kayu lokal dengan kualitas ekspor.',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    badge: 'Sentra Kerajinan Kayu',
    isVerified: true,
    createdAt: '2026-02-20',
    products: [
      {
        id: 'p-101',
        name: 'Miniatur Rumah Panggung Walewangko (Skala 1:50)',
        price: 'Rp 350.000',
        priceNum: 350000,
        unit: 'per unit kotak mika',
        description: 'Miniatur rumah panggung kayu cempaka wasian lengkap dengan tangga kembar dan kotak display mika.',
        imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'p-102',
        name: 'Plakat & Relief Ukir Kayu Motif Burung Manguni',
        price: 'Rp 220.000',
        priceNum: 220000,
        unit: 'per pcs',
        description: 'Hiasan dinding ukir kayu artistik simbol kearifan suku Minahasa.',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'p-103',
        name: 'Gantungan Kunci & Asbak Kayu Cempaka Wasian',
        price: 'Rp 25.000',
        priceNum: 25000,
        unit: 'per pcs',
        description: 'Souvenir ekonomis beraroma harum kayu cempaka khas Woloan.',
        imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'store-2',
    name: 'Dapur Oma Tilly Woloan',
    ownerName: 'Ibu Mathilda Supit',
    category: 'kuliner',
    phone: '6285397123456',
    address: 'Lingkungan I, Jl. Siswa Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.329200,124.793500',
    description: 'Produsen kue tradisional legendaris Tomohon. Terkenal dengan Klappertaart panggang kelapa muda segar bertekstur melted dan aneka kue basah Minahasa.',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    badge: 'Kuliner Legendaris',
    isVerified: true,
    createdAt: '2026-02-25',
    products: [
      {
        id: 'p-201',
        name: 'Klappertaart Panggang Premium (Almond & Kismis)',
        price: 'Rp 65.000 - Rp 165.000',
        priceNum: 65000,
        unit: 'cup sedang / loyang besar',
        description: 'Resep turun-temurun kelapa muda pilihan dengan susu, kayu manis wangi, dan taburan kenari panggang.',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'p-202',
        name: 'Kue Cucur Gula Aren Minahasa Asli',
        price: 'Rp 30.000',
        priceNum: 30000,
        unit: 'isi 10 pcs',
        description: 'Cucur berserat merekah legit harum dengan gula aren murni Tomohon.',
        imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'p-203',
        name: 'Apang Coe & Panada Ikan Cakalang Asap',
        price: 'Rp 35.000',
        priceNum: 35000,
        unit: 'isi 8 pcs',
        description: 'Kue apang manis gurih dipadu dengan panada gurih pedas isi suwiran cakalang.',
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'store-3',
    name: 'Woodware Woloan Lestari',
    ownerName: 'Bpk. Hendra Rorong',
    category: 'kerajinan',
    phone: '6287812345678',
    address: 'Lingkungan III, Kompleks Pengrajin Kayu, Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.327800,124.795900',
    description: 'Peralatan makan, talenan, dan perlengkapan dapur premium dari kayu cempaka dan aliwowos food-grade tanpa lapisan kimia beracun.',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
    badge: 'Produk Ekspor',
    isVerified: true,
    createdAt: '2026-03-02',
    products: [
      {
        id: 'p-301',
        name: 'Set Talenan Kayu Cempaka Wasian (3 Pcs Food-Grade)',
        price: 'Rp 145.000',
        priceNum: 145000,
        unit: 'per set isi 3',
        description: 'Talenan tebal serat artistik, dilapisi beeswax alami tahan jamur dan bakteri.',
        imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'p-302',
        name: 'Piring, Mangkuk & Sendok Kayu Alami',
        price: 'Rp 75.000',
        priceNum: 75000,
        unit: 'per paket makan',
        description: 'Peralatan makan estetik yang ramah lingkungan dan aman untuk hidangan panas maupun dingin.',
        imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'store-4',
    name: 'UD. Rizky Berkah Woloan',
    ownerName: 'Ibu Fatimah Mokodongan',
    category: 'kuliner',
    phone: '6282290123499',
    address: 'Lingkungan IV, Jalur Utama Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.326700,124.797000',
    description: 'Pusat oleh-oleh camilan khas Minahasa. Spesialis kacang goyang warna-warni renyah dan halua kenari gula aren yang selalu menjadi favorit wisatawan.',
    imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
    badge: 'Oleh-Oleh Favorit',
    isVerified: true,
    createdAt: '2026-03-05',
    products: [
      {
        id: 'p-401',
        name: 'Kacang Goyang Tomohon Manis Gurih Renyah',
        price: 'Rp 30.000',
        priceNum: 30000,
        unit: 'toples 400 gram',
        description: 'Kacang tanah pilihan dilapisi karamel gula bertekstur krispi.',
        imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'p-402',
        name: 'Halua Kenari Asli Gula Aren Minahasa',
        price: 'Rp 45.000',
        priceNum: 45000,
        unit: 'pack 300 gram',
        description: 'Kacang kenari hutan berpadu dengan manis legit gula aren murni.',
        imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'store-5',
    name: 'Kopi Tani Lokon Woloan',
    ownerName: 'Bpk. Joutje Polii',
    category: 'pertanian',
    phone: '6281356789012',
    address: 'Jalur Perkebunan Kaki Lokon, Lingkungan I, Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.330500,124.792100',
    description: 'Kelompok tani kopi lereng Gunung Lokon di ketinggian 900-1100 mdpl. Menghasilkan biji kopi arabika & robusta dengan aroma rempah dan acidity yang seimbang.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    badge: 'Petik Merah Pilihan',
    isVerified: true,
    createdAt: '2026-03-12',
    products: [
      {
        id: 'p-501',
        name: 'Kopi Arabika Gunung Lokon Single Origin (Roast Medium)',
        price: 'Rp 65.000',
        priceNum: 65000,
        unit: 'pouch 250 gram',
        description: 'Kopi arabika tanah vulkanik dengan notes dark chocolate, fruity, dan aroma bunga.',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'p-502',
        name: 'Kopi Robusta Tradisional Tomohon (Dark Roast)',
        price: 'Rp 40.000',
        priceNum: 40000,
        unit: 'pouch 250 gram',
        description: 'Kopi kental berkarakter tegas, sangat cocok untuk kopi susu atau kopi tubruk tradisional.',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'store-6',
    name: 'Flora Asri Woloan Satu Utara',
    ownerName: 'Kelompok Wanita Tani (KWT) Woloan',
    category: 'pertanian',
    phone: '6285298112244',
    address: 'Greenhouse Bunga Lingkungan II, Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.328600,124.794900',
    description: 'Budidaya bunga krisan potong, anggrek, dan aneka tanaman hias dataran tinggi khas Kota Bunga Tomohon untuk hiasan rumah, pesta, dan acara resmi.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    badge: 'Segar dari Kebun',
    isVerified: true,
    createdAt: '2026-03-19',
    products: [
      {
        id: 'p-601',
        name: 'Bunga Krisan Potong Aneka Warna (Kuning, Putih, Ungu)',
        price: 'Rp 35.000',
        priceNum: 35000,
        unit: 'ikat (10 tangkai)',
        description: 'Krisan segar petik langsung dari greenhouse berhawa sejuk Woloan.',
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'p-602',
        name: 'Tanaman Hias Pot Pegunungan Tomohon',
        price: 'Rp 50.000 - Rp 150.000',
        priceNum: 50000,
        unit: 'per pot',
        description: 'Tanaman hias daun rimbun penyejuk teras rumah panggung Anda.',
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'store-7',
    name: 'Bake & Cake Mama Grace Woloan',
    ownerName: 'Ibu Grace Pontoh',
    category: 'kuliner',
    phone: '6281344889900',
    address: 'Lingkungan III, Dekat Polindes Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.327400,124.796300',
    description: 'Toko roti dan kue rumahan yang memproduksi klappertaart mini, bagea kenari, dan roti sobek mentega khas Tomohon.',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    badge: 'Kue Rumahan Hangat',
    isVerified: true,
    createdAt: '2026-03-22',
    products: [
      {
        id: 'p-701',
        name: 'Bagea Kenari Krispi Gula Aren',
        price: 'Rp 28.000',
        priceNum: 28000,
        unit: 'kemasan toples',
        description: 'Kue kering tradisional sagu kenari yang lumer di mulut saat dinikmati bersama teh hangat.',
        imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'store-8',
    name: 'Sanggar Ukir Tou Mu\'ung Art',
    ownerName: 'Bpk. Ferry Runtuwene',
    category: 'kerajinan',
    phone: '6282199001122',
    address: 'Lingkungan I, Kompleks Seniman Kayu Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.329800,124.793200',
    description: 'Sanggar pembuat ukiran ornamen tradisional Minahasa, lisplang rumah panggung pesanan khusus, dan lambang adat.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    badge: 'Ukir Ornamen Tradisional',
    isVerified: true,
    createdAt: '2026-03-24',
    products: [
      {
        id: 'p-801',
        name: 'Lisplang Ukir Kayu Cempaka Motif Tumpal (Per Meter)',
        price: 'Rp 120.000',
        priceNum: 120000,
        unit: 'per meter lari',
        description: 'Ornamen penghias atap rumah panggung dengan ukiran khas leluhur Minahasa.',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'store-9',
    name: 'Sayur Segar Organik Kaki Lokon',
    ownerName: 'Bpk. Robby Poluan',
    category: 'pertanian',
    phone: '6285244332211',
    address: 'Lingkungan II, Dekat Perkebunan Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.328900,124.794600',
    description: 'Menyediakan sayur mayur dataran tinggi tanpa pestisida: wortel manis, kubis segar, daun bawang, dan labu siam langsung dari petani.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    badge: '100% Organik',
    isVerified: true,
    createdAt: '2026-03-27',
    products: [
      {
        id: 'p-901',
        name: 'Paket Sayuran Segar Sup Brenebon & Tinutuan',
        price: 'Rp 35.000',
        priceNum: 35000,
        unit: 'per keranjang paket',
        description: 'Bahan lengkap sayuran segar khas masakan Minahasa.',
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'store-10',
    name: 'Jasa Montir & Finishing Kayu Panggung Woloan',
    ownerName: 'Bpk. Steven Kojongian',
    category: 'jasa',
    phone: '6281233445566',
    address: 'Lingkungan III, Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.327900,124.795500',
    description: 'Layanan jasa tukang kayu profesional untuk perakitan rumah knockdown ke seluruh Indonesia, pernis ulang finishing kayu, dan perbaikan atap.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    badge: 'Tukang Ahli Berpengalaman',
    isVerified: true,
    createdAt: '2026-03-29',
    products: [
      {
        id: 'p-1001',
        name: 'Jasa Finishing Ulang Wood Coating Anti-Rayap',
        price: 'Rp 75.000',
        priceNum: 75000,
        unit: 'per meter persegi',
        description: 'Pelapisan kayu ulang dengan bahan ramah lingkungan pelindung jamur dan lumut.',
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'store-11',
    name: 'Kopi Tubruk & Kafe Kayu Woloan',
    ownerName: 'Ibu Novita Supit',
    category: 'kuliner',
    phone: '6281355667788',
    address: 'Lingkungan I, Sudut Panorama Lokon, Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.329700,124.793700',
    description: 'Kedai kopi khas di teras rumah panggung kayu Woloan. Menyajikan seduhan kopi manual brew dan pisang goreng goroho sambal roa.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    badge: 'Kafe View Gunung',
    isVerified: true,
    createdAt: '2026-04-01',
    products: [
      {
        id: 'p-1101',
        name: 'Pisang Goroho Stik Sambal Roa Asap',
        price: 'Rp 25.000',
        priceNum: 25000,
        unit: 'per porsi hangat',
        description: 'Pisang goroho krispi khas Manado dinikmati dengan cocolan sambal roa pedas gurih.',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'store-12',
    name: 'Bengkel Furniture Kayu Solid Minahasa',
    ownerName: 'Bpk. Royke Wowor',
    category: 'kerajinan',
    phone: '6282244556677',
    address: 'Lingkungan IV, Kompleks Sentra Kayu Woloan 1 Utara',
    mapsUrl: 'https://maps.google.com/?q=1.326900,124.796500',
    description: 'Spesialis pembuatan meja makan kayu utuh (slab table), kursi santai teras rumah panggung, dan lemari antik kayu jati & cempaka.',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
    badge: 'Kayu Utuh Solid',
    isVerified: true,
    createdAt: '2026-04-04',
    products: [
      {
        id: 'p-1201',
        name: 'Meja Makan Kayu Slab Alami (2 x 1 m) + 6 Kursi',
        price: 'Rp 4.500.000',
        priceNum: 4500000,
        unit: 'per set ruang makan',
        description: 'Meja kayu utuh dengan serat alami menawan pelengkap kehangatan ruang makan rumah panggung.',
        imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

export const VILLAGE_OFFICIALS: VillageOfficial[] = [
  {
    name: 'Jhonny R. Posumah, S.Sos',
    position: 'Lurah Woloan Satu Utara',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    nip: '19760812 200501 1 008',
    phone: '0812-4411-XXXX'
  },
  {
    name: 'Marietje Walangitan, SE',
    position: 'Sekretaris Kelurahan',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    nip: '19820315 200804 2 003',
    phone: '0813-5522-XXXX'
  },
  {
    name: 'Stevanus Runtuwene, S.STP',
    position: 'Kasi Pemerintahan, Ketentraman & Ketertiban',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    nip: '19890520 201202 1 004',
    phone: '0821-6633-XXXX'
  },
  {
    name: 'Fience Kaunang, S.Pd',
    position: 'Kasi Perekonomian & Kesejahteraan Sosial',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    nip: '19851108 201001 2 015',
    phone: '0852-7744-XXXX'
  }
];

export const LINGKUNGAN_HEADS = [
  { name: 'Frangky Pongoh', role: 'Kepala Lingkungan I (Pala)', phone: '0812-4401-0101' },
  { name: 'Benny Wowor', role: 'Kepala Lingkungan II (Pala)', phone: '0813-4402-0202' },
  { name: 'Novi Supit', role: 'Kepala Lingkungan III (Pala)', phone: '0821-4403-0303' },
  { name: 'Albert Tangkuman', role: 'Kepala Lingkungan IV (Pala)', phone: '0852-4404-0404' }
];

export const VILLAGE_STATS: VillageStat[] = [
  {
    label: 'Pengrajin Rumah Kayu',
    value: '35+',
    description: 'Bengkel aktif memproduksi rumah panggung knockdown berskala nasional & ekspor',
    icon: 'Hammer'
  },
  {
    label: 'Pelaku UMKM Lokal',
    value: '48+',
    description: 'Unit usaha kuliner, kerajinan ukiran, hasil bumi, dan agribisnis',
    icon: 'Store'
  },
  {
    label: 'Negara Tujuan Ekspor',
    value: '18+',
    description: 'Rumah Woloan berdiri di Maladewa, Karibia, Malaysia, Australia, hingga Eropa',
    icon: 'Globe'
  },
  {
    label: 'Masyarakat Terdaftar',
    value: '1.920+',
    description: 'Jiwa penduduk yang hidup rukun dengan nilai kearifan lokal Mapalus',
    icon: 'Users'
  }
];

export const WOOD_SPECIALITIES = [
  {
    name: 'Kayu Aliwowos',
    scientific: 'Homalium foetidum',
    strength: 'Kelas Kuat I - II',
    durability: 'Sangat Tinggi (Anti-Rayap Alami)',
    usage: 'Tiang utama panggung, balok penopang struktur bawah, dan lantai.',
    highlight: 'Karakter serat yang sangat rapat dan berbobot berat, terkenal tahan puluhan bahkan ratusan tahun.'
  },
  {
    name: 'Kayu Cempaka Wasian',
    scientific: 'Elmerrillia ovalis',
    strength: 'Kelas Kuat II',
    durability: 'Tinggi & Wangi Alami',
    usage: 'Dinding papan, daun pintu & jendela, ukiran lisplang, dan plafon.',
    highlight: 'Kayu kebanggaan masyarakat Minahasa dengan kilau keemasan alami dan serat halus yang sangat estetik.'
  },
  {
    name: 'Kayu Besi Minahasa',
    scientific: 'Eusideroxylon zwageri / Intsia bijuga',
    strength: 'Kelas Kuat I (Maksimal)',
    durability: 'Abadi (Tahan Cuaca Ekstrem & Air)',
    usage: 'Tiang pancang tanah, fondasi umpak panggung, dan rangka utama.',
    highlight: 'Kayu yang semakin terkena air dan cuaca luar justru semakin membatu dan keras.'
  }
];
