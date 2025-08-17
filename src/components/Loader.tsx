"use client";

import { useEffect, useState } from "react";

/**
 * Global loader for the App Router.
 *
 * Place this file at: app/loading.tsx
 * Or scope it to a segment: app/(dashboard)/loading.tsx
 *
 * Notes:
 * - A tiny delay (150ms) prevents flashing on very fast navigations.
 * - The overlay is fixed and sits above everything during pending states.
 */
export default function Loading() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 150); // anti-flicker
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-white/75 dark:bg-neutral-950/60 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      {/* Top indeterminate bar */}
      <div className="absolute left-0 right-0 top-0 h-1 overflow-hidden">
        <div className="h-full w-1/3 animate-[indeterminate_1.1s_ease-in-out_infinite] bg-emerald-500 dark:bg-emerald-400" />
      </div>

      {/* Center spinner + label */}
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/60 bg-white/80 px-4 py-3 shadow-md dark:border-emerald-800 dark:bg-neutral-900/80">
        <svg
          className="h-5 w-5 animate-spin text-emerald-600 dark:text-emerald-400"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-sm text-emerald-700 dark:text-emerald-300">
          Memuat halaman…
        </span>
      </div>

      {/* Keyframes for the top bar */}
      <style jsx>{`
        @keyframes indeterminate {
          0% { transform: translateX(-100%); width: 30%; }
          50% { transform: translateX(50%); width: 40%; }
          100% { transform: translateX(100%); width: 30%; }
        }
      `}</style>
    </div>
  );
}
