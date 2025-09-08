
"use client";

import { useMemo, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Field, selectStyles, selectTheme } from "./ui";
import toast from "react-hot-toast";
import { createDeclaration, updateDeclaration } from "@/services/declarationServices";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), {
  ssr: false, // aman untuk komponen client-only
  loading: () => <div className="h-10 rounded bg-gray-200 animate-pulse" />,
});

import { useFieldArray } from "react-hook-form";
import { FormInput } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/components/toast";

const supplierTypeOptions = [
  { value: "INTI", label: "Inti" },
  { value: "PLASMA", label: "Plasma" },
  { value: "SWADAYA", label: "Swadaya" },
  { value: "PIHAK_KETIGA", label: "Pihak Ketiga" },
  { value: "LAINNYA", label: "Lainnya" },
];

const legalStatusOptions = [
  { value: "HGU", label: "HGU" },
  { value: "SHM", label: "SHM" },
  { value: "SKT", label: "SKT" },
  { value: "HGB", label: "HGB" },
  { value: "LAINNYA", label: "Lainnya" },
];

const mapAvailabilityOptions = [
  { value: "TERSEDIA", label: "Tersedia" },
  { value: "TIDAK", label: "Tidak" },
];

// -------------------
// Form Schema
// -------------------
const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

// detail baris
const detailSchema = z.object({
  namaSupplier: z.string().min(1, "Wajib diisi"),
  jenisSupplier: optionSchema, // pilih dari enum
  jumlahPetani: z.coerce.number().int().min(0).optional(),
  alamatKebun: z.string().min(1, "Wajib diisi"),
  latitude: z
    .preprocess(
      (v) => (v === "" || v === null ? undefined : Number(v)),
      z.number().min(-90).max(90)
    )
    .optional(),
  longitude: z
    .preprocess(
      (v) => (v === "" || v === null ? undefined : Number(v)),
      z.number().min(-180).max(180)
    )
    .optional(),
  petaKebun: optionSchema.nullable().optional(), // Tersedia/Tidak
  areaHa: z.coerce.number().min(0).optional(),
  statusLegalitas: optionSchema.nullable().optional(),
  persentaseSuplai: z.coerce.number().min(0).max(100),
});

// ----- SKEMA UTAMA (tambahkan 'details' + refine total 100%) -----
const schema = z
  .object({
    // ... field kamu yang sudah ada
    // (jangan dihapus)
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
      .refine((val) => !!val, { message: "Wajib pilih pabrik" }),
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

    // NEW
    details: z.array(detailSchema).min(1, "Minimal 1 pemasok"),
  })
  .refine(
    (val) => {
      const total =
        val.details?.reduce(
          (acc, d) => acc + Number(d.persentaseSuplai || 0),
          0
        ) ?? 0;
      return Math.abs(total - 100) < 0.01; // toleransi 0.01
    },
    {
      message: "Total persentase suplai (detail) harus = 100%",
      path: ["details"],
    }
  );

type FormValues = z.infer<typeof schema>;
type OptionType = { value: string; label: string };
type PabrikOption = OptionType & { alamat: string; lat: number; lng: number };
type DetailForm = z.infer<typeof detailSchema>;

// -------------------
// Component
// -------------------
export default function DeclarationForm({
  produkOptions,
  groupOptions,
  supplierOptions,
  pabrikOptions,
  declaration,
  details,
}: {
  produkOptions: OptionType[];
  groupOptions: OptionType[];
  supplierOptions: OptionType[];
  pabrikOptions: PabrikOption[];
  declaration?: any;
  details?: any;
}) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver<FormValues>(schema),
    defaultValues: declaration ? {
      ...declaration,
      periodeDari: new Date(declaration.periodeDari).toISOString().slice(0, 10),
      periodeSampai: new Date(declaration.periodeSampai).toISOString().slice(0, 10),
      tanggalPengisian: new Date(declaration.tanggalPengisian).toISOString().slice(0, 10),
      produk: { value: String(declaration.produk.id), label: declaration.produk.name },
      group: { value: String(declaration.group.id), label: declaration.group.name },
      supplier: declaration.supplier ? { value: String(declaration.supplier.id), label: declaration.supplier.name } : null,
      pabrik: declaration.factory ? { value: String(declaration.factory.id), label: declaration.factory.name, alamat: declaration.alamatPabrik, lat: declaration.latitude, lng: declaration.longitude } : null,
      kapasitas: { value: declaration.kapasitas, label: `${declaration.kapasitas} ton/tahun` },
      sertifikasi: declaration.sertifikasi.split(',').map((s: string) => ({ value: s, label: s })),
      details: details.map((d: any) => ({
        ...d,
        jenisSupplier: { value: d.jenisSupplier, label: d.jenisSupplier },
        petaKebun: d.petaKebun ? { value: d.petaKebun, label: d.petaKebun } : null,
        statusLegalitas: d.statusLegalitas ? { value: d.statusLegalitas, label: d.statusLegalitas } : null,
      })),
    } : {
      sertifikasi: [],
      tanggalPengisian: today,
      alamatPabrik: "",
      latitude: 0,
      longitude: 0,

      // NEW: 1 baris kosong
      details: [
        {
          namaSupplier: "",
          jenisSupplier: supplierTypeOptions[0],
          jumlahPetani: undefined,
          alamatKebun: "",
          latitude: undefined as unknown as number,
          longitude: undefined as unknown as number,
          petaKebun: null,
          areaHa: undefined,
          statusLegalitas: null,
          persentaseSuplai: 0,
        },
      ],
    },
  });

  const detailRows = watch("details");
  const totalDetailPercent = useMemo(
    () =>
      (detailRows ?? []).reduce(
        (acc: number, r: any) => acc + (Number(r?.persentaseSuplai) || 0),
        0
      ),
    [detailRows]
  );

  useEffect(() => {
    setValue("totalPersenTtp", Number(totalDetailPercent.toFixed(2)));
  }, [totalDetailPercent, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const isTahun2024 = watch("isTahun2024");

  useEffect(() => {
    if (isTahun2024) {
      setValue("periodeDari", "2024-01-01");
      setValue("periodeSampai", "2024-12-31");
    }
  }, [isTahun2024, setValue]);

  const kapasitasOptions: OptionType[] = [
    { value: "60000", label: "60.000 ton/tahun" },
    { value: "120000", label: "120.000 ton/tahun" },
    { value: "180000", label: "180.000 ton/tahun" },
  ];

  const sertifikasiOptions: OptionType[] = [
    { value: "ISPO", label: "ISPO" },
    { value: "RSPO", label: "RSPO" },
    { value: "ISCC", label: "ISCC" },
  ];

  const onSubmit: SubmitHandler<FormValues> = async (v) => {
    try {
      if (declaration) {
        await updateDeclaration(declaration.id, {
          // --- header (lama) ---
          produkId: parseInt(v.produk.value),
          groupId: parseInt(v.group.value),
          supplierId: v.supplier ? parseInt(v.supplier.value) : null,
          factoryId: parseInt(v.pabrik?.value!),
          alamatPabrik: v.alamatPabrik,
          latitude: v.latitude,
          longitude: v.longitude,
          kapasitas: v.kapasitas.value,
          sertifikasi: (v.sertifikasi ?? []).map((s) => s.value).join(","),
          periodeDari: new Date(v.periodeDari),
          periodeSampai: new Date(v.periodeSampai),
          totalPersenTtp: v.totalPersenTtp,
          tanggalPengisian: new Date(v.tanggalPengisian),
          diisiOleh: v.diisiOleh,

          // --- NEW: details ---
          details: v.details.map((d) => ({
            namaSupplier: d.namaSupplier,
            jenisSupplier: d.jenisSupplier.value,
            jumlahPetani: d.jumlahPetani ?? null,
            alamatKebun: d.alamatKebun,
            latitude: d.latitude ?? null,
            longitude: d.longitude ?? null,
            petaKebun: d.petaKebun?.value ?? null,
            areaHa: d.areaHa ?? null,
            statusLegalitas: d.statusLegalitas?.value ?? null,
            persentaseSuplai: d.persentaseSuplai,
          })),
        });
        showSuccessToast("Declaration + detail berhasil diupdate!");
      } else {
        await createDeclaration({
          // --- header (lama) ---
          produkId: parseInt(v.produk.value),
          groupId: parseInt(v.group.value),
          supplierId: v.supplier ? parseInt(v.supplier.value) : null,
          factoryId: parseInt(v.pabrik?.value!),
          alamatPabrik: v.alamatPabrik,
          latitude: v.latitude,
          longitude: v.longitude,
          kapasitas: v.kapasitas.value,
          sertifikasi: (v.sertifikasi ?? []).map((s) => s.value).join(","),
          periodeDari: new Date(v.periodeDari),
          periodeSampai: new Date(v.periodeSampai),
          totalPersenTtp: v.totalPersenTtp,
          tanggalPengisian: new Date(v.tanggalPengisian),
          diisiOleh: v.diisiOleh,

          // --- NEW: details ---
          details: v.details.map((d) => ({
            namaSupplier: d.namaSupplier,
            jenisSupplier: d.jenisSupplier.value,
            jumlahPetani: d.jumlahPetani ?? null,
            alamatKebun: d.alamatKebun,
            latitude: d.latitude ?? null,
            longitude: d.longitude ?? null,
            petaKebun: d.petaKebun?.value ?? null,
            areaHa: d.areaHa ?? null,
            statusLegalitas: d.statusLegalitas?.value ?? null,
            persentaseSuplai: d.persentaseSuplai,
          })),
        });
        showSuccessToast("Declaration + detail tersimpan!");
      }
    } catch {
      showErrorToast("Gagal menyimpan declaration");
    }
  };

  return (
    <div className=" rounded-xl border bg-white p-5 shadow-sm md:p-6">
      <h1 className="mb-1 text-2xl font-bold text-emerald-800">
        {declaration ? "Edit Declaration" : "Declaration Form"}
      </h1>
      <Separator className="mb-4" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-[16px]">
        {/* Info Utama */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Informasi Utama
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Produk" required error={errors.produk?.message}>
              <Controller
                name="produk"
                control={control}
                render={({ field }) => (
                  <Select<OptionType, false>
                    {...field}
                    options={produkOptions}
                    styles={{ ...selectStyles, menu: (base) => ({ ...base, zIndex: 9999 }) }}
                    theme={selectTheme}
                    placeholder="Pilih produk"
                    menuPosition="fixed"
                  />
                )}
              />
            </Field>

            <Field label="Nama Group" required>
              <Controller
                name="group"
                control={control}
                render={({ field }) => (
                  <Select<OptionType, false>
                    {...field}
                    options={groupOptions}
                    styles={{ ...selectStyles, menu: (base) => ({ ...base, zIndex: 9999 }) }}
                    theme={selectTheme}
                    menuPosition="fixed"
                  />
                )}
              />
            </Field>

            <Field label="Nama Supplier">
              <Controller
                name="supplier"
                control={control}
                render={({ field }) => (
                  <Select<OptionType, false>
                    {...field}
                    isClearable
                    options={supplierOptions}
                    styles={{ ...selectStyles, menu: (base) => ({ ...base, zIndex: 9999 }) }}
                    theme={selectTheme}
                    placeholder="Pilih supplier"
                    menuPosition="fixed"
                  />
                )}
              />
            </Field>

            <Field label="Nama Pabrik" required error={errors.pabrik?.message}>
              <Controller
                name="pabrik"
                control={control}
                render={({ field }) => (
                  <Select<PabrikOption, false>
                    {...field}
                    options={pabrikOptions}
                    styles={{ ...selectStyles, menu: (base) => ({ ...base, zIndex: 9999 }) }}
                    theme={selectTheme}
                    placeholder="Pilih pabrik"
                    menuPosition="fixed"
                    onChange={(opt) => {
                      field.onChange(opt);
                      setValue("alamatPabrik", opt?.alamat ?? "");
                      setValue("latitude", opt?.lat ?? 0);
                      setValue("longitude", opt?.lng ?? 0);
                    }}
                  />
                )}
              />
            </Field>
          </div>
        </div>

        {/* Lokasi Pabrik */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Lokasi Pabrik
          </h2>
          <Field label="Alamat Pabrik">
            <Textarea {...register("alamatPabrik")} readOnly rows={3} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Latitude">
              <Input
                type="number"
                step="any"
                {...register("latitude", { valueAsNumber: true })}
                readOnly
              />
            </Field>
            <Field label="Longitude">
              <Input
                type="number"
                step="any"
                {...register("longitude", { valueAsNumber: true })}
                readOnly
              />
            </Field>
          </div>
        </div>

        {/* Kapasitas & Sertifikasi */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Kapasitas & Sertifikasi
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Kapasitas Pabrik" required>
              <Controller
                name="kapasitas"
                control={control}
                render={({ field }) => (
                  <Select<OptionType, false>
                    {...field}
                    options={kapasitasOptions}
                    styles={{ ...selectStyles, menu: (base) => ({ ...base, zIndex: 9999 }) }}
                    theme={selectTheme}
                    placeholder="Pilih kapasitas"
                    menuPosition="fixed"
                  />
                )}
              />
            </Field>

            <Field label="Sertifikasi Pabrik">
              <Controller
                name="sertifikasi"
                control={control}
                render={({ field }) => (
                  <Select<OptionType, true>
                    {...field}
                    isMulti
                    options={sertifikasiOptions}
                    styles={{ ...selectStyles, menu: (base) => ({ ...base, zIndex: 9999 }) }}
                    theme={selectTheme}
                    placeholder="Pilih sertifikasi"
                    menuPosition="fixed"
                  />
                )}
              />
            </Field>
          </div>
        </div>

        {/* Periode & Lainnya */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Periode & Lainnya
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Periode TTP — Dari" required>
              <Input type="date" {...register("periodeDari")} />
            </Field>
            <Field label="Periode TTP — Sampai" required>
              <Input type="date" {...register("periodeSampai")} />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Total Persentasi TTP (%)" required>
              <Input
                type="number"
                step="0.01"
                {...register("totalPersenTtp")}
              />
            </Field>
            <Field label="Tanggal Pengisian" required>
              <Input
                type="date"
                {...register("tanggalPengisian")}
                defaultValue={today}
              />
            </Field>
          </div>

          <Field label="Diisi Oleh" required>
            <Input {...register("diisiOleh")} placeholder="Nama (Jabatan)" />
          </Field>

          <label className="mt-2 flex items-center gap-2 text-[15px]">
            <input
              type="checkbox"
              {...register("isTahun2024")}
              className="h-4 w-4"
            />
            Gunakan periode 2024 (Jan—Des)
          </label>
        </div>

        {/* DETAIL PEMASOK */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Detail Pemasok (TTP)
          </h2>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3">Nama Supplier</th>
                  <th className="p-3">Jenis Supplier</th>
                  <th className="p-3">Jumlah Petani</th>
                  <th className="p-3">Alamat Kebun</th>
                  <th className="p-3">Lat</th>
                  <th className="p-3">Lon</th>
                  <th className="p-3">Peta Kebun</th>
                  <th className="p-3">Area (HA)</th>
                  <th className="p-3">Status Legalitas</th>
                  <th className="p-3">Persen (%)</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {fields.map((f, idx) => (
                  <tr key={f.id} className="border-t">
                    {/* Nama Supplier */}
                    <td className="p-2 align-top min-w-[200px]">
                      <Input
                        placeholder="Nama supplier/kebun"
                        {...register(`details.${idx}.namaSupplier` as const)}
                      />
                      {errors.details?.[idx]?.namaSupplier && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.details[idx]?.namaSupplier?.message as string}
                        </p>
                      )}
                    </td>

                    {/* Jenis Supplier */}
                    <td className="p-2 align-top min-w-[200px]">
                      <Controller
                        control={control}
                        name={`details.${idx}.jenisSupplier` as const}
                        render={({ field }) => (
                          <Select<OptionType, false>
                            {...field}
                            options={supplierTypeOptions}
                            styles={{ ...selectStyles, menu: (base) => ({ ...base, zIndex: 9999 }) }}
                            theme={selectTheme}
                            placeholder="Pilih jenis"
                            menuPosition="fixed"
                          />
                        )}
                      />
                    </td>

                    {/* Jumlah Petani */}
                    <td className="p-2 align-top min-w-[100px]">
                      <Input
                        type="number"
                        className="text-center"
                        min={0}
                        {...register(`details.${idx}.jumlahPetani` as const, {
                          setValueAs: (v) => (v === "" ? undefined : Number(v)),
                        })}
                      />
                    </td>

                    {/* Alamat Kebun */}
                    <td className="p-2 align-top min-w-[220px]">
                      <Textarea
                        rows={2}
                        placeholder="Alamat kebun"
                        {...register(`details.${idx}.alamatKebun` as const)}
                      />
                      {errors.details?.[idx]?.alamatKebun && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.details[idx]?.alamatKebun?.message as string}
                        </p>
                      )}
                    </td>

                    {/* Lat */}
                    <td className="p-2 align-top min-w-[100px]">
                      <Input
                        type="number"
                        step="any"
                        placeholder="-3.25"
                        {...register(`details.${idx}.latitude` as const, {
                          setValueAs: (v) => (v === "" ? undefined : Number(v)),
                        })}
                      />
                    </td>

                    {/* Lon */}
                    <td className="p-2 align-top min-w-[100px]">
                      <Input
                        type="number"
                        step="any"
                        placeholder="104.47"
                        {...register(`details.${idx}.longitude` as const, {
                          setValueAs: (v) => (v === "" ? undefined : Number(v)),
                        })}
                      />
                    </td>

                    {/* Peta Kebun */}
                    <td className="p-2 align-top min-w-[200px]">
                      <Controller
                        control={control}
                        name={`details.${idx}.petaKebun` as const}
                        render={({ field }) => (
                          <Select<OptionType, false>
                            {...field}
                            isClearable
                            options={mapAvailabilityOptions}
                            styles={{ ...selectStyles, menu: (base) => ({ ...base, zIndex: 9999 }) }}
                            theme={selectTheme}
                            placeholder="Pilih"
                            menuPosition="fixed"
                          />
                        )}
                      />
                    </td>

                    {/* Area (HA) */}
                    <td className="p-2 align-top min-w-[100px]">
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...register(`details.${idx}.areaHa` as const, {
                          setValueAs: (v) => (v === "" ? undefined : Number(v)),
                        })}
                      />
                    </td>

                    {/* Status Legalitas */}
                    <td className="p-2 align-top min-w-[200px]">
                      <Controller
                        control={control}
                        name={`details.${idx}.statusLegalitas` as const}
                        render={({ field }) => (
                          <Select<OptionType, false>
                            {...field}
                            isClearable
                            options={legalStatusOptions}
                            styles={{ ...selectStyles, menu: (base) => ({ ...base, zIndex: 9999 }) }}
                            theme={selectTheme}
                            placeholder="Pilih"
                            menuPosition="fixed"
                          />
                        )}
                      />
                    </td>

                    {/* Persentase */}
                    <td className="p-2 align-top min-w-[100px]">
                      <Input
                        type="number"
                        step="0.01"
                        className="text-center"
                        min={0}
                        max={100}
                        {...register(
                          `details.${idx}.persentaseSuplai` as const,
                          {
                            setValueAs: (v) => (v === "" ? 0 : Number(v)),
                          }
                        )}
                      />
                      {errors.details?.[idx]?.persentaseSuplai && (
                        <p className="mt-1 text-xs text-red-600">
                          {
                            errors.details[idx]?.persentaseSuplai
                              ?.message as string
                          }
                        </p>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="p-2 align-top min-w-24 mx-auto text-center">
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="text-emerald-700 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() =>
                append({
                  namaSupplier: "",
                  jenisSupplier: supplierTypeOptions[0],
                  jumlahPetani: undefined,
                  alamatKebun: "",
                  latitude: undefined as unknown as number,
                  longitude: undefined as unknown as number,
                  petaKebun: null,
                  areaHa: undefined,
                  statusLegalitas: null,
                  persentaseSuplai: 0,
                } as DetailForm)
              }
            >
              <FormInput /> Tambah Baris
            </Button>

            <div className="text-sm">
              Total Persen Detail:{" "}
              <span
                className={
                  Math.abs(totalDetailPercent - 100) < 0.01
                    ? "text-emerald-700"
                    : "text-red-600"
                }
              >
                {totalDetailPercent.toFixed(2)}%
              </span>
            </div>
          </div>

          {errors.details && !Array.isArray(errors.details) && (
            <p className="text-sm text-red-600">
              Total persentase detail harus 100%
            </p>
          )}
        </div>

        <Separator />

        <div className="flex justify-end gap-3 pt-2">
          {/* <Button type="button" variant="outline">
            Batal
          </Button> */}
          <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
            {declaration ? "Update" : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
