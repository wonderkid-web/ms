"use client";
import * as React from "react";
import QuisionerCard from "./QuisionerCard";

// Placeholder list page. Integrasikan dengan DB/Fetch API sesuai kebutuhan.
export default function QuisionerListPage() {
  const [items, setItems] = React.useState<any[]>([]);

  const fetchQuisioner = async () => {
    const raw = await fetch("/api/quisioner")
    const {data} = await raw.json()
    console.log(data)
    setItems(data)

  }

  React.useEffect(() => {
    fetchQuisioner()
  }, []);
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Quisioner</h1>
      </div>

      {
        items?.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => <QuisionerCard key={i} quisioner={it} />)}
          </div>
        )
      }
    </div>
  );
}