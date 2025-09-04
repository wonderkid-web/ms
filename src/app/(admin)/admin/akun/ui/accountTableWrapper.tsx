"use client";

import { useState } from "react";
import AccountTable from "./accountTable";
import { deleteAction, suspendAction, activateAction} from "../action/akun"

interface Props {
  initialRows: any[];
}

export default function AccountTableWrapper({ initialRows }: Props) {
  const [rows, setRows] = useState(initialRows);

  const handleDelete = async (id: number) => {
    await deleteAction(id);
    setRows(rows.filter(r => r.id !== id));
  };

  const handleSuspend = async (id: number) => {
    await suspendAction(id);
    // refresh
    // bisa re-fetch atau update state sesuai kebutuhan
  };

  const handleActivate = async (id: number) => {
    await activateAction(id);
    // refresh
  };

  return (
    <AccountTable
      initialRows={rows}
      onDelete={handleDelete}
      onSuspend={handleSuspend}
      onActivate={handleActivate}
    />
  );
}
