import { RumahPanggung, ProductUMKM, VillageOfficial, VillageStat } from '../types';

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
  }
];

export const INITIAL_UMKM_PRODUCTS: ProductUMKM[] = [
  {
    id: 'umkm-1',
    name: 'Miniatur Rumah Panggung Woloan Kayu Cempaka Wasian',
    category: 'kerajinan',
    businessName: 'Woloan Souvenir & Miniatures',
    ownerName: 'Bpk. Meidy Tangkuman',
    price: 'Rp 250.000 - Rp 850.000',
    priceNum: 250000,
    unit: 'per unit souvenir',
    phone: '6281299887766',
    address: 'Lingkungan II, Depan Gereja GMIM Woloan 1 Utara',
    description: 'Souvenir ikonik skala presisi 1:50 dari rumah panggung asli Minahasa. Dibuat tangan secara detail oleh perajin kayu lokal menggunakan sisa kayu cempaka wasian berkualitas. Dilengkapi kotak kemasan mika eksklusif.',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    badge: 'Produk Ikonik Khas',
    createdAt: '2026-02-20'
  },
  {
    id: 'umkm-2',
    name: 'Klappertaart Asli Tomohon Premium (Kelapa Muda & Kenari)',
    category: 'kuliner',
    businessName: 'Dapur Oma Tilly Woloan',
    ownerName: 'Ibu Mathilda Supit',
    price: 'Rp 45.000 - Rp 165.000',
    priceNum: 45000,
    unit: 'per cup / loyang',
    phone: '6285397123456',
    address: 'Lingkungan I, Woloan 1 Utara',
    description: 'Klappertaart resep turun-temurun dengan tekstur lembut melted, perpaduan kelapa muda segar Tomohon, susu krim gurih, taburan kismis, kacang kenari, dan bubuk kayu manis wangi. Tersedia varian original dan rendah gula.',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    badge: 'Kuliner Legendaris',
    createdAt: '2026-02-25'
  },
  {
    id: 'umkm-3',
    name: 'Set Talenan & Peralatan Dapur Kayu Cempaka Food-Grade',
    category: 'kerajinan',
    businessName: 'Woodware Woloan Lestari',
    ownerName: 'Bpk. Hendra Rorong',
    price: 'Rp 75.000 - Rp 220.000',
    priceNum: 75000,
    unit: 'per set (3 pcs)',
    phone: '6287812345678',
    address: 'Lingkungan III, Woloan 1 Utara',
    description: 'Peralatan dapur alami terbuat dari serat kayu pilihan tanpa bahan kimia berbahaya, di-finishing dengan beeswax alami food-grade. Kuat, tahan jamur, tidak tumpul pada pisau dapur, dan memiliki serat artistik.',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    badge: 'Ekspor Kerajinan',
    createdAt: '2026-03-02'
  },
  {
    id: 'umkm-4',
    name: 'Kacang Goyang & Halua Kenari Khas Minahasa',
    category: 'kuliner',
    businessName: 'UD. Rizky Berkah Woloan',
    ownerName: 'Ibu Fatimah Mokodongan',
    price: 'Rp 25.000 - Rp 60.000',
    priceNum: 25000,
    unit: 'per toples / pack',
    phone: '6282290123499',
    address: 'Lingkungan IV, Woloan 1 Utara',
    description: 'Camilan manis renyah khas Minahasa. Kacang goyang beraneka warna dengan balutan gula legit dan halua kenari asli dengan gula aren Minahasa murni. Cocok untuk oleh-oleh wisatawan dan camilan santai keluarga.',
    imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    badge: 'Oleh-Oleh Favorit',
    createdAt: '2026-03-05'
  },
  {
    id: 'umkm-5',
    name: 'Kopi Arabika & Robusta Lereng Gunung Lokon Woloan',
    category: 'pertanian',
    businessName: 'Kopi Tani Lokon Woloan',
    ownerName: 'Bpk. Joutje Polii',
    price: 'Rp 50.000 - Rp 110.000',
    priceNum: 50000,
    unit: 'kemasan 250gr',
    phone: '6281356789012',
    address: 'Jalur Perkebunan Kaki Lokon, Lingkungan I, Woloan 1 Utara',
    description: 'Biji kopi yang ditanam di tanah vulkanik subur lereng Gunung Lokon pada ketinggian 900-1100 mdpl. Menghasilkan cita rasa kopi dengan acidity seimbang, aroma cokelat rempah, dan body yang tebal khas pegunungan Tomohon.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    badge: 'Petik Merah Pilihan',
    createdAt: '2026-03-12'
  },
  {
    id: 'umkm-6',
    name: 'Bunga Krisan Potong & Tanaman Hias Unggulan Tomohon',
    category: 'pertanian',
    businessName: 'Flora Asri Woloan Satu Utara',
    ownerName: 'Kelompok Wanita Tani (KWT) Woloan',
    price: 'Rp 35.000 - Rp 150.000',
    priceNum: 35000,
    unit: 'per ikat / pot',
    phone: '6285298112244',
    address: 'Greenhouse Bunga Lingkungan II, Woloan 1 Utara',
    description: 'Tomohon dikenal sebagai Kota Bunga, dan Woloan 1 Utara turut membudidayakan krisan segar, anggrek, dan tanaman hias bernilai ekonomi tinggi untuk dekorasi pesta, event Kota Bunga TIFF, hingga hiasan pekarangan rumah.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    badge: 'Segar dari Kebun',
    createdAt: '2026-03-19'
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
