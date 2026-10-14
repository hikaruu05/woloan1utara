export type HouseType = 'tradisional' | 'dua_lantai' | 'minimalis' | 'villa' | 'gazebo';

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
  mapsUrl?: string; // Titik lokasi Google Maps
  description: string;
  features: string[];
  imageUrl: string;
  galleryUrls?: string[];
  isVerified: boolean;
  isCustomAllowed: boolean;
  createdAt: string;
}

export type UMKMCategory = 'kerajinan' | 'kuliner' | 'pertanian' | 'jasa' | 'lainnya';

export interface UMKMProductItem {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  unit?: string; // e.g. 'per pcs', 'per kemasan', 'per porsi'
  description?: string;
  imageUrl: string;
}

export interface UMKMStore {
  id: string;
  name: string; // Nama Toko / Usaha
  ownerName: string; // Nama Pemilik
  category: UMKMCategory;
  phone: string; // WhatsApp
  address: string; // Alamat di Woloan 1 Utara
  mapsUrl?: string; // Titik Google Maps
  description: string;
  imageUrl: string; // Foto Toko / Banner
  badge?: string;
  isVerified: boolean;
  createdAt: string;
  products: UMKMProductItem[]; // Koleksi produk per toko
}

export type DestinationCategory =
  | "alam"
  | "budaya"
  | "sejarah"
  | "kuliner"
  | "edukasi"
  | "religi"
  | "agrowisata"
  | "kerajinan" // Nilai lama agar data destinasi yang sudah tersimpan tetap terbaca.
  | "lainnya";

export interface TravelDestination {
  id: string;
  name: string;
  category: DestinationCategory;
  area: string;
  summary: string;
  description: string;
  address: string;
  mapsUrl?: string;
  openingHours?: string;
  entryFee?: string;
  facilities: string[];
  accessibility?: string;
  activities: string[];
  contactPhone?: string;
  bookingUrl?: string;
  visitorRules?: string;
  imageUrl: string;
  galleryUrls?: string[];
  isVerified: boolean;
  createdAt: string;
}

export type ListingKind = "houses" | "stores" | "destinations";
export type ListingStatus = "draft" | "published" | "archived";

export interface AdminListing {
  id: string;
  kind: ListingKind;
  status: ListingStatus;
  payload: RumahPanggung | UMKMStore | TravelDestination;
  createdAt: string;
  updatedAt: string;
}

// Backward compatibility alias if needed
export type ProductUMKM = UMKMProductItem & {
  storeId?: string;
  storeName?: string;
  phone?: string;
  address?: string;
  mapsUrl?: string;
};

export interface VillageOfficial {
  name: string;
  position: string;
  photoUrl: string;
  nip?: string;
  lingkungan?: string;
  phone?: string;
}
