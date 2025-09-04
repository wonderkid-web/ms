import AccountTableWrapper from "./ui/accountTableWrapper"; // Client wrapper
import AccountCreateFormWrapper from "./ui/accountCreateFormWrapper"; // Client wrapper
import { listAccounts } from "@/services/accountServices";


export default async function Page() {
  const { rows } = await listAccounts({ pageSize: 200 });
  console.log(rows)

  return (
    <main className="p-6 space-y-6">
      <div className="rounded-sm border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-900">Kelola Akun</h1>
        <p className="text-sm text-muted-foreground">
          Admin membuat akun user (email + password), tanpa sign-up publik.
        </p>
      </div>


      <div className="rounded-sm border bg-white p-5 shadow-sm grid">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-emerald-900">
            Daftar Akun
          </h2>
          <AccountCreateFormWrapper />
        </div>


        {/* Table */}
        <AccountTableWrapper initialRows={rows} />
      </div>

    </main>
  );
}
