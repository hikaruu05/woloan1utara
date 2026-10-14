import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AdminListing,
  ListingKind,
  ListingStatus,
  RumahPanggung,
  TravelDestination,
  UMKMProductItem,
  UMKMStore,
} from "../types";
import { PartnerAccountLink, StoreSubmission } from "../services/supabase";
import {
  deleteListing as deleteRemoteListing,
  fetchListings,
  isAdministrator,
  getPartnerAccount,
  fetchPartnerListing,
  fetchPartnerAccounts,
  fetchStoreSubmissions,
  submitStoreChanges,
  createPartnerListingSubmission,
  reviewStoreSubmission,
  uploadPartnerListingImage,
  createPartnerAccount as createRemotePartnerAccount,
  unlinkPartnerAccount as unlinkRemotePartnerAccount,
  changePartnerPassword as changeRemotePartnerPassword,
  isSupabaseConfigured,
  readSavedSession,
  refreshSession,
  saveSession,
  signIn,
  signInPartner,
  signOut,
  SupabaseSession,
  upsertListing,
  uploadListingImage,
} from "../services/supabase";

interface ToastMessage {
  id: string;
  type: "success" | "info" | "error";
  title: string;
  message: string;
}

interface DataContextType {
  houses: RumahPanggung[];
  umkmStores: UMKMStore[];
  destinations: TravelDestination[];
  adminListings: AdminListing[];
  staffManaged: boolean;
  catalogLoading: boolean;
  adminLoading: boolean;
  adminEmail: string | null;
  isAdmin: boolean;
  isPartner: boolean;
  partnerMustChangePassword: boolean;
  partnerListing: AdminListing | null;
  partnerListingKind: ListingKind | null;
  partnerSubmissions: StoreSubmission[];
  partnerAccounts: PartnerAccountLink[];
  loginAdmin: (email: string, password: string) => Promise<void>;
  loginPartner: (username: string, password: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  submitPartnerListing: (payload: Record<string, unknown>) => Promise<void>;
  refreshPartnerData: () => Promise<void>;
  reviewSubmission: (id: string, decision: "approve" | "reject", note?: string) => Promise<void>;
  createPartnerAccount: (username: string, kind: ListingKind, temporaryPassword: string) => Promise<"created" | "reset">;
  unlinkPartnerAccount: (kind: ListingKind, listingId: string) => Promise<void>;
  changePartnerPassword: (newPassword: string) => Promise<void>;
  uploadPartnerImage: (file: File) => Promise<string>;
  saveListing: (
    kind: ListingKind,
    id: string | undefined,
    payload: Record<string, unknown>,
    status: ListingStatus,
  ) => Promise<string>;
  deleteListing: (kind: ListingKind, id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  addHouse: (
    house: Omit<RumahPanggung, "id" | "createdAt" | "isVerified">,
  ) => void;
  addStore: (store: Omit<UMKMStore, "id" | "createdAt" | "isVerified">) => void;
  addProductToStore: (
    storeId: string,
    product: Omit<UMKMProductItem, "id">,
  ) => void;
  resetToDefault: () => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  showToast: (
    title: string,
    message: string,
    type?: "success" | "info" | "error",
  ) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const dateToday = () => new Date().toISOString().slice(0, 10);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [houses, setHouses] = useState<RumahPanggung[]>([]);
  const [umkmStores, setUmkmStores] = useState<UMKMStore[]>([]);
  const [destinations, setDestinations] = useState<TravelDestination[]>([]);
  const [adminListings, setAdminListings] = useState<AdminListing[]>([]);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [partnerMustChangePassword, setPartnerMustChangePassword] = useState(false);
  const [partnerListingId, setPartnerListingId] = useState<string | null>(null);
  const [partnerListingKind, setPartnerListingKind] = useState<ListingKind | null>(null);
  const [partnerListing, setPartnerListing] = useState<AdminListing | null>(null);
  const [partnerSubmissions, setPartnerSubmissions] = useState<StoreSubmission[]>([]);
  const [partnerAccounts, setPartnerAccounts] = useState<PartnerAccountLink[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    title: string,
    message: string,
    type: "success" | "info" | "error" = "success",
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((previous) => [...previous, { id, title, message, type }]);
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  };

  const refreshPublicCatalog = async () => {
    if (!isSupabaseConfigured) {
      setHouses([]);
      setUmkmStores([]);
      setDestinations([]);
      setCatalogLoading(false);
      return;
    }

    try {
      const [houseRows, storeRows, destinationRows] = await Promise.all([
        fetchListings("houses"),
        fetchListings("stores"),
        fetchListings("destinations"),
      ]);
      setHouses(houseRows.map((row) => row.payload as RumahPanggung));
      setUmkmStores(storeRows.map((row) => row.payload as UMKMStore));
      setDestinations(
        destinationRows.map((row) => row.payload as TravelDestination),
      );
    } catch (error) {
      console.error("Gagal memuat katalog publik:", error);
      showToast(
        "Katalog belum dapat dimuat",
        error instanceof Error ? error.message : "Periksa konfigurasi layanan katalog.",
        "error",
      );
    } finally {
      setCatalogLoading(false);
    }
  };

  const refreshAdminCatalog = async (activeSession: SupabaseSession) => {
    setAdminLoading(true);
    try {
      const [houseRows, storeRows, destinationRows] = await Promise.all([
        fetchListings("houses", activeSession.access_token),
        fetchListings("stores", activeSession.access_token),
        fetchListings("destinations", activeSession.access_token),
      ]);
      setAdminListings([...houseRows, ...storeRows, ...destinationRows]);
      const [submissions, accounts] = await Promise.all([fetchStoreSubmissions(activeSession), fetchPartnerAccounts(activeSession)]);
      setPartnerSubmissions(submissions);
      setPartnerAccounts(accounts);
    } finally {
      setAdminLoading(false);
    }
  };

  const currentSession = async () => {
    if (!session) throw new Error("Sesi admin telah berakhir. Silakan masuk kembali.");
    if (session.expires_at > Date.now() + 60_000) return session;

    const renewed = await refreshSession(session);
    setSession(renewed);
    saveSession(renewed);
    return renewed;
  };

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      await refreshPublicCatalog();
      const saved = readSavedSession();
      if (!saved || !isSupabaseConfigured) return;

      try {
        const renewed = saved.expires_at > Date.now() + 60_000
          ? saved
          : await refreshSession(saved);
        const admin = await isAdministrator(renewed);
        const partnerAccount = admin ? null : await getPartnerAccount(renewed);
        const ownedListingId = partnerAccount?.listingId || null;
        if (!admin && !partnerAccount) { await signOut(renewed.access_token); saveSession(null); return; }
        if (cancelled) return;
        setSession(renewed);
        saveSession(renewed);
        setIsAdmin(admin);
        setIsPartner(!admin);
        setPartnerMustChangePassword(partnerAccount?.mustChangePassword || false);
        setPartnerListingId(ownedListingId);
        setPartnerListingKind(partnerAccount?.listingKind || null);
        if (admin) await refreshAdminCatalog(renewed);
        else if (ownedListingId && partnerAccount) {
          const [store, submissions] = await Promise.all([fetchPartnerListing(renewed, partnerAccount.listingKind, ownedListingId), fetchStoreSubmissions(renewed, ownedListingId)]);
          setPartnerListing(store); setPartnerSubmissions(submissions);
        } else if (partnerAccount) { setPartnerListing(null); setPartnerSubmissions([]); }
      } catch {
        saveSession(null);
      }
    };
    void initialize();
    return () => {
      cancelled = true;
    };
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error("Login belum siap. Supabase URL dan anon key belum diatur.");
    }
    const nextSession = await signIn(email.trim(), password);
    const allowed = await isAdministrator(nextSession);
    if (!allowed) {
      await signOut(nextSession.access_token);
      throw new Error("Akun ini belum diberi akses administrator oleh pengelola portal.");
    }

    setSession(nextSession);
    saveSession(nextSession);
    setIsAdmin(true);
    setIsPartner(false);
    setPartnerMustChangePassword(false);
    setPartnerListingId(null); setPartnerListingKind(null); setPartnerListing(null);
    await refreshAdminCatalog(nextSession);
  };

  const loginPartner = async (username: string, password: string) => {
    if (!isSupabaseConfigured) throw new Error("Login belum siap. Koneksi layanan belum diatur.");
    const nextSession = await signInPartner(username, password);
    if (await isAdministrator(nextSession)) {
      await signOut(nextSession.access_token);
      throw new Error("Akun ini digunakan untuk portal petugas. Silakan masuk melalui halaman admin.");
    }
    const partnerAccount = await getPartnerAccount(nextSession);
    if (!partnerAccount) {
      await signOut(nextSession.access_token);
      throw new Error("Akun ini belum terhubung ke data usaha. Hubungi petugas kelurahan.");
    }
    try {
      const [store, submissions] = partnerAccount.listingId
        ? await Promise.all([fetchPartnerListing(nextSession, partnerAccount.listingKind, partnerAccount.listingId), fetchStoreSubmissions(nextSession, partnerAccount.listingId)])
        : [null, [] as StoreSubmission[]];
      setSession(nextSession); saveSession(nextSession); setIsPartner(true); setIsAdmin(false);
      setPartnerListingId(partnerAccount.listingId); setPartnerListingKind(partnerAccount.listingKind); setPartnerListing(store); setPartnerSubmissions(submissions);
      setPartnerMustChangePassword(partnerAccount.mustChangePassword);
    } catch (error) { await signOut(nextSession.access_token); throw error; }
  };

  const refreshPartnerData = async () => {
    if (!session || !partnerListingId || !partnerListingKind) return;
    const activeSession = await currentSession();
    const [store, submissions] = await Promise.all([fetchPartnerListing(activeSession, partnerListingKind, partnerListingId), fetchStoreSubmissions(activeSession, partnerListingId)]);
    setPartnerListing(store); setPartnerSubmissions(submissions);
  };

  const submitPartnerListing = async (payload: Record<string, unknown>) => {
    if (!isPartner || !partnerListingKind) throw new Error("Masuk dengan akun mitra untuk mengirim listing.");
    if (partnerMustChangePassword) throw new Error("Ganti kata sandi sementara sebelum mengirim perubahan.");
    if (partnerSubmissions.some((submission) => submission.status === "pending")) throw new Error("Pengajuan Anda sedang diperiksa. Tunggu tanggapan petugas sebelum mengirim perubahan lain.");
    const activeSession = await currentSession();
    if (partnerListingId) {
      await submitStoreChanges(activeSession, partnerListingKind, partnerListingId, { ...payload, id: partnerListingId });
      showToast("Perubahan dikirim", "Petugas kelurahan akan memeriksa data sebelum diterbitkan.", "info");
      try { await refreshPartnerData(); } catch { showToast("Pengajuan terkirim", "Data sudah dikirim untuk diperiksa. Muat ulang portal untuk menyegarkan status pengajuan.", "info"); }
    } else {
      const createdId = await createPartnerListingSubmission(activeSession, payload);
      const now = new Date().toISOString();
      const normalizedPayload = { ...payload, id: createdId, isVerified: false };
      setPartnerListingId(createdId);
      setPartnerListing({ id: createdId, kind: partnerListingKind, status: "draft", payload: normalizedPayload as AdminListing["payload"], createdAt: now, updatedAt: now });
      setPartnerSubmissions([{ id: createdId, listing_kind: partnerListingKind, listing_id: createdId, user_id: activeSession.user.id, payload: normalizedPayload, status: "pending", review_note: null, created_at: now, reviewed_at: null }]);
      showToast("Listing dikirim", "Petugas kelurahan akan memeriksa listing sebelum diterbitkan.", "info");
    }
  };

  const reviewSubmission = async (id: string, decision: "approve" | "reject", note = "") => {
    if (!isAdmin) throw new Error("Hanya petugas yang dapat meninjau perubahan.");
    const activeSession = await currentSession();
    await reviewStoreSubmission(activeSession, id, decision, note);
    await Promise.all([refreshAdminCatalog(activeSession), refreshPublicCatalog()]);
    setPartnerSubmissions(await fetchStoreSubmissions(activeSession));
    showToast(decision === "approve" ? "Perubahan diterbitkan" : "Pengajuan ditolak", decision === "approve" ? "Listing usaha telah diperbarui." : "Status pengajuan telah diperbarui.", decision === "approve" ? "success" : "info");
  };

  const createPartnerAccount = async (username: string, kind: ListingKind, temporaryPassword: string) => {
    if (!isAdmin) throw new Error("Hanya petugas yang dapat membuat akun mitra.");
    const activeSession = await currentSession();
    const action = await createRemotePartnerAccount(activeSession, username, kind, temporaryPassword);
    setPartnerAccounts(await fetchPartnerAccounts(activeSession));
    showToast(action === "reset" ? "Kredensial diatur ulang" : "Akun mitra dibuat", "Berikan username dan kata sandi sementara kepada pemilik usaha secara pribadi.");
    return action;
  };

  const unlinkPartnerAccount = async (kind: ListingKind, listingId: string) => {
    if (!isAdmin) throw new Error("Hanya petugas yang dapat mencabut akses mitra.");
    const activeSession = await currentSession();
    await unlinkRemotePartnerAccount(activeSession, kind, listingId);
    setPartnerAccounts(await fetchPartnerAccounts(activeSession));
    showToast("Tautan listing dicabut", "Akun mitra tetap aktif dan dapat membuat listing baru dengan jenis katalog yang sama.", "info");
  };

  const changePartnerPassword = async (newPassword: string) => {
    if (!isPartner || !partnerMustChangePassword) throw new Error("Akun ini tidak memerlukan penggantian kata sandi sementara.");
    await changeRemotePartnerPassword(await currentSession(), newPassword);
    setPartnerMustChangePassword(false);
    showToast("Kata sandi diperbarui", "Sekarang Anda dapat mengelola data usaha dan mengirim perubahan.");
  };

  const uploadPartnerImage = async (file: File) => {
    if (!isPartner) throw new Error("Masuk dengan akun usaha untuk mengunggah foto.");
    if (partnerMustChangePassword) throw new Error("Ganti kata sandi sementara sebelum mengunggah foto.");
    return uploadPartnerListingImage(file, await currentSession());
  };

  const logoutAdmin = async () => {
    if (session) await signOut(session.access_token).catch(() => undefined);
    saveSession(null);
    setSession(null);
    setIsAdmin(false);
    setIsPartner(false); setPartnerMustChangePassword(false); setPartnerListingId(null); setPartnerListingKind(null); setPartnerListing(null); setPartnerSubmissions([]);
    setAdminListings([]);
    await refreshPublicCatalog();
  };

  const saveListing = async (
    kind: ListingKind,
    id: string | undefined,
    payload: Record<string, unknown>,
    status: ListingStatus,
  ): Promise<string> => {
    if (!isAdmin) throw new Error("Masuk sebagai administrator untuk mengubah katalog.");
    const activeSession = await currentSession();
    const normalizedPayload = {
      ...payload,
      id: id || payload.id || crypto.randomUUID(),
      isVerified: status === "published",
      createdAt: payload.createdAt || dateToday(),
    };
    const saved = await upsertListing(kind, id, normalizedPayload, status, activeSession);
    setAdminListings((previous) => [saved, ...previous.filter((item) => !(item.kind === saved.kind && item.id === saved.id))]);
    const refreshResults = await Promise.allSettled([refreshAdminCatalog(activeSession), refreshPublicCatalog()]);
    if (refreshResults.some((result) => result.status === "rejected")) {
      showToast("Listing tersimpan", "Data berhasil disimpan, tetapi daftar belum diperbarui. Muat ulang dashboard untuk menyegarkan tampilan.", "info");
    }
    else showToast("Perubahan tersimpan", "Data katalog berhasil diperbarui.");
    return saved.id;
  };

  const deleteListing = async (kind: ListingKind, id: string) => {
    if (!isAdmin) throw new Error("Masuk sebagai administrator untuk mengubah katalog.");
    const activeSession = await currentSession();
    await deleteRemoteListing(kind, id, activeSession);
    setAdminListings((previous) => previous.filter((item) => !(item.kind === kind && item.id === id)));
    const refreshResults = await Promise.allSettled([refreshAdminCatalog(activeSession), refreshPublicCatalog()]);
    showToast("Listing dihapus", refreshResults.some((result) => result.status === "rejected") ? "Data sudah dihapus. Muat ulang dashboard untuk menyegarkan daftar." : "Data berhasil dihapus dari katalog.", "info");
  };

  const uploadImage = async (file: File) => {
    if (!isAdmin) throw new Error("Masuk sebagai administrator untuk mengunggah foto.");
    return uploadListingImage(file, await currentSession());
  };

  const addHouse = (
    house: Omit<RumahPanggung, "id" | "createdAt" | "isVerified">,
  ) => {
    void saveListing("houses", undefined, house as Record<string, unknown>, "draft")
      .catch((error) => showToast("Rumah belum tersimpan", String(error), "error"));
  };

  const addStore = (store: Omit<UMKMStore, "id" | "createdAt" | "isVerified">) => {
    void saveListing("stores", undefined, store as Record<string, unknown>, "draft")
      .catch((error) => showToast("Toko belum tersimpan", String(error), "error"));
  };

  const addProductToStore = (
    storeId: string,
    product: Omit<UMKMProductItem, "id">,
  ) => {
    const existing = adminListings.find(
      (listing) => listing.kind === "stores" && listing.id === storeId,
    );
    if (!existing) {
      showToast("Toko tidak ditemukan", "Pilih toko yang ingin diperbarui.", "error");
      return;
    }
    const store = existing.payload as UMKMStore;
    const products = [
      ...store.products,
      { ...product, id: crypto.randomUUID() },
    ];
    void saveListing("stores", storeId, { ...store, products }, existing.status)
      .catch((error) => showToast("Produk belum tersimpan", String(error), "error"));
  };

  const resetToDefault = () => {
    showToast(
      "Katalog terhubung",
      "Data demo tidak digunakan. Kelola listing melalui dashboard admin.",
      "info",
    );
  };

  return (
    <DataContext.Provider
      value={{
        houses,
        umkmStores,
        destinations,
        adminListings,
        staffManaged: isSupabaseConfigured,
        catalogLoading,
        adminLoading,
        adminEmail: isAdmin ? session?.user.email || null : null,
        isAdmin,
        isPartner,
        partnerMustChangePassword,
        partnerListing,
        partnerListingKind,
        partnerSubmissions,
        partnerAccounts,
        loginAdmin,
        loginPartner,
        logoutAdmin,
        submitPartnerListing,
        refreshPartnerData,
        reviewSubmission,
        createPartnerAccount,
        unlinkPartnerAccount,
        changePartnerPassword,
        uploadPartnerImage,
        saveListing,
        deleteListing,
        uploadImage,
        addHouse,
        addStore,
        addProductToStore,
        resetToDefault,
        toasts,
        removeToast,
        showToast,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
