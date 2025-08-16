// src/app/(admin)/admin/account/page.tsx
import { revalidatePath } from "next/cache";
import {
  createAccountWithClerk,
  listAccounts,
  deleteAccount,
  suspendAccount,
  activateAccount,
} from "@/services/accountServices";
import AccountCreateForm from "./ui/accountCreateForm";
import AccountTable from "./ui/accountTable";

export const dynamic = "force-dynamic";

async function createAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("fullName") || "");
  const role = String(formData.get("role") || "VIEWER") as any;
  const status = String(formData.get("status") || "ACTIVE") as any;

  if (!email || !password || !fullName) {
    return {
      ok: false,
      message: "Email, Password, dan Full Name wajib diisi.",
    };
  }

  try {
    await createAccountWithClerk({ email, password, fullName, role, status });
    revalidatePath("/admin/account");
    return { ok: true, message: "Akun berhasil dibuat." };
  } catch (e: any) {
    return { ok: false, message: e?.message || "Gagal membuat akun." };
  }
}

async function deleteAction(id: number) {
  "use server";
  await deleteAccount(id, { alsoDeleteClerk: false }); // set true jika mau hapus user Clerk juga
  revalidatePath("/admin/account");
}

async function suspendAction(id: number) {
  "use server";
  await suspendAccount(id);
  revalidatePath("/admin/account");
}

async function activateAction(id: number) {
  "use server";
  await activateAccount(id);
  revalidatePath("/admin/account");
}

export default async function Page() {
  const { rows } = await listAccounts({ pageSize: 200 }); // simple load

  return (
    <main className="p-6 space-y-6">
      <div className="rounded-sm border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-900">Kelola Akun</h1>
        <p className="text-sm text-muted-foreground">
          Admin membuat akun user (email + password), tanpa sign-up publik.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-sm border bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-emerald-900">
            Buat Akun Baru
          </h2>
          <AccountCreateForm action={createAction} />
        </div>

        <div className="rounded-sm border bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-emerald-900">
            Daftar Akun
          </h2>
          <AccountTable
            initialRows={rows}
            onDelete={deleteAction}
            onSuspend={suspendAction}
            onActivate={activateAction}
          />
        </div>
      </div>
    </main>
  );
}
