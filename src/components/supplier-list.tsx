"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type SupplierRow = {
  id: string
  name: string
  location: string | null
  certification: string | null
  _count?: { products: number }
}

export default function SupplierList({ initialSuppliers = [] as SupplierRow[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return initialSuppliers
    return initialSuppliers.filter((s) => {
      return (
        s.name.toLowerCase().includes(q) ||
        (s.location ?? "").toLowerCase().includes(q) ||
        (s.certification ?? "").toLowerCase().includes(q)
      )
    })
  }, [initialSuppliers, query])

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4">
          <Input
            placeholder="Cari supplier..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cari supplier"
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Nama"}</TableHead>
                <TableHead className="hidden md:table-cell">{"Lokasi"}</TableHead>
                <TableHead className="hidden md:table-cell">{"Sertifikasi"}</TableHead>
                <TableHead className="text-right">{"Jumlah Produk"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                    {"Tidak ada hasil."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">
                      <Link href={`/suppliers/${s.id}`} className="text-emerald-700 underline underline-offset-4">
                        {s.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{s.location ?? "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {s.certification ? (
                        <Badge variant="secondary" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                          {s.certification}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">{s._count?.products ?? 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
