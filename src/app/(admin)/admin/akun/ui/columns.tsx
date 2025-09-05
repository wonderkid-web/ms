'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Account } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { LockKeyholeIcon, Trash, UnlockKeyholeIcon } from "lucide-react"

import { ColumnDef } from "@tanstack/react-table"
import { Account } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { LockKeyholeIcon, Trash, UnlockKeyholeIcon } from "lucide-react"

export const columns = (onSuspend: (id: number) => void, onDelete: (id: number) => void): ColumnDef<Account>[] => [
  {
    id: "no",
    header: "No.",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const account = row.original

      return (
        <div className="flex flex-nowrap items-center gap-1 transition">
          {account.status !== 'ACTIVE' && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-emerald-500 px-2 text-emerald-700 hover:bg-emerald-50"
            >
              <LockKeyholeIcon />
            </Button>
          )}
          {account.status === 'ACTIVE' && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-amber-500 px-2 text-amber-700 hover:bg-amber-50"
              onClick={() => onSuspend(account.id)}
            >
              <UnlockKeyholeIcon />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-red-500 px-2 text-red-600 hover:bg-red-50"
            onClick={() => onDelete(account.id)}
          >
            <Trash />
          </Button>
        </div>
      )
    },
  },
]
