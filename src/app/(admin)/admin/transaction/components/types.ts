
/* ---------- Types ---------- */
export type OptionType = { value: string; label: string };
export type MiniRef = { id: number; name: string } | null | undefined;

export type DeclarationRow = {
  id: number;
  produk: MiniRef;
  group: MiniRef;
  supplier?: MiniRef;
  factory: MiniRef;
  alamatPabrik: string;
  kapasitas: string;
  sertifikasi: string | null; // comma-separated
  totalPersenTtp: number;
  periodeDari: string | Date;
  periodeSampai: string | Date;
  tanggalPengisian: string | Date;
  diisiOleh: string;
};
