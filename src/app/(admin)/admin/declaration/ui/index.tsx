
// -------------------
// Helpers & Styles

import { Label } from "@/components/ui/label";

// -------------------
export function Field({
  label,
  required,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[15px] font-semibold text-foreground">
        {label}
        {required ? <span className="text-emerald-700"> *</span> : null}
      </Label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export const selectStyles = {
  control: (b: any) => ({
    ...b,
    minHeight: 44,
    borderRadius: 4,
    borderColor: "hsl(var(--input))",
    background: "hsl(var(--background))",
    fontSize: "16px",
  }),
  valueContainer: (b: any) => ({ ...b, padding: "8px 10px" }),
  option: (b: any, s: any) => ({
    ...b,
    padding: "10px 12px",
    fontSize: "16px",
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

export const selectTheme = (theme: any) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: "#047857",
    primary25: "rgba(4,120,87,0.12)",
    primary50: "rgba(4,120,87,0.22)",
    neutral80: "#0a0a0a",
  },
});
