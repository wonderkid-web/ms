// src/app/(admin)/admin/account/ui/AccountTable.tsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { toWaLink } from '@/helper';
import Link from 'next/link';
import { UserIcon } from 'lucide-react';

type Row = {
  id: number;
  email: string;
  fullName: string;
  company: string;
  position: string;
  phoneNumber: string;
  address: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'VIEWER';
  status: 'INVITED' | 'ACTIVE' | 'SUSPENDED';
  createdAt: string | Date;
};

export default function AccountTable({
  initialRows,
  onDelete,
  onSuspend,
  onActivate,
}: {
  initialRows: Row[];
  onDelete: (id: number) => Promise<void>;
  onSuspend: (id: number) => Promise<void>;
  onActivate: (id: number) => Promise<void>;
}) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  


  const mutate = async (fn: () => Promise<void>, onDone: () => void) => {
    try {
      await fn();
      onDone();
    } catch (e) {
      console.error(e);
      toast.error('Aksi gagal.');
    }
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full table-auto border-collapse text-sm">
        <thead className="bg-emerald-50">
          <tr className="text-emerald-900">
            <th className="border-b p-2 text-left font-semibold whitespace-nowrap">Email</th>
            <th className="border-b p-2 text-left font-semibold whitespace-nowrap">Nama</th>
            <th className="border-b p-2 text-left font-semibold whitespace-nowrap">Company</th>
            <th className="border-b p-2 text-left font-semibold whitespace-nowrap">Position</th>
            <th className="border-b p-2 text-left font-semibold whitespace-nowrap">Phone</th>
            <th className="border-b p-2 text-left font-semibold whitespace-nowrap">Address</th>
            <th className="border-b p-2 text-left font-semibold whitespace-nowrap">Role</th>
            <th className="border-b p-2 text-left font-semibold whitespace-nowrap">Status</th>
            {/* <th className="border-b p-2 text-left font-semibold whitespace-nowrap">Created At</th> */}
            <th className="border-b p-2 text-left font-semibold whitespace-nowrap">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {rows.length ? (
            rows.map((r) => (
              <tr key={r.id} className="hover:bg-emerald-50/40 align-middle">
                <td className="border-b p-2 whitespace-nowrap max-w-[240px] truncate flex relative top-3 gap-2 items-center"><UserIcon className='text-emerald-600 w-5 h-5' />{r.email}</td>
                <td className="border-b p-2 whitespace-nowrap max-w-[200px] truncate">{r.fullName}</td>
                <td className="border-b p-2 whitespace-nowrap max-w-[200px] truncate">{r.company}</td>
                <td className="border-b p-2 whitespace-nowrap max-w-[200px] truncate">{r.position}</td>
                <td className="border-b p-2 whitespace-nowrap">
                  <Link
                    href={toWaLink(r.phoneNumber, `Halo ${r.fullName}, saya dari ${r.company}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-4"
                    title="Chat via WhatsApp"
                  >
                    {r.phoneNumber}
                  </Link>
                </td>
                <td className="border-b p-2 whitespace-nowrap max-w-[260px] truncate">{r.address}</td>

                <td className="border-b p-2 whitespace-nowrap">
                  <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                    {r.role}
                  </span>
                </td>

                <td className="border-b p-2 whitespace-nowrap">
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${r.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : r.status === 'INVITED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {r.status}
                  </span>
                </td>

                {/* <td className="border-b p-2 whitespace-nowrap text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td> */}

                <td className="border-b p-2">
                  <div className="flex flex-nowrap items-center gap-1">
                    {r.status !== 'ACTIVE' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-emerald-500 px-2 text-emerald-700 hover:bg-emerald-50"
                        onClick={() =>
                          mutate(() => onActivate(r.id), () =>
                            setRows((prev) =>
                              prev.map((x) => (x.id === r.id ? { ...x, status: 'ACTIVE' } : x))
                            )
                          )
                        }
                      >
                        Activate
                      </Button>
                    )}
                    {r.status === 'ACTIVE' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-amber-500 px-2 text-amber-700 hover:bg-amber-50"
                        onClick={() =>
                          mutate(() => onSuspend(r.id), () =>
                            setRows((prev) =>
                              prev.map((x) => (x.id === r.id ? { ...x, status: 'SUSPENDED' } : x))
                            )
                          )
                        }
                      >
                        Suspend
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-red-500 px-2 text-red-600 hover:bg-red-50"
                      onClick={() =>
                        mutate(
                          async () => {
                            if (confirm('Hapus akun ini?')) await onDelete(r.id);
                          },
                          () => setRows((prev) => prev.filter((x) => x.id !== r.id))
                        )
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-4 text-center text-muted-foreground" colSpan={10}>
                Belum ada akun.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function useEffect(arg0: () => void, arg1: Row[][]) {
  throw new Error('Function not implemented.');
}

