// The storage bucket accepts WebP up to 1.5 MB. Source photos are compressed locally.
export const MAX_SOURCE_IMAGE_BYTES = 50 * 1024 * 1024;
export const MAX_UPLOAD_IMAGE_BYTES = 1_500_000;
export const IMAGE_INPUT_ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp";
export const IMAGE_UPLOAD_HELP = "JPG, PNG, WebP, AVIF, GIF, atau BMP hingga 50 MB per foto (maks. 64 MP). Otomatis dikonversi ke WebP maksimal 1,5 MB; foto besar diperkecil. GIF memakai satu frame.";

type DecodedImage = { source: CanvasImageSource; width: number; height: number; close: () => void };

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch { /* Older browsers can often decode the same photo through an image element. */ }
  }
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Foto tidak dapat dibaca. Pilih JPG, PNG, atau WebP yang valid. Untuk HEIC/HEIF, ekspor sebagai JPG terlebih dahulu."));
      image.src = url;
    });
    return { source: image, width: image.naturalWidth, height: image.naturalHeight, close: () => URL.revokeObjectURL(url) };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

function encodeWebP(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) reject(new Error("Konversi foto gagal. Coba foto lain."));
      else if (blob.type !== "image/webp") reject(new Error("Browser ini belum mendukung konversi WebP. Perbarui browser lalu coba lagi."));
      else resolve(blob);
    }, "image/webp", quality);
  });
}

export async function optimizeImage(file: File): Promise<Blob> {
  if (!file.size) throw new Error("File foto kosong. Pilih foto lain.");
  const supportedType = /^image\/(jpeg|png|webp|avif|gif|bmp)$/i.test(file.type);
  const supportedName = /\.(jpe?g|png|webp|avif|gif|bmp)$/i.test(file.name);
  if (!supportedType && !(file.type === "" && supportedName)) {
    throw new Error("Pilih JPG, PNG, WebP, AVIF, GIF, atau BMP. Untuk HEIC/HEIF, ekspor sebagai JPG terlebih dahulu.");
  }
  if (file.size > MAX_SOURCE_IMAGE_BYTES) throw new Error("Ukuran foto awal maksimal 50 MB per file. Ekspor foto dengan ukuran lebih kecil lalu coba lagi.");

  const image = await decodeImage(file);
  const canvas = document.createElement("canvas");
  try {
    if (!image.width || !image.height || image.width * image.height > 64_000_000) {
      throw new Error("Resolusi foto terlalu besar atau tidak valid. Pilih foto hingga 64 megapiksel.");
    }
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Foto tidak dapat diproses di perangkat ini.");
    let maxSide = Math.min(1600, Math.max(image.width, image.height));
    // Reduce quality first, then dimensions. Never upload an incorrectly labelled PNG
    // or reject a large source simply because the first compression was insufficient.
    while (true) {
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      context.drawImage(image.source, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.84, 0.72, 0.6, 0.48]) {
        const blob = await encodeWebP(canvas, quality);
        if (blob.size <= MAX_UPLOAD_IMAGE_BYTES && blob.size > 0) return blob;
      }
      if (maxSide <= 480) break;
      maxSide = Math.max(480, Math.floor(maxSide * 0.75));
    }
    throw new Error("Foto belum dapat diperkecil hingga 1,5 MB. Ekspor sebagai JPG dengan resolusi lebih kecil lalu coba lagi.");
  } finally {
    image.close();
    canvas.width = canvas.height = 1;
  }
}
