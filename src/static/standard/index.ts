import z from "zod";

// -------------------
// Form Schema
// -------------------
const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const schema = z.object({
  produk: optionSchema,
  group: optionSchema,
  supplier: optionSchema.nullable().optional(),
  pabrik: z
    .object({
      value: z.string(),
      label: z.string(),
      alamat: z.string(),
      lat: z.number(),
      lng: z.number(),
    })
    .nullable()
    .refine((val) => !!val, {
      message: "Wajib pilih pabrik",
    }),
  alamatPabrik: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  kapasitas: optionSchema,
  sertifikasi: z.array(optionSchema).optional(),
  periodeDari: z.string(),
  periodeSampai: z.string(),
  isTahun2024: z.boolean().optional(),
  totalPersenTtp: z.coerce.number().min(0).max(100),
  tanggalPengisian: z.string(),
  diisiOleh: z.string(),
});

type FormValues = z.infer<typeof schema>;
type OptionType = { value: string; label: string };
type PabrikOption = OptionType & { alamat: string; lat: number; lng: number };

export const kapasitasOptions: OptionType[] = [
  { value: "60000", label: "60.000 ton/tahun" },
  { value: "120000", label: "120.000 ton/tahun" },
  { value: "180000", label: "180.000 ton/tahun" },
];

export const sertifikasiOptions: OptionType[] = [
  { value: "ISPO", label: "ISPO" },
  { value: "RSPO", label: "RSPO" },
  { value: "ISCC", label: "ISCC" },
];
