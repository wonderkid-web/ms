// src/services/accountService.ts
"use server";

import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import type { AccountRole, AccountStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/** =====================
 *  Helpers
 *  ===================== */
function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") || undefined;
  return { firstName, lastName };
}

async function findClerkUserByEmail(email: string) {
  const client = await clerkClient();
  const list = await client.users.getUserList({ emailAddress: [email] });
  return list?.data?.[0] ?? null;
}

/** =====================
 *  CREATE (Clerk + DB) with rollback
 *  ===================== */
export async function createAccountWithClerk(input: {
  email: string;
  password: string; // ditentukan admin
  fullName: string;
  company: string;
  position: string;
  phoneNumber: string;
  address: string;
  role?: AccountRole; // default VIEWER
  status?: AccountStatus; // default ACTIVE (karena sudah set password)
}) {
  const email = input.email.trim().toLowerCase();
  const role: AccountRole = input.role ?? "VIEWER";
  const status: AccountStatus = input.status ?? "ACTIVE";

  // 1) Pastikan belum ada di DB
  const existed = await prisma.account.findUnique({ where: { email } });
  if (existed) {
    throw new Error("Akun dengan email ini sudah terdaftar di database.");
  }

  // 2) Pastikan belum ada user di Clerk
  const clerkExisting = await findClerkUserByEmail(email);
  if (clerkExisting) {
    throw new Error(
      "User Clerk dengan email ini sudah ada. Pakai reset password atau hubungkan secara manual."
    );
  }

  // 3) Buat user di Clerk
  const { firstName, lastName } = splitName(input.fullName);
  const client = await clerkClient();
  const clerkUser = await client.users.createUser({
    emailAddress: [email],
    password: input.password,
    firstName,
    lastName,
  });

  // 4) Buat row Account di DB (rollback Clerk jika gagal)
  try {
    const account = await prisma.account.create({
      data: {
        email,
        fullName: input.fullName,
        company: input.company,  // Add company
        position: input.position,  // Add position
        phoneNumber: input.phoneNumber,  // Add phoneNumber
        address: input.address,  // Add address
        role,
        status, // ACTIVE / INVITED / SUSPENDED (default ACTIVE)
        clerkId: clerkUser.id,
        password: input.password, // Store hashed password or use Clerk password directly
      },
    });

    revalidatePath('/admin/akun')


    return { account, clerkUserId: clerkUser.id };
  } catch (err) {
    // rollback: hapus user Clerk agar tidak orphan
    try {
      await client.users.deleteUser(clerkUser.id);
    } catch {
      // swallow: biar error utama tetap ke-throw
    }
    throw err;
  }
}


/** =====================
 *  READ (list / by id / by email)
 *  ===================== */
export async function listAccounts(params?: {
  q?: string;
  role?: AccountRole;
  status?: AccountStatus;
  page?: number;
  pageSize?: number;
}) {
  const { q, role, status, page = 1, pageSize = 20 } = params || {};


  const [rows, total] = await Promise.all([
    prisma.account.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.account.count(),
  ]);

  return { rows, total, page, pageSize };
}

export async function getAccountById(id: number) {
  return prisma.account.findUnique({ where: { id } });
}

export async function getAccountByEmail(email: string) {
  return prisma.account.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

/** =====================
 *  UPDATE (role / status / name)
 *  ===================== */
export async function updateAccount(
  id: number,
  data: Partial<{ fullName: string; role: AccountRole; status: AccountStatus }>
) {
  return prisma.account.update({ where: { id }, data });
}

/** =====================
 *  PASSWORD (reset) — via Clerk
 *  ===================== */
export async function resetAccountPassword(id: number, newPassword: string) {
  const client = await clerkClient();
  const acc = await prisma.account.findUnique({ where: { id } });
  if (!acc?.clerkId) throw new Error("Akun tidak terhubung ke Clerk.");
  await client.users.updateUser(acc.clerkId, { password: newPassword });
  return { ok: true };
}

/** =====================
 *  STATUS helpers
 *  ===================== */
export async function activateAccount(id: number) {
  return prisma.account.update({
    where: { id },
    data: { status: "ACTIVE" },
  });
}

export async function suspendAccount(id: number) {
  return prisma.account.update({
    where: { id },
    data: { status: "SUSPENDED" },
  });
}

/** =====================
 *  DELETE (DB + optional Clerk)
 *  ===================== */
export async function deleteAccount(
  id: number,
  opts?: { alsoDeleteClerk?: boolean }
) {
  const client = await clerkClient();
  const acc = await prisma.account.findUnique({ where: { id } });
  if (!acc) return null;

  // hapus DB dulu
  const deleted = await prisma.account.delete({ where: { id } });

  // opsional: hapus user di Clerk juga
  if (opts?.alsoDeleteClerk && acc.clerkId) {
    try {
      await client.users.deleteUser(acc.clerkId);
    } catch (e) {
      // kalau gagal hapus clerk, akun DB sudah terhapus—log saja
      console.error("Gagal hapus user Clerk:", e);
    }
  }

  return deleted;
}
