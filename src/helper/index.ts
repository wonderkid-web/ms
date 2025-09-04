// Normalisasi nomor (fokus Indonesia)
export const toWaLink = (rawPhone: string, text?: string) => {
  let p = (rawPhone || "").trim();

  // buang spasi, titik, dash, dll (kecuali +)
  p = p.replace(/[^\d+]/g, "");

  // hilangkan plus di depan
  if (p.startsWith("+")) p = p.slice(1);

  // 08xx -> 628xx
  if (p.startsWith("0")) p = "62" + p.slice(1);

  // 8xx -> 628xx (kadang data masuk tanpa 0)
  if (/^\d+$/.test(p) && p.startsWith("8")) p = "62" + p;

  // kalau sudah 62xxx biarkan
  // (kalau bukan nomor ID, tetap kirim apa adanya)

  const base = `https://wa.me/${p}`;
  return text && text.trim()
    ? `${base}?text=${encodeURIComponent(text)}`
    : base;
};
