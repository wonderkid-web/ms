import AccountTableWrapper from "./ui/accountTableWrapper"; // Client wrapper
import { listAccounts } from "@/services/accountServices";


export default async function Page() {
  const { rows } = await listAccounts({ pageSize: 200 });

  return (
    <main className="p-6 space-y-6">
      <div className="rounded-sm border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-900">Manage Accounts</h1>
        <p className="text-sm text-muted-foreground">
          Admin creates user accounts (email + password), without public sign-up.
        </p>
      </div>


      <div className="rounded-sm border bg-white p-5 shadow-sm grid">
        {/* Table */}
        <AccountTableWrapper initialRows={rows} />
      </div>

    </main>
  );
}
