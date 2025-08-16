import { ReactNode } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 1) Wajib login Clerk
  const { userId } = await auth();
  if (!userId) redirect("/auth/login");

  // 2) Ambil email dari Clerk
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect("/auth/login");

  // 3) Cek role & status di DB (tabel Account)
  const acc = await prisma.account.findUnique({ where: { email } });
  if (!acc || acc.status === "SUSPENDED" || acc.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  // 4) Sinkron clerkId & aktifkan undangan
  if (!acc.clerkId || acc.status === "INVITED") {
    await prisma.account.update({
      where: { id: acc.id },
      data: {
        clerkId: user!.id,
        status: acc.status === "INVITED" ? "ACTIVE" : acc.status,
      },
    });
  }

  return (
    <AdminShell userName={user?.fullName ?? acc.fullName}>
      {children}
    </AdminShell>
  );
}
