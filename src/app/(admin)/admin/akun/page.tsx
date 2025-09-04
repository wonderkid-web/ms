import { listAccounts } from "@/services/accountServices";
import AccountTableWrapper from "./ui/accountTableWrapper"; // Client wrapper
import AccountCreateFormWrapper from "./ui/accountCreateFormWrapper"; // Client wrapper

export default async function Page() {
  const { rows } = await listAccounts({ pageSize: 200 });

  return (
    <main className="p-6 space-y-6">
      <div className="rounded-sm border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-900">Kelola Akun</h1>
        <p className="text-sm text-muted-foreground">
          Admin membuat akun user (email + password), tanpa sign-up publik.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-sm border bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-emerald-900">
            Daftar Akun
          </h2>

          {/* Modal + Form */}
          <AccountCreateFormWrapper />

          {/* Table */}
          <AccountTableWrapper initialRows={rows} />
        </div>
      </div>
    </main>
  );
}
