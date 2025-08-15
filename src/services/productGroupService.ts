"use server";

import { prisma } from "@/lib/prisma";

export async function getProductGroups() {
  return prisma.productGroup.findMany({ orderBy: { id: "asc" } });
}

export async function createProductGroup(data: { name: string }) {
  return prisma.productGroup.create({ data });
}

export async function updateProductGroup(id: number, data: { name: string }) {
  return prisma.productGroup.update({ where: { id }, data });
}

export async function deleteProductGroup(id: number) {
  return prisma.productGroup.delete({ where: { id } });
}
