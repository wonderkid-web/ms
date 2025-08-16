"use server"
import { prisma } from "@/lib/prisma";


export async function getGroups() {
  return prisma.group.findMany({
    orderBy: { id: "asc" }
  });
}

export async function createGroup(data: { name: string }) {
  return prisma.group.create({
    data
  });
}

export async function updateGroup(id: number, data: { name: string }) {
  return prisma.group.update({
    where: { id },
    data
  });
}

export async function deleteGroup(id: number) {
  return prisma.group.delete({
    where: { id }
  });
}
