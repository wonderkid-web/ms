
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Truck,
  Factory as FactoryIcon,
  CalendarRange,
  ShieldCheck,
  Gauge,
  MapPin,
  Percent,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { DeclarationRow } from "./types";
import { formatDate, PeriodBadge, CapacityChip, CertBadge, TtpBar } from "./utils";
import toast from "react-hot-toast";

export const columns: (handleDelete: (id: number) => void, loadDetails: (id: number) => Promise<any>) => ColumnDef<DeclarationRow>[] = (handleDelete, loadDetails) => [
    {
      id: "expander",
      header: "",
      cell: ({ row }) => {
        const isOpen = row.getIsExpanded();
        return (
          <button
            type="button"
            onClick={async () => {
              const next = !isOpen;
              row.toggleExpanded(next);
              if (next) {
                const data = await loadDetails(row.original.id);
                console.log(data);
              }
            }}
            className="rounded p-1 hover:bg-emerald-100"
            aria-label={isOpen ? "Collapse" : "Expand"}
            title={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-emerald-700" />
            ) : (
              <ChevronRight className="h-4 w-4 text-emerald-700" />
            )}
          </button>
        );
      },
      meta: { headerClassName: "w-[44px]", cellClassName: "w-[44px]" },
    },
    {
      id: "id",
      header: () => (
        <div className="inline-flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-700" />
          <span>ID</span>
        </div>
      ),
      cell: ({ row }) => row.original.id,
      meta: { headerClassName: "min-w-[90px]", cellClassName: "min-w-[90px]" },
    },
    {
      id: "alamatPabrik",
      header: () => (
        <div className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-700" />
          <span>Alamat Pabrik</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-700" />
          <span>{row.original.alamatPabrik}</span>
        </div>
      ),
      meta: {
        headerClassName: "min-w-[460px]",
        cellClassName: "min-w-[460px]",
      },
    },
    {
      id: "kapasitas",
      header: () => (
        <div className="inline-flex items-center gap-2">
          <Gauge className="h-4 w-4 text-emerald-700" />
          <span>Kapasitas</span>
        </div>
      ),
      cell: ({ row }) => <CapacityChip val={row.original.kapasitas} />,
      meta: {
        headerClassName: "min-w-[200px]",
        cellClassName: "min-w-[200px]",
      },
    },
    {
      id: "sertifikasi",
      header: () => (
        <div className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          <span>Sertifikasi</span>
        </div>
      ),
      cell: ({ row }) => {
        const arr = (row.original.sertifikasi ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (!arr.length)
          return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex flex-wrap gap-1.5">
            {arr.map((s, i) => (
              <CertBadge key={i} name={s} />
            ))}
          </div>
        );
      },
      meta: {
        headerClassName: "min-w-[260px]",
        cellClassName: "min-w-[260px]",
      },
    },
    {
      id: "periode",
      header: () => (
        <div className="inline-flex items-center gap-2">
          <CalendarRange className="h-4 w-4 text-emerald-700" />
          <span>Periode</span>
        </div>
      ),
      cell: ({ row }) => (
        <PeriodBadge
          from={row.original.periodeDari}
          to={row.original.periodeSampai}
        />
      ),
      meta: {
        headerClassName: "min-w-[260px]",
        cellClassName: "min-w-[260px]",
      },
    },
    {
      id: "ttp",
      header: () => (
        <div className="inline-flex items-center gap-2">
          <Percent className="h-4 w-4 text-emerald-700" />
          <span>Total % TTP</span>
        </div>
      ),
      cell: ({ row }) => <TtpBar value={row.original.totalPersenTtp} />,
      meta: {
        headerClassName: "min-w-[220px]",
        cellClassName: "min-w-[220px]",
      },
    },
    {
      id: "tanggalPengisian",
      header: "Tanggal Pengisian",
      cell: ({ row }) => formatDate(row.original.tanggalPengisian),
      meta: {
        headerClassName: "min-w-[200px]",
        cellClassName: "min-w-[200px]",
      },
    },
    {
      id: "diisiOleh",
      header: "Diisi Oleh",
      cell: ({ row }) => row.original.diisiOleh,
      meta: {
        headerClassName: "min-w-[200px]",
        cellClassName: "min-w-[200px]",
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toast("Edit belum diimplementasi")}
            className="inline-flex items-center gap-1.5 border border-emerald-500 text-emerald-700 px-3 py-1 rounded hover:bg-emerald-50"
          >
            <Edit2 className="h-4 w-4" /> Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.original.id)}
            className="inline-flex items-center gap-1.5 border border-red-500 text-red-600 px-3 py-1 rounded hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Hapus
          </button>
        </div>
      ),
      meta: {
        headerClassName: "min-w-[200px]",
        cellClassName: "min-w-[200px]",
      },
    },
  ];
