"use server";

import { prisma } from "@/lib/prisma";

export async function getFactories() {
  return prisma.factory.findMany({ orderBy: { id: "asc" } });
}

export async function createFactory(data: { name: string; alamat: string; latitude: number; longitude: number }) {
  return prisma.factory.create({ data });
}

export async function updateFactory(id: number, data: { name: string; alamat: string; latitude: number; longitude: number }) {
  return prisma.factory.update({ where: { id }, data });
}

export async function deleteFactory(id: number) {
  return prisma.factory.delete({ where: { id } });
}
