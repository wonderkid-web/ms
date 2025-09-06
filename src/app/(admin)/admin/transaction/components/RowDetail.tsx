
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { type DeclarationDetail } from "@/services/declarationServices";
import { nf } from "./utils";

/* ---------- Sub-table Detail ---------- */
export function RowDetail({
  id,
  cache,
  load,
}: {
  id: number;
  cache?: {
    loading: boolean;
    items: DeclarationDetail[] | null;
    error?: string;
  };
  load: (id: number) => void;
}) {
  // Failsafe: kalau belum ada cache untuk id ini, minta load
  useEffect(() => {
    if (!cache) load(id);
  }, [id, cache, load]);

  if (!cache || cache.loading)
    return (
      <div className="p-4 text-sm text-muted-foreground text-center">Memuat detail...⏳</div>
    );
  if (cache.error)
    return (
      <div className="p-4 text-sm text-red-600 flex items-center gap-3">
        {cache.error}
        <Button variant="outline" onClick={() => load(id)}>
          Coba lagi
        </Button>
      </div>
    );

  const items = cache.items ?? [];
  if (!items.length)
    return (
      <div className="p-4 text-sm text-muted-foreground">Tidak ada detail.</div>
    );

  return (
    <div className="p-3">
      <div className="overflow-x-auto rounded border">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-2">Nama Supplier</th>
              <th className="p-2">Jenis</th>
              <th className="p-2">Jumlah Petani</th>
              <th className="p-2">Alamat Kebun</th>
              <th className="p-2">Lat</th>
              <th className="p-2">Lon</th>
              <th className="p-2">Peta</th>
              <th className="p-2">Area (HA)</th>
              <th className="p-2">Legalitas</th>
              <th className="p-2">Persen</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.namaSupplier}</td>
                <td className="p-2">{d.jenisSupplier}</td>
                <td className="p-2">{d.jumlahPetani ?? "-"}</td>
                <td className="p-2">{d.alamatKebun ?? "-"}</td>
                <td className="p-2">{d.latitude ?? "-"}</td>
                <td className="p-2">{d.longitude ?? "-"}</td>
                <td className="p-2">{d.petaKebun ?? "-"}</td>
                <td className="p-2">
                  {d.areaHa != null ? nf.format(d.areaHa) : "-"}
                </td>
                <td className="p-2">{d.statusLegalitas ?? "-"}</td>
                <td className="p-2">{d.persentaseSuplai.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
