"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

type CreateDeclarationInput = {
  produkId: number;
  groupId: number;
  supplierId: number | null;
  factoryId: number;
  alamatPabrik: string;
  latitude: number;
  longitude: number;
  kapasitas: string;
  sertifikasi: string;
  periodeDari: Date;
  periodeSampai: Date;
  totalPersenTtp: number;
  tanggalPengisian: Date;
  diisiOleh: string;
  details: Array<{
    namaSupplier: string;
    jenisSupplier: "INTI" | "PLASMA" | "SWADAYA" | "PIHAK_KETIGA" | "LAINNYA";
    jumlahPetani?: number | null;
    alamatKebun?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    petaKebun?: "TERSEDIA" | "TIDAK" | null;
    areaHa?: number | null;
    statusLegalitas?: "HGU" | "SHM" | "SKT" | "HGB" | "LAINNYA" | null;
    persentaseSuplai: number;
  }>;
};


// Type yang dipakai di client (collapsible row)
export type DeclarationDetail = {
  id: number;
  namaSupplier: string;
  jenisSupplier: string; // "INTI" | "PLASMA" | ...
  jumlahPetani: number | null;
  alamatKebun: string | null;
  latitude: number | null;
  longitude: number | null;
  petaKebun: "TERSEDIA" | "TIDAK" | null;
  areaHa: number | null;
  statusLegalitas: string | null;
  persentaseSuplai: number; // sudah di-convert dari Decimal
};


export async function getDeclarations() {
  try {
    const data = await prisma.declaration.findMany({
      include: {
        produk: true,
        group: true,
        supplier: true,
        factory: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return data;
  } catch (err) {
    console.error("❌ Error getDeclarations:", err);
    throw new Error("Gagal mengambil data Declaration");
  }
}

export async function createDeclaration(input: CreateDeclarationInput) {
  // optional: validasi total % = 100
  const total = input.details.reduce(
    (a, d) => a + Number(d.persentaseSuplai || 0),
    0
  );
  if (Math.abs(total - 100) > 0.01) {
    throw new Error("Total Persentase Suplai harus = 100%");
  }

  return prisma.declaration.create({
    data: {
      produkId: input.produkId,
      groupId: input.groupId,
      supplierId: input.supplierId,
      factoryId: input.factoryId,
      alamatPabrik: input.alamatPabrik,
      latitude: input.latitude,
      longitude: input.longitude,
      kapasitas: input.kapasitas,
      sertifikasi: input.sertifikasi,
      periodeDari: input.periodeDari,
      periodeSampai: input.periodeSampai,
      totalPersenTtp: input.totalPersenTtp,
      tanggalPengisian: input.tanggalPengisian,
      diisiOleh: input.diisiOleh,

      details: {
        create: input.details.map((d) => ({
          namaSupplier: d.namaSupplier,
          jenisSupplier: d.jenisSupplier,
          jumlahPetani: d.jumlahPetani ?? null,
          alamatKebun: d.alamatKebun ?? null,
          latitude: d.latitude ?? null,
          longitude: d.longitude ?? null,
          petaKebun: d.petaKebun ?? null,
          lampiran: undefined, // nanti isi kalau ada upload
          areaHa: d.areaHa != null ? new Prisma.Decimal(d.areaHa) : null,
          statusLegalitas: d.statusLegalitas ?? null,
          persentaseSuplai: new Prisma.Decimal(d.persentaseSuplai),
        })),
      },
    },
    include: { details: true },
  });
}

export async function deleteDeclaration(id: number) {
  try {
    await prisma.declaration.delete({
      where: { id },
    });
    return { success: true };
  } catch (err) {
    console.error("❌ Error deleteDeclaration:", err);
    throw new Error("Gagal menghapus Declaration");
  }
}


/** Helper aman untuk Prisma.Decimal -> number */
function toNum(v: unknown): number | null {
  if (v == null) return null;

  if (typeof v === "object" && typeof (v as any).toNumber === "function") {
    return (v as any).toNumber();
  }
  const n = Number(v as any);
  return Number.isNaN(n) ? null : n;
}

/**
 * Ambil semua detail untuk satu Declaration.
 * - noStore() supaya tidak kena cache
 * - urut id asc
 * - Decimal -> number
 */
export async function getDeclarationDetails(
  declarationId: number
): Promise<DeclarationDetail[]> {
  noStore();

  if (!declarationId || Number.isNaN(declarationId)) return [];

  const rows = await prisma.declarationDetail.findMany({
    where: { declarationId },
    orderBy: { id: "asc" },
  });

  console.log(rows)

  return rows.map((r) => ({
    id: r.id,
    namaSupplier: r.namaSupplier,
    jenisSupplier: r.jenisSupplier as string,
    jumlahPetani: r.jumlahPetani ?? null,
    alamatKebun: r.alamatKebun ?? null,
    latitude: r.latitude ?? null,
    longitude: r.longitude ?? null,
    petaKebun: (r.petaKebun as any) ?? null,
    areaHa: toNum(r.areaHa),
    statusLegalitas: (r.statusLegalitas as any) ?? null,
    persentaseSuplai: toNum(r.persentaseSuplai) ?? 0,
  }));
}
