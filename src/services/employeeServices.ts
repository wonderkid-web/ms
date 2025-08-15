"use server";

import { prisma } from "@/lib/prisma";

// Get all users
export async function getEmployees() {
  return prisma.employee.findMany({ orderBy: { id: "asc" } });
}

// Create user
export async function createEmployee(data: {
  fullName: string;
  email: string;
  whatsapp: string;
  corporate: string;
  isActive: boolean;
}) {
  return prisma.employee.create({ data });
}

// Update user
export async function updateEmployee(id: number, data: {
  fullName: string;
  email: string;
  whatsapp: string;
  corporate: string;
  isActive: boolean;
}) {
  return prisma.employee.update({
    where: { id },
    data
  });
}

// Delete user
export async function deleteEmployee(id: number) {
  return prisma.employee.delete({ where: { id } });
}
