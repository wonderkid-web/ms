"use client";
import * as React from "react";
import QuisionerCard from "./QuisionerCard";
import { LoadingQuisioner } from "@/components/loader/index";
import Loading from "@/components/Loader";

// Placeholder list page. Integrasikan dengan DB/Fetch API sesuai kebutuhan.
export default function QuisionerListPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false)

  const fetchQuisioner = async () => {
    const raw = await fetch("/api/quisioner")
    const { data } = await raw.json()
    console.log(data)
    setItems(data)

  }

  React.useEffect(() => {
    setLoading(true)
    fetchQuisioner()
    setLoading(false)
  }, []);




  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Quisioner</h1>
      </div>

      {

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => <QuisionerCard key={i} quisioner={it} />)}
        </div>

      }
    </div>
  );
}