"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusSquare } from "lucide-react";

// Placeholder list page. Integrasikan dengan DB/Fetch API sesuai kebutuhan.
export default function QuisionerListPage() {
  const [items, setItems] = React.useState<any[]>([]);

  const fetchQuisioner = async () => {
    const raw = await fetch("/api/quisioner")
    const { data } = await raw.json()
    
    setItems(data)

  }

  React.useEffect(() => {
    fetchQuisioner()
  }, []);
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Quisioner</h1>
        <Button
          variant="outline"
          className="text-white border-green-600 mb-3 bg-green-600 hover:bg-green-700 flex gap-2 ml-auto"
          // onClick={openModal}
          asChild
        >
          <Link href="/admin/quisioner/create"
          className="flex gap-2"
          >
          <PlusSquare />
          Create</Link>
        </Button>

      </div>

      <Card>
        <CardHeader><CardTitle>Data</CardTitle></CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada data. Klik "Create" untuk menambah.</p>
          ) : (
            <ul className="list-disc pl-6">
              {items.map((it, i) => <li key={i}>
                <Link href={`/admin/quisioner/${it.id}`}>{it.title}</Link>
              </li>)}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
