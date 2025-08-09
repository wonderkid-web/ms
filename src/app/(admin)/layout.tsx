import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* New simple aside sidebar */}
      <aside className="w-64 bg-emerald-500 text-white p-4">
        {/* Administrator Section */}
        <div className="mb-4 flex flex-col gap-2 items-center">
          <h2 className="text-xl font-bold">Administrator</h2>
          <div className="flex items-center mt-2">
            <img src="/placeholder-user.jpg" alt="User" className="w-10 h-10 rounded-full mr-2" />
          </div>
            <div>
              <p className="font-semibold">User Name</p>
              <Link href="/auth/logout" className="text-sm hover:text-blue-300">Logout</Link>
            </div>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul>
            <li className="mb-2">
              <span className="font-semibold">Transaction</span>
              <ul className="ml-4 mt-2">
                <li className="mb-2">
                  <Link href="/admin/transaction" className="hover:text-blue-300">Transaction</Link>
                </li>
                <li className="mb-2">
                  <Link href="/admin/trace" className="hover:text-blue-300">Trace</Link>
                </li>
                <li className="mb-2">
                  <Link href="/admin/declaration" className="hover:text-blue-300">Declaration</Link>
                </li>
              </ul>
            </li>
            <li className="mb-2">
              <span className="font-semibold">Report</span>
              <ul className="ml-4 mt-2">
                <li className="mb-2">
                  <Link href="/admin/report/summary-cpo-pk" className="hover:text-blue-300">Summary CPO & PK</Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col">{children}</main>
    </div>
  );
}
