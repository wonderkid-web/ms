import { prisma } from "@/lib/prisma"


async function main() {
  // Seed a demo supplier, products, and trace events
  const supplier = await prisma.supplier.upsert({
    where: { id: "demo-supplier" },
    update: {},
    create: {
      id: "demo-supplier",
      name: "PT Sawit Maju Jaya",
      certification: "RSPO",
      location: "Riau, Indonesia",
      contactEmail: "kontak@sawit-maju.co.id",
      description: "Pemasok CPO tersertifikasi RSPO dengan praktik berkelanjutan.",
    },
  })

  const product = await prisma.product.create({
    data: {
      name: "CPO Batch 2309-RIAU",
      supplierId: supplier.id,
      batchCode: "2309-RIAU",
      origin: "Riau",
      harvestDate: new Date(),
      description: "Crude Palm Oil dari kebun Riau.",
    },
  })

  await prisma.traceEvent.createMany({
    data: [
      {
        productId: product.id,
        stepName: "Panen TBS",
        location: "Kebun Riau Blok A3",
        notes: "Kualitas TBS grade A",
        occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      },
      {
        productId: product.id,
        stepName: "Pengangkutan ke Pabrik",
        location: "Rute Riau-Kampar",
        occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      },
      {
        productId: product.id,
        stepName: "Proses di Pabrik",
        location: "PKS Sungai Kampar",
        notes: "Ekstraksi CPO",
        occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      },
      {
        productId: product.id,
        stepName: "Pengemasan",
        location: "Gudang Pekanbaru",
        occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      },
    ],
  })

  console.log("Seed completed")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
