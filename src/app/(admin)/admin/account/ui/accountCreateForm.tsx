// src/app/(admin)/admin/account/ui/AccountCreateForm.tsx
"use client";

import { useTransition, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  action: (fd: FormData) => Promise<{ ok: boolean; message: string }>;
};

export default function AccountCreateForm({ action }: Props) {
  const [pending, startTransition] = useTransition();
  const [role, setRole] = useState("VIEWER");
  const [status, setStatus] = useState("ACTIVE");

  return (
    <form
      id="acc-form"
      className="space-y-3"
      action={(fd) => {
        startTransition(async () => {
          const res = await action(fd);
          if (res.ok) {
            toast.success(res.message);
            (document.getElementById("acc-form") as HTMLFormElement)?.reset();
            setRole("VIEWER");
            setStatus("ACTIVE");
          } else {
            toast.error(res.message);
          }
        });
      }}
    >
      <div>
        <label className="text-sm font-medium">Full Name</label>
        <Input name="fullName" placeholder="Budi Santoso" required />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          name="email"
          type="email"
          placeholder="user@example.com"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Password</label>
        <Input
          name="password"
          type="password"
          placeholder="PasswordKuat123!"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            name="role"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="STAFF">STAFF</option>
            <option value="VIEWER">VIEWER</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            name="status"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INVITED">INVITED</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            (document.getElementById("acc-form") as HTMLFormElement)?.reset()
          }
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="bg-emerald-700 hover:bg-emerald-800"
          disabled={pending}
        >
          {pending ? "Menyimpan…" : "Buat Akun"}
        </Button>
      </div>
    </form>
  );
}
