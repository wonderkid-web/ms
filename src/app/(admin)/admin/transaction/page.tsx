"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Select from "react-select";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  getDeclarations,
  deleteDeclaration,
} from "@/services/declarationServices";
// services filter
import { getProductGroups } from "@/services/productGroupService";
import { getGroups } from "@/services/groupServices";
import { getSuppliers } from "@/services/supplierServices";
import { getFactories } from "@/services/factoryService";

// lucide-react icons
import {
  Filter,
  Package,
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
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { useSessionList } from "@clerk/nextjs";

/* ---------- Types ---------- */
type OptionType = { value: string; label: string };

type MiniRef = { id: number; name: string } | null | undefined;

type DeclarationRow = {
  id: number;
  produk: MiniRef;
  group: MiniRef;
  supplier?: MiniRef;
  factory: MiniRef;
  alamatPabrik: string;
  kapasitas: string;
  sertifikasi: string | null; // comma-separated
  totalPersenTtp: number;
  periodeDari: string | Date;
  periodeSampai: string | Date;
  tanggalPengisian: string | Date;
  diisiOleh: string;
};

/* ---------- Helpers & styles ---------- */
function formatDate(value: unknown) {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value as any);
  if (isNaN(d.getTime())) return "-";
  return d.toISOString().slice(0, 10);
}

const nf = new Intl.NumberFormat("id-ID");

const selectStyles = {
  control: (b: any) => ({
    ...b,
    minHeight: 40,
    borderRadius: 8,
    borderColor: "hsl(var(--input))",
    background: "hsl(var(--background))",
    fontSize: "14px",
  }),
  valueContainer: (b: any) => ({ ...b, padding: "6px 10px" }),
  option: (b: any, s: any) => ({
    ...b,
    padding: "8px 10px",
    fontSize: "14px",
    backgroundColor: s.isFocused
      ? "rgba(4,120,87,0.12)"
      : s.isSelected
      ? "rgba(4,120,87,0.22)"
      : undefined,
    color: "inherit",
  }),
  menu: (b: any) => ({ ...b, zIndex: 50 }),
  placeholder: (b: any) => ({ ...b, color: "hsl(var(--muted-foreground))" }),
};
const selectTheme = (theme: any) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: "#047857",
    primary25: "rgba(4,120,87,0.12)",
    primary50: "rgba(4,120,87,0.22)",
    neutral80: "#0a0a0a",
  },
});

// Small UI bits
function PeriodBadge({ from, to }: { from: unknown; to: unknown }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800 text-xs font-medium whitespace-nowrap">
      <CalendarRange className="h-3.5 w-3.5" />
      {formatDate(from)} – {formatDate(to)}
    </span>
  );
}

function CapacityChip({ val }: { val: string }) {
  const num = Number(val);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200">
      <Gauge className="h-3.5 w-3.5" />
      {isNaN(num) ? val : `${nf.format(num)} ton/tahun`}
    </span>
  );
}

function CertBadge({ name }: { name: string }) {
  const key = name.trim().toUpperCase();
  const palette: Record<string, string> = {
    ISPO: "bg-emerald-50 text-emerald-800 border-emerald-200",
    RSPO: "bg-amber-50 text-amber-800 border-amber-200",
    ISCC: "bg-sky-50 text-sky-800 border-sky-200",
  };
  const cl = palette[key] ?? "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${cl}`}
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      {key}
    </span>
  );
}

function TtpBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const color =
    pct >= 80
      ? "bg-emerald-600"
      : pct >= 60
      ? "bg-emerald-500"
      : pct >= 40
      ? "bg-amber-500"
      : "bg-red-500";
  return (
    <div className="min-w-[160px]">
      <div className="mb-1 flex items-center gap-1.5 text-sm text-foreground">
        <Percent className="h-4 w-4 text-emerald-700" />
        <span className="font-medium">{pct.toFixed(2)}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-emerald-100">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ---------- Component ---------- */
export default function DeclarationTable() {
  const [data, setData] = useState<DeclarationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // filter states
  const [produkOptions, setProdukOptions] = useState<OptionType[]>([]);
  const [groupOptions, setGroupOptions] = useState<OptionType[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<OptionType[]>([]);
  const [factoryOptions, setFactoryOptions] = useState<OptionType[]>([]);

  const [fProduk, setFProduk] = useState<OptionType | null>(null);
  const [fGroup, setFGroup] = useState<OptionType | null>(null);
  const [fSupplier, setFSupplier] = useState<OptionType | null>(null);
  const [fFactory, setFFactory] = useState<OptionType | null>(null);

  const mapToOptions = (rows: { id: number; name: string }[]) =>
    rows.map((r) => ({ value: String(r.id), label: r.name }));

  // async function loadOptions() {
  //   try {
  //     const [prods, groups, sups, facts] = await Promise.all([
  //       getProductGroups(),
  //       getGroups(),
  //       getSuppliers(),
  //       getFactories(),
  //     ]);
  //     setProdukOptions(mapToOptions(prods));
  //     setGroupOptions(mapToOptions(groups));
  //     setSupplierOptions(mapToOptions(sups));
  //     setFactoryOptions(mapToOptions(facts));
  //   } catch (e) {
  //     console.error(e);
  //     toast.error("Gagal memuat opsi filter");
  //   }
  // }

  async function loadData() {
    try {
      setLoading(true);
      const res = await getDeclarations();
      setData(res as DeclarationRow[]);
    } catch (e) {
      console.error(e);
      toast.error("Gagal memuat data Declaration");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const p1 = getProductGroups()
      .then((d) => !cancelled && setProdukOptions(mapToOptions(d)))
      .catch(() => toast.error("Gagal memuat produk"));

    const p2 = getGroups()
      .then((d) => !cancelled && setGroupOptions(mapToOptions(d)))
      .catch(() => toast.error("Gagal memuat group"));

    const p3 = getSuppliers()
      .then((d) => !cancelled && setSupplierOptions(mapToOptions(d)))
      .catch(() => toast.error("Gagal memuat supplier"));

    const p4 = getFactories()
      .then((d) => !cancelled && setFactoryOptions(mapToOptions(d)))
      .catch(() => toast.error("Gagal memuat pabrik"));

    // opsional: supaya error nggak nge-crash effect
    Promise.allSettled([p1, p2, p3, p4]);

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return data.filter((d) => {
      if (fProduk && String(d.produk?.id) !== fProduk.value) return false;
      if (fGroup && String(d.group?.id) !== fGroup.value) return false;
      if (fSupplier && String(d.supplier?.id) !== fSupplier.value) return false;
      if (fFactory && String(d.factory?.id) !== fFactory.value) return false;

      if (!s) return true;
      const buckets = [
        d.produk?.name,
        d.group?.name,
        d.supplier?.name,
        d.factory?.name,
        d.alamatPabrik,
        d.kapasitas,
        d.sertifikasi,
        d.diisiOleh,
        formatDate(d.periodeDari),
        formatDate(d.periodeSampai),
        formatDate(d.tanggalPengisian),
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());
      return buckets.some((v) => v.includes(s));
    });
  }, [data, q, fProduk, fGroup, fSupplier, fFactory]);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus declaration ini?")) return;
    try {
      await deleteDeclaration(id);
      toast.success("Declaration berhasil dihapus");
      loadData();
    } catch (e) {
      console.error(e);
      toast.error("Gagal menghapus Declaration");
    }
  };

  /* ---------- Columns (tanpa kolom filter) ---------- */
  const columns: ColumnDef<DeclarationRow>[] = [
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
            onClick={() => toast("Edit belum diimplementasi")}
            className="inline-flex items-center gap-1.5 border border-emerald-500 text-emerald-700 px-3 py-1 rounded hover:bg-emerald-50 whitespace-nowrap"
          >
            <Edit2 className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="inline-flex items-center gap-1.5 border border-red-500 text-red-600 px-3 py-1 rounded hover:bg-red-50 whitespace-nowrap"
          >
            <Trash2 className="h-4 w-4" /> Hapus
          </button>
        </div>
      ),
      meta: {
        headerClassName: "min-w-[200px] text-center",
        cellClassName: "min-w-[200px]",
      },
    },
  ];

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const clearFilters = () => {
    setFProduk(null);
    setFGroup(null);
    setFSupplier(null);
    setFFactory(null);
    setQ("");
  };

  const session = useSessionList();

  return (
    <div className="p-5">
      {/* Filter Bar */}
      <h1 className="text-2xl font-semibold mb-2 text-emerald-800">
        Table Transaction
      </h1>
      <div className="mb-4 space-y-3 rounded-sm border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-emerald-800">
          <Filter className="h-4 w-4" />
          <span className="font-semibold">Filter</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Package className="h-3.5 w-3.5 text-emerald-700" />
              <span>Produk</span>
            </div>
            <Select<OptionType, false>
              value={fProduk}
              onChange={setFProduk}
              options={produkOptions}
              isClearable
              placeholder="Semua produk"
              styles={selectStyles}
              theme={selectTheme}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-emerald-700" />
              <span>Group</span>
            </div>
            <Select<OptionType, false>
              value={fGroup}
              onChange={setFGroup}
              options={groupOptions}
              isClearable
              placeholder="Semua group"
              styles={selectStyles}
              theme={selectTheme}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Truck className="h-3.5 w-3.5 text-emerald-700" />
              <span>Supplier</span>
            </div>
            <Select<OptionType, false>
              value={fSupplier}
              onChange={setFSupplier}
              options={supplierOptions}
              isClearable
              placeholder="Semua supplier"
              styles={selectStyles}
              theme={selectTheme}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FactoryIcon className="h-3.5 w-3.5 text-emerald-700" />
              <span>Pabrik</span>
            </div>
            <Select<OptionType, false>
              value={fFactory}
              onChange={setFFactory}
              options={factoryOptions}
              isClearable
              placeholder="Semua pabrik"
              styles={selectStyles}
              theme={selectTheme}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-700" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari alamat, kapasitas, sertifikasi, dll…"
                className="w-[280px] pl-8 focus:ring-emerald-400"
              />
            </div>
            <Button
              variant="outline"
              onClick={loadData}
              className="inline-flex items-center gap-1.5 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
            >
              <RefreshCw className="h-4 w-4" />
              Reload
            </Button>
          </div>
          <Button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800"
          >
            <XCircle className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      <Separator className="mb-3" />

      {/* Table */}
      <div className="overflow-x-auto rounded-sm border bg-white shadow-sm">
        <table className="min-w-[1600px] w-full border-collapse">
          <thead className="bg-emerald-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`border-b p-3 text-left font-semibold text-emerald-800 whitespace-nowrap ${
                      // @ts-expect-error its okay
                      header.column.columnDef.meta?.headerClassName ?? ""
                    }`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  Loading…
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-emerald-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`border-b p-3 align-top whitespace-nowrap ${
                        // @ts-expect-error its okay
                        cell.column.columnDef.meta?.cellClassName ?? ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-muted-foreground"
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
          >
            Prev
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
          >
            Next
          </Button>
          <div className="ml-3 flex items-center gap-2">
            <label className="text-sm">Rows</label>
            <select
              className="rounded border px-2 py-1"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
