"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  useReactTable,
  ExpandedState,
} from "@tanstack/react-table";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import {
  getDeclarations,
  deleteDeclaration,
  getDeclarationDetails,
  type DeclarationDetail,
} from "@/services/declarationServices";
import { getProductGroups } from "@/services/productGroupService";
import { getGroups } from "@/services/groupServices";
import { getSuppliers } from "@/services/supplierServices";
import { getFactories } from "@/services/factoryService";
import { DeclarationRow, OptionType } from "./components/types";
import { columns as createColumns } from "./components/columns";
import { FilterBar } from "./components/FilterBar";
import { TransactionTable } from "./components/TransactionTable";
import { Pagination } from "./components/Pagination";
import { formatDate } from "./components/utils";

/* ---------- Main Component ---------- */
export default function DeclarationTable() {
  const [data, setData] = useState<DeclarationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // filters
  const [produkOptions, setProdukOptions] = useState<OptionType[]>([]);
  const [groupOptions, setGroupOptions] = useState<OptionType[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<OptionType[]>([]);
  const [factoryOptions, setFactoryOptions] = useState<OptionType[]>([]);
  const [fProduk, setFProduk] = useState<OptionType | null>(null);
  const [fGroup, setFGroup] = useState<OptionType | null>(null);
  const [fSupplier, setFSupplier] = useState<OptionType | null>(null);
  const [fFactory, setFFactory] = useState<OptionType | null>(null);

  // expand + cache detail
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [detailCache, setDetailCache] = useState<
    Record<
      number,
      { loading: boolean; items: DeclarationDetail[] | null; error?: string }
    >
  >({});

  // token untuk cegah race (StrictMode/double fetch)
  const reqTokens = useRef<Record<number, symbol | undefined>>({});

  const mapToOptions = (rows: { id: number; name: string }[]) =>
    rows.map((r) => ({ value: String(r.id), label: r.name }));

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

  // load options
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
    Promise.allSettled([p1, p2, p3, p4]);
    return () => {
      cancelled = true;
    };
  }, []);

  // filtered data
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
  // di atas component:
  const pendingRef = useRef<
    Record<number, Promise<DeclarationDetail[]> | undefined>
  >({});

  // ganti loadDetails lama dengan ini:
  const loadDetails = useCallback(
    (id: number): Promise<DeclarationDetail[]> => {
      const cached = detailCache[id];

      // sudah ada data -> langsung kembalikan
      if (cached?.items) return Promise.resolve(cached.items);

      // kalau lagi ada request berjalan untuk id ini -> tunggu yang itu
      if (pendingRef.current[id]) return pendingRef.current[id]!;

      // set loading ke cache
      setDetailCache((prev) => ({
        ...prev,
        [id]: { loading: true, items: null },
      }));

      // jalankan fetch asli (pakai service kamu, atau helper fetch ke API)
      const p = getDeclarationDetails(id)
        .then((items) => {
          setDetailCache((prev) => ({
            ...prev,
            [id]: { loading: false, items },
          }));
          return items; // <-- PENTING: return items
        })
        .catch((err) => {
          console.error("[loadDetails] error:", err);
          setDetailCache((prev) => ({
            ...prev,
            [id]: { loading: false, items: null, error: "Gagal memuat detail" },
          }));
          throw err; // biar caller tau gagal
        })
        .finally(() => {
          // bersihkan penanda pending
          if (pendingRef.current[id]) pendingRef.current[id] = undefined;
        });

      pendingRef.current[id] = p;
      return p; // <-- PENTING: kembalikan promise
    },
    [detailCache]
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus declaration ini?")) return;
    try {
      await deleteDeclaration(id);
      toast.success("Declaration berhasil dihapus");
      await loadData();
      setDetailCache((p) => {
        const c = { ...p };
        delete c[id];
        return c;
      });
    } catch (e) {
      console.error(e);
      toast.error("Gagal menghapus Declaration");
    }
  };

  const columns = useMemo(() => createColumns(handleDelete, loadDetails), [handleDelete, loadDetails]);

  // reset ke page 1 saat filter/search berubah
  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    getRowId: (row) => String(row.id), // penting utk stabilkan expanded state
    state: { expanded },
    onExpandedChange: setExpanded,
  });

  useEffect(() => {
    table.setPageIndex(0);
  }, [q, fProduk, fGroup, fSupplier, fFactory]); // eslint-disable-line react-hooks/exhaustive-deps

  // prefetch saat ada row yg statusnya expanded tapi belum punya cache
  useEffect(() => {
    table.getRowModel().rows.forEach((r) => {
      if (r.getIsExpanded()) {
        const declId = (r.original as DeclarationRow).id;
        if (!detailCache[declId]) loadDetails(declId);
      }
    });
  }, [expanded, detailCache, loadDetails, table]);

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

  return (
    <div className="p-5">
      {/* Filter Bar */}
      <h1 className="text-2xl font-semibold mb-2 text-emerald-800">
        Table Transaction
      </h1>
      
      <FilterBar
        fProduk={fProduk}
        setFProduk={setFProduk}
        produkOptions={produkOptions}
        fGroup={fGroup}
        setFGroup={setFGroup}
        groupOptions={groupOptions}
        fSupplier={fSupplier}
        setFSupplier={setFSupplier}
        supplierOptions={supplierOptions}
        fFactory={fFactory}
        setFFactory={setFFactory}
        factoryOptions={factoryOptions}
        q={q}
        setQ={setQ}
        loadData={loadData}
        clearFilters={clearFilters}
      />

      <Separator className="mb-3" />

      {/* Table */}
      <TransactionTable
        table={table}
        loading={loading}
        detailCache={detailCache}
        loadDetails={loadDetails}
      />

      {/* Pagination */}
      <Pagination table={table} pageSize={pageSize} setPageSize={setPageSize} />
    </div>
  );
}