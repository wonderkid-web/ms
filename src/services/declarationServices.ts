"use server";

import {prisma} from "@/lib/prisma";

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

export async function createDeclaration(input: {
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
}) {
  try {
    const declaration = await prisma.declaration.create({
      data: input,
    });
    return declaration;
  } catch (err) {
    console.error("❌ Error createDeclaration:", err);
    throw new Error("Gagal membuat Declaration baru");
  }
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
