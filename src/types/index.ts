export type HouseType = 'tradisional' | 'villa' | 'minimalis' | 'gazebo' | 'dua_lantai';

export interface RumahPanggung {
  id: string;
  title: string;
  type: HouseType;
  dimensions: string; // e.g., '8 x 10 Meter'
  woodTypes: string[]; // e.g., ['Kayu Aliwowos', 'Kayu Cempaka Wasian']
  bedrooms: number;
  bathrooms: number;
  floors: number;
  priceEstimated: string; // e.g., 'Rp 160.000.000 - Rp 195.000.000'
  minBudget: number; // numeric for filtering
  craftsmanName: string; // Bengkel / Pembuat
  craftsmanPhone: string; // WhatsApp number
  craftsmanAddress: string; // Lingkungan di Woloan 1 Utara
  description: string;
  features: string[];
  imageUrl: string;
  galleryUrls?: string[];
  isVerified: boolean;
  isCustomAllowed: boolean;
  createdAt: string;
}

export type UMKMCategory = 'kerajinan' | 'kuliner' | 'pertanian' | 'jasa' | 'lainnya';

export interface ProductUMKM {
  id: string;
  name: string;
  category: UMKMCategory;
  businessName: string;
  ownerName: string;
  price: string;
  priceNum: number;
  unit?: string; // e.g., 'per buah', 'per paket', 'per porsi'
  phone: string;
  address: string;
  description: string;
  imageUrl: string;
  isVerified: boolean;
  badge?: string;
  createdAt: string;
}

export interface VillageOfficial {
  name: string;
  position: string;
  photoUrl: string;
  nip?: string;
  lingkungan?: string;
  phone?: string;
}

export interface VillageStat {
  label: string;
  value: string;
  description: string;
  icon: string;
}
