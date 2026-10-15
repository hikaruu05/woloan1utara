import React from "react";
import type { UMKMProductItem } from "../types";
import { isHttpUrl, stringList } from "../utils/listings";

export const SubmissionPreview: React.FC<{
  payload: Record<string, unknown>;
  fields: { key: string; label: string }[];
}> = ({ payload, fields }) => {
  const gallery = stringList(payload.galleryUrls).filter(isHttpUrl);
  const products = (Array.isArray(payload.products) ? payload.products : []) as UMKMProductItem[];
  return <details className="mt-4 rounded-xl border border-warm-200 bg-warm-50 p-4">
    <summary className="cursor-pointer text-sm font-bold text-wood-900">Periksa seluruh data, produk, dan foto pengajuan</summary>
    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">{fields.filter(field => !["imageUrl", "galleryUrls"].includes(field.key)).map(field => {
      const value = payload[field.key];
      return <div key={field.key} className="min-w-0"><dt className="font-semibold text-warm-600">{field.label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-warm-900">{value == null || value === "" ? "Belum diisi" : Array.isArray(value) ? value.join(", ") : String(value)}</dd></div>;
    })}</dl>
    {gallery.length > 0 && <div className="mt-4 grid grid-cols-3 gap-2">{gallery.map((url, index) => <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer"><img src={url} alt={`Foto tambahan ${index + 1}`} loading="lazy" className="aspect-square w-full rounded-lg object-cover"/></a>)}</div>}
    {products.length > 0 && <section className="mt-4"><h4 className="font-bold text-wood-950">Produk yang diajukan ({products.length})</h4><div className="mt-2 space-y-3">{products.map((product, index) => <article key={product.id || index} className="flex gap-3 rounded-lg bg-white p-3">
      {product.imageUrl && <img src={product.imageUrl} alt={product.name} loading="lazy" className="h-20 w-20 rounded-lg object-cover"/>}
      <div className="min-w-0 break-words text-sm"><h5 className="font-bold text-wood-950">{product.name}</h5><p>{product.price || "Hubungi penjual"}{product.unit ? ` · ${product.unit}` : ""}</p><p>{product.description}</p>{product.phone && <p>WhatsApp: {product.phone}</p>}{product.mapsUrl && <p>Lokasi: {product.mapsUrl}</p>}</div>
    </article>)}</div></section>}
  </details>;
};
