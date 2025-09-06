"use client";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingQuisioner } from "@/components/loader/index";

type Question = {
  id: number;
  title: string;
  type: "short_text"|"long_text"|"multiple_choice"|"checkbox"|"rating"|"number"|"date";
  required: boolean;
  options?: { id: number; label: string }[];
};
type Quisioner = {
  id: number; title: string; description?: string | null;
  startDate?: string; endDate?: string; questions: Question[];
};

export default function PublicQuisionerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = React.useState<Quisioner | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/public/quisioner/${id}`)
      .then(r => r.json())
      .then(res => { if (res?.ok) setItem(res.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const update = (qid: number, v: any) => setValues(prev => ({ ...prev, [qid]: v }));

  const onSubmit = async () => {
    if (!item) return;
    for (const q of item.questions) {
      if (!q.required) continue;
      const v = values[q.id];
      const ok = q.type === "checkbox" ? Array.isArray(v) && v.length > 0 : (v ?? "").toString().trim() !== "";
      if (!ok) { alert(`Pertanyaan wajib: "${q.title}" belum diisi.`); return; }
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/quisioner/${item.id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(values).map(([qid, v]) => ({ questionId: Number(qid), value: v }))
        })
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Failed");
      router.push(`/user/quisioner/${item.id}/thanks`);
    } catch {
      alert("Gagal mengirim jawaban. Coba lagi.");
    } finally { setSubmitting(false); }
  };

  if (loading) return <LoadingQuisioner />;
  if (!item) return <div className="p-4">Kuesioner tidak tersedia.</div>;

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
        {item.description && <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">{item.description}</p>}
        {(item.startDate || item.endDate) && (
          <div className="mt-2 inline-flex items-center gap-2">
            {item.startDate && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 ring-1 ring-emerald-300/50">{new Date(item.startDate).toLocaleDateString()}</span>}
            {item.endDate && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 ring-1 ring-emerald-300/50">s.d. {new Date(item.endDate).toLocaleDateString()}</span>}
          </div>
        )}
      </div>

      {/* CARD: SILK EMERALD */}
      <Card className="relative overflow-hidden rounded-2xl border border-emerald-700/30 bg-white/70 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.35)] backdrop-blur dark:bg-neutral-900/70">
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-emerald-400/10" />
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-emerald-900 dark:text-emerald-100">Isi Jawaban</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {item.questions.map((q, idx) => {
            const v = values[q.id];
            return (
              <div key={q.id} className="rounded-xl border border-emerald-700/20 bg-white/60 p-4 backdrop-blur dark:bg-neutral-900/60">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="font-medium">
                    Q{idx + 1}. {q.title} {q.required && <span className="ml-1 rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600 ring-1 ring-rose-200/60">wajib</span>}
                  </div>
                </div>

                {/* short_text */}
                {q.type === "short_text" && (
                  <input
                    className="w-full h-10 rounded-xl border border-emerald-700/20 bg-white/80 px-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300 dark:bg-neutral-900/70"
                    onChange={e => update(q.id, e.target.value)}
                    placeholder="Tulis jawaban…"
                  />
                )}

                {/* long_text */}
                {q.type === "long_text" && (
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-emerald-700/20 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300 dark:bg-neutral-900/70"
                    onChange={e => update(q.id, e.target.value)}
                    placeholder="Tulis jawaban panjang…"
                  />
                )}

                {/* number */}
                {q.type === "number" && (
                  <input
                    type="number"
                    className="w-full h-10 rounded-xl border border-emerald-700/20 bg-white/80 px-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300 dark:bg-neutral-900/70"
                    onChange={e => update(q.id, e.target.value === "" ? null : Number(e.target.value))}
                    placeholder="0"
                  />
                )}

                {/* date */}
                {q.type === "date" && (
                  <input
                    type="date"
                    className="h-10 rounded-xl border border-emerald-700/20 bg-white/80 px-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300 dark:bg-neutral-900/70"
                    onChange={e => update(q.id, e.target.value)}
                  />
                )}

                {/* rating */}
                {q.type === "rating" && (
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(n => {
                      const active = Number(v) >= n;
                      return (
                        <button
                          key={n}
                          type="button"
                          aria-label={`${n} bintang`}
                          onClick={() => update(q.id, n)}
                          className={
                            "h-9 w-9 rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 " +
                            (active ? "border-emerald-500 bg-emerald-500/20" : "border-emerald-300/50 bg-emerald-50 hover:bg-emerald-100")
                          }
                        >
                          <svg viewBox="0 0 24 24" className={"mx-auto h-5 w-5 " + (active ? "text-emerald-600" : "text-emerald-400")}>
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* multiple_choice => pill radio */}
                {q.type === "multiple_choice" && (
                  <div className="flex flex-wrap gap-2">
                    {q.options?.map(opt => {
                      const active = v === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => update(q.id, opt.id)}
                          className={
                            "rounded-xl px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 " +
                            (active
                              ? "bg-emerald-500 text-emerald-950 shadow hover:bg-emerald-400"
                              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300/50 hover:bg-emerald-100")
                          }
                          aria-pressed={active}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* checkbox => pill chips (multi) */}
                {q.type === "checkbox" && (
                  <div className="flex flex-wrap gap-2">
                    {q.options?.map(opt => {
                      const arr: number[] = Array.isArray(v) ? v : [];
                      const active = arr.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            update(q.id, active ? arr.filter(x => x !== opt.id) : [...arr, opt.id]);
                          }}
                          className={
                            "rounded-xl px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 " +
                            (active
                              ? "bg-emerald-500 text-emerald-950 shadow hover:bg-emerald-400"
                              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300/50 hover:bg-emerald-100")
                          }
                          aria-pressed={active}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* SUBMIT */}
          <div className="sticky bottom-2 z-10 -mx-4 -mb-4 rounded-b-2xl bg-gradient-to-t from-white/80 to-transparent px-4 pt-3 backdrop-blur dark:from-neutral-900/80">
            <Button
              onClick={onSubmit}
              disabled={submitting}
              className="h-11 rounded-md bg-emerald-500 px-5 text-white transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {submitting ? "Mengirim..." : "Kirim Jawaban"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
