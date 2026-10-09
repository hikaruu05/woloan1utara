import React, { createContext, useContext, useState, useEffect } from 'react';
import { RumahPanggung, ProductUMKM } from '../types';
import { INITIAL_RUMAH_PANGGUNG, INITIAL_UMKM_PRODUCTS } from '../data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

interface DataContextType {
  houses: RumahPanggung[];
  umkmProducts: ProductUMKM[];
  addHouse: (house: Omit<RumahPanggung, 'id' | 'createdAt' | 'isVerified'>) => void;
  addUMKM: (product: Omit<ProductUMKM, 'id' | 'createdAt' | 'isVerified'>) => void;
  resetToDefault: () => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY_HOUSES = 'kkt_woloan_houses_v2';
const STORAGE_KEY_UMKM = 'kkt_woloan_umkm_v2';

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

  const [umkmProducts, setUmkmProducts] = useState<ProductUMKM[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UMKM);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved umkm:', e);
    }
    return INITIAL_UMKM_PRODUCTS;
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
      localStorage.setItem(STORAGE_KEY_UMKM, JSON.stringify(umkmProducts));
    } catch (e) {
      console.error('Error saving umkm to localStorage:', e);
    }
  }, [umkmProducts]);

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
      'Katalog Berhasil Ditambahkan!',
      `Rumah panggung "${newHouse.title}" kini telah terdaftar dan tampil di etalase Woloan 1 Utara.`
    );
  };

  const addUMKM = (umkmData: Omit<ProductUMKM, 'id' | 'createdAt' | 'isVerified'>) => {
    const newProduct: ProductUMKM = {
      ...umkmData,
      id: 'umkm-user-' + Date.now(),
      isVerified: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUmkmProducts((prev) => [newProduct, ...prev]);
    showToast(
      'Produk UMKM Terdaftar!',
      `Produk "${newProduct.name}" dari "${newProduct.businessName}" kini dapat diakses oleh calon pembeli.`
    );
  };

  const resetToDefault = () => {
    setHouses(INITIAL_RUMAH_PANGGUNG);
    setUmkmProducts(INITIAL_UMKM_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_HOUSES);
    localStorage.removeItem(STORAGE_KEY_UMKM);
    showToast('Data Dipulihkan', 'Katalog telah dikembalikan ke data awal terverifikasi kelurahan.', 'info');
  };

  return (
    <DataContext.Provider
      value={{
        houses,
        umkmProducts,
        addHouse,
        addUMKM,
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
