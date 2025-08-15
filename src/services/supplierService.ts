"use server";

import { prisma } from "@/lib/prisma";

export async function getSuppliers() {
  return prisma.supplier.findMany({ orderBy: { id: "asc" } });
}

export async function createSupplier(data: { name: string }) {
  return prisma.supplier.create({ data });
}

export async function updateSupplier(id: number, data: { name: string }) {
  return prisma.supplier.update({ where: { id }, data });
}

export async function deleteSupplier(id: number) {
  return prisma.supplier.delete({ where: { id } });
}
