// components/SilkTableLoader.tsx
"use client";

type SilkTableLoaderRowProps = {
  colSpan: number;
  message?: string;
};

export function SilkTableLoaderRow({ colSpan, message = "Loading Data... ⏳" }: SilkTableLoaderRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-4">
        <div
          role="status"
          aria-live="polite"
          className={[
            "mx-auto w-[min(92vw,560px)] rounded-2xl p-4 pr-3",
            "bg-gradient-to-br from-emerald-50 to-white",
            "dark:from-emerald-900/70 dark:to-emerald-950/60",
            "border border-emerald-200/70 dark:border-emerald-700/70",
            "shadow-[0_12px_40px_rgba(16,185,129,0.25)]",
            "backdrop-blur supports-[backdrop-filter]:backdrop-blur-md",
            "flex items-center gap-3",
            "animate-in fade-in slide-in-from-top-1 duration-300",
          ].join(" ")}
        >
          {/* Spinner */}
          <div className="shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-800 p-2 text-emerald-700 dark:text-emerald-200">
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-20" />
              <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-50">
              {message}
            </p>
            <p className="mt-0.5 text-[13px] text-emerald-800/80 dark:text-emerald-100/70">
              Mohon tunggu sebentar, sedang mengambil data terbaru…
            </p>

            {/* Progress shimmer tipis */}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-emerald-200/50 dark:bg-emerald-800/40">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-emerald-500/70" />
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
