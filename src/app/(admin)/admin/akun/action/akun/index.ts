"use server"
import { createAccountWithClerk, deleteAccount, suspendAccount, activateAccount } from "@/services/accountServices";
import { revalidatePath } from "next/cache";


export async function createAction(formData: FormData) {
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const fullName = String(formData.get("fullName") || "");
    const company = String(formData.get("company") || "");
    const position = String(formData.get("position") || "");
    const phoneNumber = String(formData.get("phoneNumber") || "");
    const address = String(formData.get("address") || "");
    const role = String(formData.get("role") || "VIEWER") as any;
    const status = String(formData.get("status") || "ACTIVE") as any;

    if (!email || !password || !fullName) {
        return {
            ok: false,
            message: "Email, Password, dan Full Name wajib diisi.",
        };
    }

    try {
        await createAccountWithClerk({ email, password, fullName, company, position, phoneNumber, address, role, status });
        return { ok: true, message: "Akun berhasil dibuat." };
    } catch (e: any) {
        return { ok: false, message: e?.message || "Gagal membuat akun." };
    }
}

export async function deleteAction(id: number) {
    await deleteAccount(id, { alsoDeleteClerk: true });
    revalidatePath("/admin/akun");
}

export async function suspendAction(id: number) {
    await suspendAccount(id);
    revalidatePath("/admin/akun");
}

export async function activateAction(id: number) {
    await activateAccount(id);
    revalidatePath("/admin/akun");
}