import React, { useState } from "react";
import { DataProvider } from "./context/DataContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProfileKelurahan } from "./components/ProfileKelurahan";
import { SpecialitySection } from "./components/SpecialitySection";
import { RumahPanggungSection } from "./components/RumahPanggungSection";
import { UMKMSection } from "./components/UMKMSection";
import { CostCalculator } from "./components/CostCalculator";
import { VillageMapAndContact } from "./components/VillageMapAndContact";
import { Footer } from "./components/Footer";
import { UploadModal } from "./components/UploadModal";
import { DetailModal } from "./components/DetailModal";
import { ToastContainer } from "./components/ToastContainer";
import { RumahPanggung, ProductUMKM } from "./types";
import { PlusCircle } from "lucide-react";

export const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState("beranda");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Detail modal state
  const [detailItem, setDetailItem] = useState<
    RumahPanggung | ProductUMKM | null
  >(null);
  const [detailType, setDetailType] = useState<"house" | "umkm" | null>(null);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === "beranda") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectHouse = (house: RumahPanggung) => {
    setDetailItem(house);
    setDetailType("house");
  };

  const handleSelectUMKM = (product: ProductUMKM) => {
    setDetailItem(product);
    setDetailType("umkm");
  };

  const handleCloseDetail = () => {
    setDetailItem(null);
    setDetailType(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 text-warm-900 selection:bg-wood-200 selection:text-wood-950">
      {/* Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
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
          onNavigateToCatalog={() => handleNavigate("rumah-panggung")}
        />

        {/* Katalog Rumah Panggung Kayu Knockdown */}
        <RumahPanggungSection
          onSelectHouse={handleSelectHouse}
          onOpenUpload={() => setIsUploadOpen(true)}
        />

        {/* Etalase Produk UMKM Warga */}
        <UMKMSection
          onSelectProduct={handleSelectUMKM}
          onOpenUpload={() => setIsUploadOpen(true)}
        />

        {/* Kalkulator Simulasi Biaya Rumah Panggung */}
        <CostCalculator />

        {/* Peta Wilayah & Kontak */}
        <VillageMapAndContact />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Upload Modal (Rumah Panggung & UMKM) */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      {/* Detail Specification Modal */}
      <DetailModal
        item={detailItem}
        type={detailType}
        onClose={handleCloseDetail}
      />

      {/* Toast Feedback Notifications */}
      <ToastContainer />
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
