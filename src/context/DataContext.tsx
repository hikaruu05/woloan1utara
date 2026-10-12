import React, { createContext, useContext, useState, useEffect } from 'react';
import { RumahPanggung, UMKMStore, UMKMProductItem } from '../types';
import { INITIAL_RUMAH_PANGGUNG, INITIAL_UMKM_STORES } from '../data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

interface DataContextType {
  houses: RumahPanggung[];
  umkmStores: UMKMStore[];
  addHouse: (house: Omit<RumahPanggung, 'id' | 'createdAt' | 'isVerified'>) => void;
  addStore: (store: Omit<UMKMStore, 'id' | 'createdAt' | 'isVerified'>) => void;
  addProductToStore: (storeId: string, product: Omit<UMKMProductItem, 'id'>) => void;
  resetToDefault: () => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY_HOUSES = 'kkt_woloan_houses_v3';
const STORAGE_KEY_STORES = 'kkt_woloan_stores_v3';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [houses, setHouses] = useState<RumahPanggung[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HOUSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved houses:', e);
    }
    return INITIAL_RUMAH_PANGGUNG;
  });

  const [umkmStores, setUmkmStores] = useState<UMKMStore[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STORES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved stores:', e);
    }
    return INITIAL_UMKM_STORES;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HOUSES, JSON.stringify(houses));
    } catch (e) {
      console.error('Error saving houses to localStorage:', e);
    }
  }, [houses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STORES, JSON.stringify(umkmStores));
    } catch (e) {
      console.error('Error saving stores to localStorage:', e);
    }
  }, [umkmStores]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addHouse = (houseData: Omit<RumahPanggung, 'id' | 'createdAt' | 'isVerified'>) => {
    const newHouse: RumahPanggung = {
      ...houseData,
      id: 'rp-user-' + Date.now(),
      isVerified: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setHouses((prev) => [newHouse, ...prev]);
    showToast(
      'Katalog Rumah Panggung Ditambahkan!',
      `Rumah panggung "${newHouse.title}" kini telah terdaftar dan tampil di etalase Woloan 1 Utara.`
    );
  };

  const addStore = (storeData: Omit<UMKMStore, 'id' | 'createdAt' | 'isVerified'>) => {
    const newStore: UMKMStore = {
      ...storeData,
      id: 'store-user-' + Date.now(),
      isVerified: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUmkmStores((prev) => [newStore, ...prev]);
    showToast(
      'Toko UMKM Berhasil Didaftarkan!',
      `Usaha "${newStore.name}" oleh ${newStore.ownerName} beserta katalog produknya telah aktif di portal.`
    );
  };

  const addProductToStore = (storeId: string, productData: Omit<UMKMProductItem, 'id'>) => {
    const newProduct: UMKMProductItem = {
      ...productData,
      id: 'prod-user-' + Date.now()
    };
    setUmkmStores((prev) =>
      prev.map((store) =>
        store.id === storeId
          ? { ...store, products: [...store.products, newProduct] }
          : store
      )
    );
    showToast('Produk Ditambahkan', `Produk "${newProduct.name}" berhasil ditambahkan ke toko.`);
  };

  const resetToDefault = () => {
    setHouses(INITIAL_RUMAH_PANGGUNG);
    setUmkmStores(INITIAL_UMKM_STORES);
    localStorage.removeItem(STORAGE_KEY_HOUSES);
    localStorage.removeItem(STORAGE_KEY_STORES);
    showToast('Data Dipulihkan', 'Katalog telah dikembalikan ke data awal terverifikasi kelurahan.', 'info');
  };

  return (
    <DataContext.Provider
      value={{
        houses,
        umkmStores,
        addHouse,
        addStore,
        addProductToStore,
        resetToDefault,
        toasts,
        removeToast,
        showToast
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
