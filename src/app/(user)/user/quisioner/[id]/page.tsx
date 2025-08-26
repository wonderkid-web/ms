"use client";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    // validasi required sederhana di client
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
    } catch (e) {
      alert("Gagal mengirim jawaban. Coba lagi.");
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="p-4">Loading…</div>;
  if (!item) return <div className="p-4">Kuesioner tidak tersedia.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
        {item.description && <p className="text-muted-foreground">{item.description}</p>}
      </div>

      <Card>
        <CardHeader><CardTitle>Isi Jawaban</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {item.questions.map((q, idx) => (
            <div key={q.id} className="space-y-2">
              <div className="font-medium">Q{idx + 1}. {q.title} {q.required && <span className="text-red-500">*</span>}</div>

              {q.type === "short_text"  && <input className="w-full rounded-md border p-2" onChange={e => update(q.id, e.target.value)} />}
              {q.type === "long_text"   && <textarea className="w-full rounded-md border p-2" rows={4} onChange={e => update(q.id, e.target.value)} />}
              {q.type === "number"      && <input type="number" className="w-full rounded-md border p-2" onChange={e => update(q.id, e.target.value === "" ? null : Number(e.target.value))} />}
              {q.type === "date"        && <input type="date" className="rounded-md border p-2" onChange={e => update(q.id, e.target.value)} />}
              {q.type === "rating"      && (
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(n => (
                    <label key={n} className="inline-flex items-center gap-1">
                      <input type="radio" name={`rating-${q.id}`} value={n} onChange={() => update(q.id, n)} />
                      <span>{n}</span>
                    </label>
                  ))}
                </div>
              )}
              {q.type === "multiple_choice" && (
                <div className="space-y-1">
                  {q.options?.map(opt => (
                    <label key={opt.id} className="block">
                      <input type="radio" name={`mc-${q.id}`} onChange={() => update(q.id, opt.id)} />{" "}{opt.label}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "checkbox" && (
                <div className="space-y-1">
                  {q.options?.map(opt => (
                    <label key={opt.id} className="block">
                      <input type="checkbox" onChange={e => {
                        const prev: number[] = Array.isArray(values[q.id]) ? values[q.id] : [];
                        update(q.id, e.target.checked ? [...prev, opt.id] : prev.filter(x => x !== opt.id));
                      }} />{" "}{opt.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-2">
            <Button onClick={onSubmit} disabled={submitting}>{submitting ? "Mengirim..." : "Kirim Jawaban"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
