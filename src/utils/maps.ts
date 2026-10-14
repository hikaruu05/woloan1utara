export function googleMapsSearchUrl(name?: string, address?: string): string {
  const query = [name, address].filter((part) => part?.trim()).join(", ") || "Woloan 1 Utara";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
