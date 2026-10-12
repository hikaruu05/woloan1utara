import React, { useState, useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProfileKelurahan } from './components/ProfileKelurahan';
import { SpecialitySection } from './components/SpecialitySection';
import { RumahPanggungSection } from './components/RumahPanggungSection';
import { UMKMSection } from './components/UMKMSection';
import { CostCalculator } from './components/CostCalculator';
import { VillageMapAndContact } from './components/VillageMapAndContact';
import { RumahPanggungPage } from './components/RumahPanggungPage';
import { UMKMPage } from './components/UMKMPage';
import { Footer } from './components/Footer';
import { UploadModal } from './components/UploadModal';
import { DetailModal } from './components/DetailModal';
import { ToastContainer } from './components/ToastContainer';
import { RumahPanggung, UMKMStore, UMKMProductItem } from './types';
import { PlusCircle } from 'lucide-react';

export const AppContent: React.FC = () => {
  // Current page: 'beranda' | 'katalog-rumah' | 'katalog-umkm'
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash === 'katalog-rumah' || hash === 'katalog-umkm') {
      return hash;
    }
    return 'beranda';
  });

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Detail modal state
  const [detailItem, setDetailItem] = useState<RumahPanggung | UMKMStore | UMKMProductItem | null>(null);
  const [detailType, setDetailType] = useState<'house' | 'store' | 'product' | null>(null);
  const [associatedStore, setAssociatedStore] = useState<UMKMStore | null>(null);

  // Sync hash with browser URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'katalog-rumah' || hash === 'katalog-umkm') {
        setCurrentPage(hash);
      } else if (hash === 'beranda' || hash === '') {
        setCurrentPage('beranda');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (pageOrSectionId: string) => {
    if (pageOrSectionId === 'katalog-rumah') {
      setCurrentPage('katalog-rumah');
      window.location.hash = '/katalog-rumah';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (pageOrSectionId === 'katalog-umkm') {
      setCurrentPage('katalog-umkm');
      window.location.hash = '/katalog-umkm';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Otherwise, section in 'beranda'
    if (currentPage !== 'beranda') {
      setCurrentPage('beranda');
      window.location.hash = '';
      setTimeout(() => {
        if (pageOrSectionId === 'beranda') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const elem = document.getElementById(pageOrSectionId);
          elem?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    // Already on beranda
    if (pageOrSectionId === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const elem = document.getElementById(pageOrSectionId);
      elem?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectHouse = (house: RumahPanggung) => {
    setDetailItem(house);
    setDetailType('house');
    setAssociatedStore(null);
  };

  const handleSelectStore = (store: UMKMStore) => {
    setDetailItem(store);
    setDetailType('store');
    setAssociatedStore(store);
  };

  const handleSelectProduct = (product: UMKMProductItem, store: UMKMStore) => {
    setDetailItem(product);
    setDetailType('product');
    setAssociatedStore(store);
  };

  const handleCloseDetail = () => {
    setDetailItem(null);
    setDetailType(null);
    setAssociatedStore(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 text-warm-900 selection:bg-wood-200 selection:text-wood-950">
      {/* Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {/* ================= 1. HALAMAN BERANDA ================= */}
        {currentPage === 'beranda' && (
          <>
            {/* Hero Section */}
            <div id="beranda">
              <Hero
                onNavigate={handleNavigate}
                onOpenUpload={() => setIsUploadOpen(true)}
              />
            </div>

            {/* Profil Kelurahan */}
            <ProfileKelurahan />

            {/* Speciality & Wood Craftsmanship of Woloan 1 Utara */}
            <SpecialitySection
              onNavigateToCatalog={() => handleNavigate('katalog-rumah')}
            />

            {/* Showcase Cuplikan Rumah Panggung */}
            <RumahPanggungSection
              onSelectHouse={handleSelectHouse}
              onOpenUpload={() => setIsUploadOpen(true)}
              onNavigateToFullPage={() => handleNavigate('katalog-rumah')}
            />

            {/* Showcase Cuplikan Toko UMKM Warga */}
            <UMKMSection
              onSelectStore={handleSelectStore}
              onOpenUpload={() => setIsUploadOpen(true)}
              onNavigateToFullPage={() => handleNavigate('katalog-umkm')}
            />

            {/* Kalkulator Simulasi Biaya Rumah Panggung */}
            <CostCalculator />

            {/* Peta Wilayah & Kontak */}
            <VillageMapAndContact />
          </>
        )}

        {/* ================= 2. HALAMAN KHUSUS KATALOG RUMAH PANGGUNG ================= */}
        {currentPage === 'katalog-rumah' && (
          <RumahPanggungPage
            onSelectHouse={handleSelectHouse}
            onOpenUpload={() => setIsUploadOpen(true)}
            onBackToHome={() => handleNavigate('beranda')}
          />
        )}

        {/* ================= 3. HALAMAN KHUSUS DIREKTORI TOKO & UMKM ================= */}
        {currentPage === 'katalog-umkm' && (
          <UMKMPage
            onSelectStore={handleSelectStore}
            onSelectProduct={handleSelectProduct}
            onOpenUpload={() => setIsUploadOpen(true)}
            onBackToHome={() => handleNavigate('beranda')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Upload Modal (Toko UMKM & Rumah Panggung) */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      {/* Detail Specification Modal */}
      <DetailModal
        item={detailItem}
        type={detailType}
        associatedStore={associatedStore}
        onClose={handleCloseDetail}
        onSelectProductFromStore={handleSelectProduct}
      />

      {/* Toast Feedback Notifications */}
      <ToastContainer />

      {/* Floating Action Button (Quick Upload) */}
      <div className="fixed bottom-6 left-6 z-30">
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-wood-800 text-white shadow-warm-lg hover:bg-wood-900 hover:scale-105 active:scale-95 transition-all text-xs font-bold border border-amber-500/40 group"
          title="Pasang Toko UMKM atau Rumah Panggung Baru"
        >
          <PlusCircle className="w-4 h-4 text-amber-300 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">Upload Usaha / Rumah</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
