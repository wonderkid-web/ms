
import React from "react";
import { CalendarRange, Gauge, ShieldCheck, Percent } from "lucide-react";

/* ---------- Utils & UI small bits ---------- */
export function formatDate(v: unknown) {
  if (!v) return "-";
  const d = v instanceof Date ? v : new Date(v as any);
  return isNaN(d.getTime()) ? "-" : d.toISOString().slice(0, 10);
}
export const nf = new Intl.NumberFormat("id-ID");

export const selectStyles = {
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
export const selectTheme = (t: any) => ({
  ...t,
  colors: {
    ...t.colors,
    primary: "#047857",
    primary25: "rgba(4,120,87,0.12)",
    primary50: "rgba(4,120,87,0.22)",
  },
});

export function PeriodBadge({ from, to }: { from: unknown; to: unknown }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800 text-xs">
      <CalendarRange className="h-3.5 w-3.5" />
      {formatDate(from)} – {formatDate(to)}
    </span>
  );
}
export function CapacityChip({ val }: { val: string }) {
  const num = Number(val);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800 border border-emerald-200">
      <Gauge className="h-3.5 w-3.5" />
      {isNaN(num) ? val : `${nf.format(num)} ton/tahun`}
    </span>
  );
}
export function CertBadge({ name }: { name: string }) {
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
      <ShieldCheck className="h-3.5 w-3.5" /> {key}
    </span>
  );
}
export function TtpBar({ value }: { value: number }) {
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
      <div className="mb-1 flex items-center gap-1.5 text-sm">
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
