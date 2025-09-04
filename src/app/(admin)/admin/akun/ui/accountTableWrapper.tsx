"use client";

import { useRouter } from "next/navigation";
import AccountTable from "./accountTable";
import { deleteAction, suspendAction, activateAction } from "../action/akun";

interface Props {
  initialRows: any[];
}

export default function AccountTableWrapper({ initialRows }: Props) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    await deleteAction(id);
    router.refresh();
  };

  const handleSuspend = async (id: number) => {
    await suspendAction(id);
    router.refresh();
  };

  const handleActivate = async (id: number) => {
    await activateAction(id);
    router.refresh();
  };

  return (
    <AccountTable
      initialRows={initialRows}
      onDelete={handleDelete}
      onSuspend={handleSuspend}
      onActivate={handleActivate}
    />
  );
}
