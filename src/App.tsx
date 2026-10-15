import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
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
import { DetailModal } from './components/DetailModal';
import { ToastContainer } from './components/ToastContainer';
import { DestinationsSection } from './components/DestinationsSection';
import { DestinationsPage } from './components/DestinationsPage';
import { AdminPage } from './components/AdminPage';
import { PartnerPage } from './components/PartnerPage';
import { CatalogShortcuts } from './components/CatalogShortcuts';
import { RumahPanggung, UMKMStore, UMKMProductItem } from './types';

export const AppContent: React.FC = () => {
  // Halaman portal: beranda, katalog, destinasi, atau admin.
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (['katalog-rumah', 'katalog-umkm', 'katalog-destinasi', 'admin', 'mitra'].includes(hash)) {
      return hash;
    }
    return 'beranda';
  });

  // Detail modal state
  const [detailItem, setDetailItem] = useState<RumahPanggung | UMKMStore | UMKMProductItem | null>(null);
  const [detailType, setDetailType] = useState<'house' | 'store' | 'product' | null>(null);
  const [associatedStore, setAssociatedStore] = useState<UMKMStore | null>(null);

  // Sync hash with browser URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['katalog-rumah', 'katalog-umkm', 'katalog-destinasi', 'admin', 'mitra'].includes(hash)) {
        setCurrentPage(hash);
      } else if (hash === 'beranda' || hash === '') {
        setCurrentPage('beranda');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (pageOrSectionId: string) => {
    if (['katalog-rumah', 'katalog-umkm', 'katalog-destinasi', 'admin', 'mitra'].includes(pageOrSectionId)) {
      setCurrentPage(pageOrSectionId);
      window.location.hash = `/${pageOrSectionId}`;
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
              />
            </div>

            <CatalogShortcuts onNavigate={handleNavigate} />

            <DestinationsSection onNavigate={() => handleNavigate('katalog-destinasi')} />

            {/* Showcase Cuplikan Rumah Panggung */}
            <RumahPanggungSection
              onSelectHouse={handleSelectHouse}
              onNavigateToFullPage={() => handleNavigate('katalog-rumah')}
            />

            {/* Showcase Cuplikan Toko UMKM Warga */}
            <UMKMSection
              onSelectStore={handleSelectStore}
              onNavigateToFullPage={() => handleNavigate('katalog-umkm')}
            />

            {/* Rencanakan kunjungan: peta dan kontak ditempatkan sesudah katalog. */}
            <VillageMapAndContact />

            <ProfileKelurahan />

            <SpecialitySection
              onNavigateToCatalog={() => handleNavigate('katalog-rumah')}
            />

            <CostCalculator />
          </>
        )}

        {/* ================= 2. HALAMAN KHUSUS KATALOG RUMAH PANGGUNG ================= */}
        {currentPage === 'katalog-rumah' && (
          <RumahPanggungPage
            onSelectHouse={handleSelectHouse}
            onBackToHome={() => handleNavigate('beranda')}
          />
        )}

        {/* ================= 3. HALAMAN KHUSUS DIREKTORI TOKO & UMKM ================= */}
        {currentPage === 'katalog-umkm' && (
          <UMKMPage
            onSelectStore={handleSelectStore}
            onSelectProduct={handleSelectProduct}
            onBackToHome={() => handleNavigate('beranda')}
          />
        )}

        {currentPage === 'katalog-destinasi' && (
          <DestinationsPage onBackToHome={() => handleNavigate('beranda')} />
        )}

        {currentPage === 'admin' && <AdminPage />}
        {currentPage === 'mitra' && <PartnerPage />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
      />

      {/* Detail Specification Modal */}
      <DetailModal
        item={detailItem}
        type={detailType}
        associatedStore={associatedStore}
        onClose={handleCloseDetail}
      />

      {/* Toast Feedback Notifications */}
      <ToastContainer />

      {/* Vercel Web Analytics */}
      <Analytics />
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
