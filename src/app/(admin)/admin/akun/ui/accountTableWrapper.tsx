// akun/ui/accountTableWrapper.tsx
"use client";

import { useState, useEffect } from "react";
import AccountTable from "./accountTable";
import { deleteAction, suspendAction, activateAction } from "../action/akun";
import toast from "react-hot-toast";

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

export default function AccountTableWrapper({ initialRows }: { initialRows: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initialRows);

  // Sync state dengan prop dari server
  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const mutate = async (fn: () => Promise<void>, onDone: () => void) => {
    try {
      await fn();
      onDone();
    } catch (e) {
      console.error(e);
      toast.error('Aksi gagal.');
    }
  };

  const handleDelete = (id: number) => {
    // Optimistic update di UI
    setRows(prevRows => prevRows.filter(r => r.id !== id));
    mutate(() => deleteAction(id), () => {
      toast.success("Berhasil menghapus akun.🗑️")
      // Revert if action fails (optional, but good practice)
      // Or just router.refresh() to be safe
    });
  };

  const handleSuspend = (id: number) => {
    setRows(prevRows => prevRows.map(r => r.id === id ? { ...r, status: 'SUSPENDED' } : r));
    mutate(() => suspendAction(id), () => {
      toast.success("Berhasil menonaktifkan akun.")
    });
  };

  const handleActivate = (id: number) => {
    setRows(prevRows => prevRows.map(r => r.id === id ? { ...r, status: 'ACTIVE' } : r));
    mutate(() => activateAction(id), () => {
      toast.success("Berhasil mengaktifkan akun.")
    });
  };

  return (
    <AccountTable
      rows={rows}
      onDelete={handleDelete}
      onSuspend={handleSuspend}
      onActivate={handleActivate}
    />
  );
}