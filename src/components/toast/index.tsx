"use client";
import { toast } from "react-hot-toast";

type Props = {
  t: any;
  onConfirm: () => void;
};


type TToast = { id: string; visible: boolean };

type Variant = "success" | "error";
type BaseProps = {
  t: TToast;
  variant: Variant;
  title?: string;
  description?: string;
};

const stylesByVariant = {
  success: {
    bg: "bg-emerald-950/85",
    border: "border-emerald-700/40",
    ring: "ring-emerald-400/10",
    text: "text-emerald-50",
    subtext: "text-emerald-200/85",
    icon: "text-emerald-300",
    shadow: "shadow-[0_12px_40px_-10px_rgba(16,185,129,0.45)]",
    closeFocus: "focus-visible:ring-emerald-300/40",
    closeHover: "hover:bg-emerald-900/40 hover:text-emerald-200",
  },
  error: {
    bg: "bg-rose-950/85",
    border: "border-rose-700/40",
    ring: "ring-rose-400/10",
    text: "text-rose-50",
    subtext: "text-rose-200/85",
    icon: "text-rose-300",
    shadow: "shadow-[0_12px_40px_-10px_rgba(244,63,94,0.35)]",
    closeFocus: "focus-visible:ring-rose-300/40",
    closeHover: "hover:bg-rose-900/40 hover:text-rose-100",
  },
} as const;


export function ConfirmDeleteToast({ t, onConfirm }: Props) {
  return (
    <div
      className={[
        // layout
        "pointer-events-auto w-[92vw] max-w-md transition-all",
        t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      <div className="relative overflow-hidden rounded-2xl border border-emerald-700/40 bg-emerald-950/85 text-emerald-50 shadow-[0_12px_40px_-10px_rgba(16,185,129,0.45)] backdrop-blur-xl">
        {/* subtle emerald glow */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-emerald-400/10" />

        <div className="flex gap-3 p-4 md:p-5">
          {/* icon */}
          <div className="mt-0.5 shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-emerald-300"
              aria-hidden="true"
            >
              <path
                d="M12 9v4m0 4h.01M10.29 3.86l-7.2 12.47A2 2 0 005 20h14a2 2 0 001.71-3.67l-7.2-12.47a2 2 0 00-3.42 0z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* content */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-50">
              Hapus akun ini?
            </p>
            <p className="mt-1 text-xs text-emerald-200/85">
              Tindakan ini menghapus akun beserta data terkait. Lanjutkan?
            </p>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  onConfirm();
                }}
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-emerald-950 transition
                           hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80 active:translate-y-[1px]"
              >
                Lanjut
              </button>

              <button
                onClick={() => toast.dismiss(t.id)}
                className="inline-flex items-center rounded-xl border border-emerald-400/30 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-200 transition
                           hover:bg-emerald-900/60 hover:border-emerald-400/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40"
              >
                Batal
              </button>
            </div>
          </div>

          {/* close (X) */}
          <button
            aria-label="Tutup"
            onClick={() => toast.dismiss(t.id)}
            className="self-start rounded-lg p-1 text-emerald-300/70 transition hover:bg-emerald-900/40 hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6l-12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Icon({ variant }: { variant: Variant }) {
  if (variant === "success") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M20 7L10 17l-6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className={stylesByVariant.success.icon}
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 9v4m0 4h.01M10.29 3.86l-7.2 12.47A2 2 0 005 20h14a2 2 0 001.71-3.67l-7.2-12.47a2 2 0 00-3.42 0z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={stylesByVariant.error.icon}
      />
    </svg>
  );
}

export function ToastBase({ t, variant, title, description }: BaseProps) {
  const s = stylesByVariant[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "pointer-events-auto w-[92vw] max-w-md transition-all",
        t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      <div
        className={[
          "relative overflow-hidden rounded-2xl border backdrop-blur-xl",
          s.bg,
          s.border,
          s.shadow,
        ].join(" ")}
      >
        <div className={`pointer-events-none absolute inset-0 ring-1 ring-inset ${s.ring}`} />
        <div className="flex gap-3 p-4 md:p-5">
          <div className="mt-0.5 shrink-0">
            <Icon variant={variant} />
          </div>

          <div className="flex-1">
            {title ? (
              <p className={`text-sm font-semibold ${s.text}`}>{title}</p>
            ) : null}
            {description ? (
              <p className={`mt-1 text-xs ${s.subtext}`}>{description}</p>
            ) : null}
          </div>

          <button
            aria-label="Tutup"
            onClick={() => toast.dismiss(t.id)}
            className={[
              "self-start rounded-lg p-1 transition focus:outline-none",
              s.closeHover,
              s.closeFocus,
            ].join(" ")}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6l-12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/** ---------- Helper functions (siap pakai) ---------- */
export function showSuccessToast(
  description: string,
  opts?: { title?: string; duration?: number }
) {
  const { title = "Berhasil", duration = 3500 } = opts || {};
  toast.custom((t) => <ToastBase t={t} variant="success" title={title} description={description} />, {
    duration,
  });
}

export function showErrorToast(
  description: string,
  opts?: { title?: string; duration?: number }
) {
  const { title = "Gagal", duration = 5000 } = opts || {};
  toast.custom((t) => <ToastBase t={t} variant="error" title={title} description={description} />, {
    duration,
  });
}
