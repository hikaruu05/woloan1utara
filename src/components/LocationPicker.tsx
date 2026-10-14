import React, { useMemo, useState } from "react";
import { LocateFixed, MapPin, Navigation, X } from "lucide-react";

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  searchText?: string;
}

function coordinatesFrom(value: string): { lat: string; lon: string } {
  if (!value) return { lat: "", lon: "" };
  let decoded = value;
  try { decoded = decodeURIComponent(value.replace(/\+/g, " ")); } catch { /* Keep the pasted URL as-is if it contains malformed escapes. */ }
  const match = decoded.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
    || decoded.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)
    || decoded.match(/[?&](?:q|query)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
    || decoded.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
  return match ? { lat: match[1], lon: match[2] } : { lat: "", lon: "" };
}

function googleMapsLink(lat: number, lon: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

function validCoordinates(lat: string, lon: string) {
  const latitude = Number(lat);
  const longitude = Number(lon);
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, searchText = "" }) => {
  const initial = coordinatesFrom(value);
  const [latitude, setLatitude] = useState(initial.lat);
  const [longitude, setLongitude] = useState(initial.lon);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const coordinates = useMemo(() => validCoordinates(latitude, longitude)
    ? { lat: Number(latitude), lon: Number(longitude) }
    : null, [latitude, longitude]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Browser ini belum mendukung akses lokasi. Masukkan titik koordinat secara manual.");
      return;
    }
    setBusy(true);
    setMessage("");
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setLatitude(lat.toFixed(6));
      setLongitude(lon.toFixed(6));
      onChange(googleMapsLink(lat, lon));
      setMessage("Lokasi saat ini sudah dipilih.");
      setBusy(false);
    }, error => {
      const text = error.code === error.PERMISSION_DENIED
        ? "Izin lokasi ditolak. Izinkan akses lokasi di browser atau atur titik secara manual."
        : error.code === error.TIMEOUT
          ? "Lokasi belum ditemukan. Coba lagi atau atur titik secara manual."
          : "Lokasi tidak tersedia. Coba lagi atau atur titik secara manual.";
      setMessage(text);
      setBusy(false);
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  };

  const applyManualLocation = () => {
    if (!coordinates) {
      setMessage("Masukkan koordinat lintang dan bujur yang valid.");
      return;
    }
    onChange(googleMapsLink(coordinates.lat, coordinates.lon));
    setMessage("Titik lokasi sudah disimpan.");
  };

  const mapUrl = coordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lon - 0.006}%2C${coordinates.lat - 0.004}%2C${coordinates.lon + 0.006}%2C${coordinates.lat + 0.004}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lon}`
    : "";
  const googleSearch = coordinates
    ? googleMapsLink(coordinates.lat, coordinates.lon)
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchText || "Woloan, Tomohon")}`;

  return <div className="mt-2 rounded-xl border border-warm-200 bg-white p-3.5">
    <div className="block text-xs font-semibold text-warm-700">Tautan titik Google Maps (opsional)<input aria-label="Tautan titik Google Maps" type="url" value={value} onChange={event=>{onChange(event.target.value);const parsed=coordinatesFrom(event.target.value);setLatitude(parsed.lat);setLongitude(parsed.lon);}} placeholder="Titik akan terisi otomatis setelah dipilih" className="mt-1 w-full rounded-lg border border-warm-300 px-3 py-2 text-sm font-normal"/></div>
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={useCurrentLocation} disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-wood-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
        <LocateFixed size={16}/>{busy ? "Mencari lokasi…" : "Gunakan lokasi saat ini"}
      </button>
      <a href={googleSearch} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-warm-300 px-3 py-2 text-sm font-semibold text-wood-900">
        <MapPin size={16}/>{coordinates ? "Buka titik di Google Maps" : "Cari titik di Google Maps"}
      </a>
      {value && <button type="button" onClick={() => { onChange(""); setLatitude(""); setLongitude(""); setMessage("Titik lokasi dihapus."); }} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-700"><X size={15}/>Hapus titik</button>}
    </div>
    <p className="mt-2 text-xs leading-5 text-warm-600">Izinkan akses lokasi browser saat diminta, atau masukkan koordinat sendiri. Anda juga bisa mencari lokasi di Google Maps, lalu menyalin koordinat titiknya.</p>
    <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
      <div className="text-xs font-semibold text-warm-700">Lintang<input aria-label="Lintang" type="number" inputMode="decimal" step="any" min="-90" max="90" value={latitude} onChange={event=>setLatitude(event.target.value)} placeholder="Contoh: 1.312500" className="mt-1 w-full rounded-lg border border-warm-300 px-3 py-2 text-sm font-normal"/></div>
      <div className="text-xs font-semibold text-warm-700">Bujur<input aria-label="Bujur" type="number" inputMode="decimal" step="any" min="-180" max="180" value={longitude} onChange={event=>setLongitude(event.target.value)} placeholder="Contoh: 124.824000" className="mt-1 w-full rounded-lg border border-warm-300 px-3 py-2 text-sm font-normal"/></div>
      <button type="button" onClick={applyManualLocation} disabled={!coordinates} className="self-end rounded-lg border border-wood-800 px-3 py-2 text-sm font-bold text-wood-900 disabled:opacity-40"><Navigation size={15} className="mr-1 inline"/>Simpan titik</button>
    </div>
    {coordinates && <iframe title="Pratinjau peta titik lokasi" src={mapUrl} loading="lazy" className="mt-3 h-52 w-full rounded-lg border-0" referrerPolicy="no-referrer"/>}
    {message && <p role="status" className="mt-2 text-xs leading-5 text-warm-700">{message}</p>}
  </div>;
};
