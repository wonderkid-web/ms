// src/app/(admin)/admin/account/ui/AccountTable.tsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

type Row = {
  id: number;
  email: string;
  fullName: string;
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
      <table className="min-w-[900px] w-full border-collapse">
        <thead className="bg-emerald-50">
          <tr>
            <th className="border-b p-3 text-left text-emerald-900 font-semibold">Email</th>
            <th className="border-b p-3 text-left text-emerald-900 font-semibold">Nama</th>
            <th className="border-b p-3 text-left text-emerald-900 font-semibold">Role</th>
            <th className="border-b p-3 text-left text-emerald-900 font-semibold">Status</th>
            <th className="border-b p-3 text-left text-emerald-900 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map(r => (
              <tr key={r.id} className="hover:bg-emerald-50/40">
                <td className="border-b p-3">{r.email}</td>
                <td className="border-b p-3">{r.fullName}</td>
                <td className="border-b p-3">
                  <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                    {r.role}
                  </span>
                </td>
                <td className="border-b p-3">
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${
                    r.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800'
                    : r.status === 'INVITED' ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-700'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="border-b p-3">
                  <div className="flex gap-2">
                    {r.status !== 'ACTIVE' && (
                      <Button
                        variant="outline"
                        className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                        onClick={() =>
                          mutate(() => onActivate(r.id), () =>
                            setRows(prev => prev.map(x => x.id === r.id ? { ...x, status: 'ACTIVE' } : x))
                          )
                        }
                      >
                        Activate
                      </Button>
                    )}
                    {r.status === 'ACTIVE' && (
                      <Button
                        variant="outline"
                        className="border-amber-500 text-amber-700 hover:bg-amber-50"
                        onClick={() =>
                          mutate(() => onSuspend(r.id), () =>
                            setRows(prev => prev.map(x => x.id === r.id ? { ...x, status: 'SUSPENDED' } : x))
                          )
                        }
                      >
                        Suspend
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      onClick={() =>
                        mutate(async () => { if (confirm('Hapus akun ini?')) await onDelete(r.id) }, () =>
                          setRows(prev => prev.filter(x => x.id !== r.id))
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
            <tr><td className="p-4 text-center text-muted-foreground" colSpan={5}>Belum ada akun.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
