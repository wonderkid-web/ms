// services/declarationOptionsService.ts
import {prisma} from "@/lib/prisma";

export async function getDeclarationOptions() {
  const [produk, group, supplier, pabrik] = await Promise.all([
    prisma.productGroup.findMany({
      select: { id: true, name: true }
    }),
    prisma.group.findMany({
      select: { id: true, name: true }
    }),
    prisma.supplier.findMany({
      select: { id: true, name: true }
    }),
    prisma.factory.findMany({
      select: { id: true, name: true, alamat: true, latitude: true, longitude: true }
    }),
  ]);

  return {
    produk: produk.map(p => ({ value: p.id.toString(), label: p.name })),
    group: group.map(g => ({ value: g.id.toString(), label: g.name })),
    supplier: supplier.map(s => ({ value: s.id.toString(), label: s.name })),
    pabrik: pabrik.map(f => ({
      value: f.id.toString(),
      label: f.name,
      alamat: f.alamat ?? "",
      lat: f.latitude ?? 0,
      lng: f.longitude ?? 0
    })),
  };
}
