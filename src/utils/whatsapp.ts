export function normalizeWhatsAppNumber(value?: string): string {
  let digits = (value || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export function whatsappUrl(phone: string | undefined, message: string): string | null {
  const number = normalizeWhatsAppNumber(phone);
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
}
