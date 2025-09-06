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



/* ------- Reusable components ------- */
function LoaderBar() {
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-emerald-500/10">
        <div className="h-full w-1/5 bg-emerald-500/90 animate-[slide_1.2s_ease-in-out_infinite]" />
      </div>
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(60%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-xl bg-neutral-200/70 dark:bg-neutral-800/60 " +
        className
      }
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-[linear-gradient(90deg,transparent,rgba(16,185,129,0.15),transparent)]" />
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

/* ------- Page skeleton ------- */
export function LoadingQuisioner() {
  return (
    <div className="min-h-[70vh] w-full rounded-2xl border border-emerald-700/20 bg-white/70 p-4 backdrop-blur dark:bg-neutral-900/70">
      <LoaderBar />

      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-56" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-64" />  {/* search */}
          <Skeleton className="h-10 w-28" />            {/* tombol buat */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200/60 dark:border-neutral-800">
        <table className="w-max min-w-[1000px] table-auto">
          <thead className="bg-neutral-50/60 dark:bg-neutral-800/60">
            <tr className="text-left text-sm">
              {["Judul", "Status", "Periode", "Respon", "Terakhir Update", "Aksi"].map((h) => (
                <th key={h} className="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-t border-neutral-200/60 dark:border-neutral-800">
                <td className="p-3">
                  <Skeleton className="h-4 w-[320px]" />
                  <div className="mt-2"><Skeleton className="h-3 w-40" /></div>
                </td>
                <td className="p-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </td>
                <td className="p-3"><Skeleton className="h-4 w-36" /></td>
                <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                <td className="p-3"><Skeleton className="h-4 w-40" /></td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer total/progress */}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-500/60" />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
          <span>Memuat daftar quisioner…</span>
          <span className="text-emerald-600 dark:text-emerald-400">UI silky • emerald</span>
        </div>
      </div>
    </div>
  );
}