
import React from "react";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Package,
  Layers,
  Truck,
  Factory as FactoryIcon,
  Search,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { OptionType } from "./types";
import { selectStyles, selectTheme } from "./utils";

interface FilterBarProps {
  fProduk: OptionType | null;
  setFProduk: (value: OptionType | null) => void;
  produkOptions: OptionType[];
  fGroup: OptionType | null;
  setFGroup: (value: OptionType | null) => void;
  groupOptions: OptionType[];
  fSupplier: OptionType | null;
  setFSupplier: (value: OptionType | null) => void;
  supplierOptions: OptionType[];
  fFactory: OptionType | null;
  setFFactory: (value: OptionType | null) => void;
  factoryOptions: OptionType[];
  q: string;
  setQ: (value: string) => void;
  loadData: () => void;
  clearFilters: () => void;
}

export function FilterBar({
  fProduk,
  setFProduk,
  produkOptions,
  fGroup,
  setFGroup,
  groupOptions,
  fSupplier,
  setFSupplier,
  supplierOptions,
  fFactory,
  setFFactory,
  factoryOptions,
  q,
  setQ,
  loadData,
  clearFilters,
}: FilterBarProps) {
  return (
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
  );
}
