// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ---------- MASTER DATA ----------
  // Suppliers
  const suppliers = [
    { id: 1, name: "Supplier A" },
    { id: 2, name: "Supplier B" },
    { id: 3, name: "Supplier C" },
  ];
  for (const s of suppliers) {
    await prisma.supplier.upsert({
      where: { id: s.id },
      create: { id: s.id, name: s.name },
      update: { name: s.name },
    });
  }

  // Groups (perusahaan/grup)
  const groups = [
    { id: 1, name: "MAHKOTA" },
    { id: 2, name: "ASTRA AGRO" },
    { id: 3, name: "WILMAR" },
  ];
  for (const g of groups) {
    await prisma.group.upsert({
      where: { id: g.id },
      create: { id: g.id, name: g.name },
      update: { name: g.name },
    });
  }

  // ProductGroup (Produk untuk declaration: CPO/PKO)
  const productGroups = [
    { id: 1, name: "CPO" },
    { id: 2, name: "PKO" },
  ];
  for (const pg of productGroups) {
    await prisma.productGroup.upsert({
      where: { id: pg.id },
      create: { id: pg.id, name: pg.name },
      update: { name: pg.name },
    });
  }

  // Factories (Pabrik)
  const factories = [
    {
      id: 1,
      name: "Pabrik A",
      alamat: "SUMUT, BATU BARA",
      latitude: 3.254594,
      longitude: 99.30452,
    },
    {
      id: 2,
      name: "Pabrik B",
      alamat: "SUMUT, SIMALUNGUN",
      latitude: 3.243048,
      longitude: 99.30686,
    },
    {
      id: 3,
      name: "Pabrik C",
      alamat: "RIAU, SIAK",
      latitude: 0.789275,
      longitude: 101.43686,
    },
  ];
  for (const f of factories) {
    await prisma.factory.upsert({
      where: { id: f.id },
      create: {
        id: f.id,
        name: f.name,
        alamat: f.alamat,
        latitude: f.latitude,
        longitude: f.longitude,
      },
      update: {
        name: f.name,
        alamat: f.alamat,
        latitude: f.latitude,
        longitude: f.longitude,
      },
    });
  }

  // ---------- PRODUCTS (contoh; tidak dipakai langsung di Declaration, tapi schema kamu punya) ----------
  const products = [
    // groupId mengacu ke ProductGroup (CPO/PKO) sesuai schema
    { id: 1, name: "Produk 1", supplierId: 1, groupId: 1, factoryId: 1 },
    { id: 2, name: "Produk 2", supplierId: 2, groupId: 2, factoryId: 2 },
  ];
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        name: p.name,
        supplierId: p.supplierId,
        groupId: p.groupId,
        factoryId: p.factoryId,
      },
      update: {
        name: p.name,
        supplierId: p.supplierId,
        groupId: p.groupId,
        factoryId: p.factoryId,
      },
    });
  }

  // ---------- EMPLOYEES (contoh data) ----------
  const employees = [
    {
      id: 1,
      fullName: "Wahyu Saputra",
      email: "wahyu@example.com",
      whatsapp: "6281234567890",
      corporate: "MAHKOTA",
      isActive: true,
    },
    {
      id: 2,
      fullName: "Admin QA",
      email: "admin.qa@example.com",
      whatsapp: "6281111111111",
      corporate: "ASTRA AGRO",
      isActive: true,
    },
  ];
  for (const e of employees) {
    await prisma.employee.upsert({
      where: { id: e.id },
      create: e,
      update: {
        fullName: e.fullName,
        email: e.email,
        whatsapp: e.whatsapp,
        corporate: e.corporate,
        isActive: e.isActive,
      },
    });
  }

  // ---------- DECLARATIONS ----------
  const now = new Date();
  const declarations = [
    {
      id: 1,
      produkId: 1, // CPO
      groupId: 1, // MAHKOTA
      supplierId: 1, // Supplier A
      factoryId: 1, // Pabrik A
      alamatPabrik: "SUMUT, BATU BARA",
      latitude: 3.254594,
      longitude: 99.30452,
      kapasitas: "60000",
      sertifikasi: "ISPO,RSPO",
      periodeDari: new Date("2024-01-01"),
      periodeSampai: new Date("2024-12-31"),
      totalPersenTtp: 75.5,
      tanggalPengisian: now,
      diisiOleh: "Admin",
    },
    {
      id: 2,
      produkId: 2, // PKO
      groupId: 1, // MAHKOTA
      supplierId: null, // optional
      factoryId: 2, // Pabrik B
      alamatPabrik: "SUMUT, SIMALUNGUN",
      latitude: 3.243048,
      longitude: 99.30686,
      kapasitas: "120000",
      sertifikasi: "ISCC",
      periodeDari: new Date("2024-06-01"),
      periodeSampai: new Date("2024-12-31"),
      totalPersenTtp: 60,
      tanggalPengisian: now,
      diisiOleh: "Admin",
    },
    {
      id: 3,
      produkId: 1, // CPO
      groupId: 2, // ASTRA AGRO
      supplierId: 2, // Supplier B
      factoryId: 3, // Pabrik C
      alamatPabrik: "RIAU, SIAK",
      latitude: 0.789275,
      longitude: 101.43686,
      kapasitas: "180000",
      sertifikasi: "RSPO",
      periodeDari: new Date("2024-03-01"),
      periodeSampai: new Date("2024-09-30"),
      totalPersenTtp: 82.25,
      tanggalPengisian: now,
      diisiOleh: "Admin QA",
    },
  ];

  for (const d of declarations) {
    await prisma.declaration.upsert({
      where: { id: d.id },
      create: d,
      update: {
        // field yang mungkin berubah
        produkId: d.produkId,
        groupId: d.groupId,
        supplierId: d.supplierId ?? null,
        factoryId: d.factoryId,
        alamatPabrik: d.alamatPabrik,
        latitude: d.latitude,
        longitude: d.longitude,
        kapasitas: d.kapasitas,
        sertifikasi: d.sertifikasi,
        periodeDari: d.periodeDari,
        periodeSampai: d.periodeSampai,
        totalPersenTtp: d.totalPersenTtp,
        tanggalPengisian: d.tanggalPengisian,
        diisiOleh: d.diisiOleh,
      },
    });
  }

  console.log("✅ Seeding selesai.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
