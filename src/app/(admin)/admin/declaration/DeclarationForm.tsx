'use client'

import { useMemo, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Select from 'react-select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils' // optional, kalau ada

/** ---------- SCHEMA ---------- **/
const schema = z.object({
  produk: z.object({ value: z.string(), label: z.string() }),
  group: z.object({ value: z.string(), label: z.string() }),
  supplier: z.object({ value: z.string(), label: z.string() }).nullable().optional(),
  pabrik: z.object({ value: z.string(), label: z.string() }, { required_error: 'Wajib pilih pabrik' }),
  alamatPabrik: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  kapasitas: z.object({ value: z.string(), label: z.string() }),
  sertifikasi: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  periodeDari: z.string(),
  periodeSampai: z.string(),
  isTahun2024: z.boolean().optional(),
  totalPersenTtp: z.coerce.number().min(0).max(100),
  tanggalPengisian: z.string(),
  diisiOleh: z.string(),
})
type FormValues = z.infer<typeof schema>

/** ---------- DUMMY DATA ---------- **/
type PabrikOption = { value: string; label: string; alamat: string; lat: number; lng: number }
const pabrikOptions: PabrikOption[] = [
  { value: 'p1', label: 'Pabrik A', alamat: 'SUMUT, BATU BARA', lat: 3.254594, lng: 99.30452 },
  { value: 'p2', label: 'Pabrik B', alamat: 'SUMUT, SIMALUNGUN', lat: 3.243048, lng: 99.30686 },
]

const kapasitasOptions = [
  { value: '60000', label: '60.000 ton/tahun' },
  { value: '120000', label: '120.000 ton/tahun' },
  { value: '180000', label: '180.000 ton/tahun' },
]

const produkOptions = [{ value: 'cpo', label: 'CPO' }, { value: 'pko', label: 'PKO' }]
const groupOptions = [{ value: 'MAHKOTA', label: 'MAHKOTA' }]
const supplierOptions = [{ value: 'sup1', label: 'Supplier A' }, { value: 'sup2', label: 'Supplier B' }]
const sertifikasiOptions = [{ value: 'ISPO', label: 'ISPO' }, { value: 'RSPO', label: 'RSPO' }, { value: 'ISCC', label: 'ISCC' }]

/** ---------- react-select styles & theme (aksesibel) ---------- **/
const selectStyles = {
  control: (b: any) => ({
    ...b,
    minHeight: 44,
    borderRadius: 8,
    borderColor: 'hsl(var(--input))',
    background: 'hsl(var(--background))',
    fontSize: '16px',
  }),
  valueContainer: (b: any) => ({ ...b, padding: '8px 10px' }),
  option: (b: any, s: any) => ({
    ...b,
    padding: '10px 12px',
    fontSize: '16px',
    backgroundColor: s.isFocused ? 'rgba(4,120,87,0.12)' : s.isSelected ? 'rgba(4,120,87,0.22)' : undefined,
    color: 'inherit',
  }),
  menu: (b: any) => ({ ...b, zIndex: 50 }),
  placeholder: (b: any) => ({ ...b, color: 'hsl(var(--muted-foreground))' }),
}
const selectTheme = (theme: any) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#047857', // emerald-700
    primary25: 'rgba(4,120,87,0.12)',
    primary50: 'rgba(4,120,87,0.22)',
    neutral80: '#0a0a0a',
  },
})

/** ---------- Helper ---------- **/
function Field({
  label, required, children, hint, error, className,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
  error?: string
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-[15px] font-semibold text-foreground">
        {label}{required ? <span className="text-emerald-700"> *</span> : null}
      </Label>
      {children}
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

/** ---------- COMPONENT ---------- **/
export default function DeclarationFormA11y() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const { control, register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        group: groupOptions[0],
        sertifikasi: [],
        tanggalPengisian: today,
        alamatPabrik: '',
        latitude: 0,
        longitude: 0,
      },
    })

  // auto range 2024 jika dicentang
  const isTahun2024 = watch('isTahun2024')
  useEffect(() => {
    if (isTahun2024) {
      setValue('periodeDari', '2024-01-01')
      setValue('periodeSampai', '2024-12-31')
    }
  }, [isTahun2024, setValue])

  const onSubmit = (v: FormValues) => {
    const payload = {
      produk: v.produk.value,
      group: v.group.value,
      supplier: v.supplier?.value ?? null,
      pabrikId: v.pabrik.value,
      alamatPabrik: v.alamatPabrik,
      latitude: v.latitude,
      longitude: v.longitude,
      kapasitas: v.kapasitas.value,
      sertifikasi: (v.sertifikasi ?? []).map(s => s.value),
      periode: { dari: v.periodeDari, sampai: v.periodeSampai },
      totalPersenTtp: v.totalPersenTtp,
      tanggalPengisian: v.tanggalPengisian,
      diisiOleh: v.diisiOleh,
    }
    console.log('SUBMIT', payload)
    alert('Data siap dikirim. (Lihat console)')
  }

  return (
    <div className="mx-auto max-w-3xl rounded-xl border bg-white p-5 shadow-sm md:p-6">
      <h1 className="mb-1 text-2xl font-bold text-emerald-800">Declaration Form</h1>
      <p className="mb-4 text-[15px] text-muted-foreground">
        Mohon isi data dengan lengkap. Kolom bertanda (<span className="text-emerald-700">*</span>) wajib diisi.
      </p>
      <Separator className="mb-4" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-[16px]">
        {/* Section: Info Utama */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Informasi Utama</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Produk" required error={errors.produk && String(errors.produk.message)}>
              <Controller name="produk" control={control} render={({ field }) => (
                <Select {...field} instanceId="produk" options={produkOptions} styles={selectStyles} theme={selectTheme} placeholder="Pilih produk" menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined} menuPosition="fixed" />
              )}/>
            </Field>

            <Field label="Nama Group" required>
              <Controller name="group" control={control} render={({ field }) => (
                <Select {...field} instanceId="group" options={groupOptions} styles={selectStyles} theme={selectTheme} />
              )}/>
            </Field>

            <Field label="Nama Supplier">
              <Controller name="supplier" control={control} render={({ field }) => (
                <Select {...field} isClearable instanceId="supplier" options={supplierOptions} styles={selectStyles} theme={selectTheme} placeholder="Pilih supplier" />
              )}/>
            </Field>

            <Field label="Nama Pabrik" required error={errors.pabrik && String(errors.pabrik.message)}>
              <Controller
                name="pabrik"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    instanceId="pabrik"
                    options={pabrikOptions}
                    styles={selectStyles}
                    theme={selectTheme}
                    placeholder="Pilih pabrik"
                    onChange={(opt) => {
                      field.onChange(opt)
                      const sel = opt as PabrikOption
                      setValue('alamatPabrik', sel?.alamat ?? '')
                      setValue('latitude', sel?.lat ?? 0)
                      setValue('longitude', sel?.lng ?? 0)
                    }}
                    menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                  />
                )}
              />
            </Field>
          </div>
        </div>

        {/* Section: Lokasi Pabrik */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Lokasi Pabrik</h2>
          <Field label="Alamat Pabrik" hint="Otomatis terisi berdasarkan pabrik" >
            <Textarea {...register('alamatPabrik')} readOnly rows={3} className="min-h-[88px] text-[16px]" />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Latitude">
              <Input type="number" step="any" {...register('latitude', { valueAsNumber: true })} readOnly className="h-11 text-[16px]" />
            </Field>
            <Field label="Longitude">
              <Input type="number" step="any" {...register('longitude', { valueAsNumber: true })} readOnly className="h-11 text-[16px]" />
            </Field>
          </div>
        </div>

        {/* Section: Kapasitas & Sertifikasi */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Kapasitas & Sertifikasi</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Kapasitas Pabrik" required>
              <Controller name="kapasitas" control={control} render={({ field }) => (
                <Select {...field} instanceId="kapasitas" options={kapasitasOptions} styles={selectStyles} theme={selectTheme} placeholder="Pilih kapasitas" />
              )}/>
            </Field>

            <Field label="Sertifikasi Pabrik">
              <Controller name="sertifikasi" control={control} render={({ field }) => (
                <Select
                  {...field}
                  instanceId="sertifikasi"
                  isMulti
                  options={sertifikasiOptions}
                  styles={selectStyles}
                  theme={selectTheme}
                  placeholder="Pilih sertifikasi"
                  onChange={(val) => field.onChange(val as any)}
                />
              )}/>
            </Field>
          </div>
        </div>

        {/* Section: Periode & Lainnya */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Periode & Lainnya</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Periode TTP — Dari" required>
              <Input type="date" {...register('periodeDari')} className="h-11 text-[16px]" />
            </Field>
            <Field label="Periode TTP — Sampai" required>
              <Input type="date" {...register('periodeSampai')} className="h-11 text-[16px]" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Total Persentasi TTP (%)" required hint="Nilai 0 – 100">
              <Input type="number" step="0.01" {...register('totalPersenTtp')} className="h-11 text-[16px]" />
            </Field>
            <Field label="Tanggal Pengisian" required>
              <Input type="date" {...register('tanggalPengisian')} defaultValue={today} className="h-11 text-[16px]" />
            </Field>
          </div>

          <Field label="Diisi Oleh" required>
            <Input {...register('diisiOleh')} placeholder="Nama (Jabatan)" className="h-11 text-[16px]" />
          </Field>

          <label className="mt-2 flex items-center gap-2 text-[15px]">
            <input type="checkbox" {...register('isTahun2024')} className="h-4 w-4" />
            Gunakan periode 2024 (Jan—Des)
          </label>
        </div>

        {/* Actions */}
        <Separator />
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="h-11 px-5 text-[15px]">Batal</Button>
          <Button type="submit" className="h-11 bg-emerald-700 px-6 text-[15px] hover:bg-emerald-800">
            Simpan
          </Button>
        </div>
      </form>
    </div>
  )
}
