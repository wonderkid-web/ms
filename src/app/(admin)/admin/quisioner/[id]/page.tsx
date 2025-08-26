"use client";
import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function fmt(d?: string) {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString(); } catch { return d; }
}

export default function QuisionerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/quisioner/${id}`)
      .then(r => r.json())
      .then(res => {
        if (res?.ok) setItem(res.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-4">Loading…</div>;
  if (!item) return <div className="p-4">Data tidak ditemukan.</div>;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{item.title}</h1>
          <div className="text-xs text-muted-foreground">
            <span>Updated: {new Date(item.updatedAt).toLocaleString()}</span>
            <span className="mx-2">•</span>
            <span>Responses: {item._count?.responses ?? 0}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{item.status}</Badge>
          <Button variant="secondary" onClick={() => router.push("/admin/quisioner")}>Back</Button>
        </div>
      </div>

      {item.description && (
        <Card>
          <CardHeader><CardTitle>Deskripsi</CardTitle></CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm">{item.description}</CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Periode</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <div>Start: {fmt(item.startDate)}</div>
            <div>End: {fmt(item.endDate)}</div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Aksi</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <div className="flex flex-wrap gap-2">
              {/* Edit (opsional kalau halaman edit belum ada, tombol ini bisa disembunyikan) */}
              {/* <Button asChild><Link href={`/admin/quisioner/${item.id}/edit`}>Edit</Link></Button> */}

              {/* Publish / Unpublish */}
              {item.status === "draft" ? (
                <Button
                  variant="outline"
                  onClick={async () => {
                    const ok = confirm("Publish kuisioner ini? User akan bisa mengisi selama periode aktif.");
                    if (!ok) return;
                    const res = await fetch(`/api/quisioner/${item.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "published" }),
                    });
                    if (res.ok) location.reload();
                    else alert("Gagal publish");
                  }}
                >
                  Publish
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={async () => {
                    const ok = confirm("Set ke draft? User tidak bisa mengisi lagi.");
                    if (!ok) return;
                    const res = await fetch(`/api/quisioner/${item.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "draft" }),
                    });
                    if (res.ok) location.reload();
                    else alert("Gagal unpublish");
                  }}
                >
                  Unpublish
                </Button>
              )}

              {/* Copy public link */}
              <Button
                variant="secondary"
                onClick={async () => {
                  try {
                    const base = window.location.origin;
                    const url = `${base}/quisioner/${item.id}`;
                    await navigator.clipboard.writeText(url);
                    alert("Public link disalin ke clipboard!");
                  } catch {
                    alert("Tidak bisa menyalin link.");
                  }
                }}
              >
                Copy public link
              </Button>

              {/* Export CSV */}
              <Button asChild variant="outline">
                <a href={`/api/quisioner/${item.id}/export`} target="_blank">Export CSV</a>
              </Button>

              {/* Preview as user */}
              <Button asChild variant="ghost">
                <a href={`/quisioner/${item.id}`} target="_blank">Preview</a>
              </Button>

              {/* Delete */}
              <Button
                variant="destructive"
                onClick={async () => {
                  const ok = confirm("Hapus kuisioner beserta pertanyaan & jawaban? Tindakan ini tidak dapat dibatalkan.");
                  if (!ok) return;
                  const res = await fetch(`/api/quisioner/${item.id}`, { method: "DELETE" });
                  if (res.ok) window.location.href = "/admin/quisioner";
                  else alert("Gagal menghapus");
                }}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

      <Card>
        <CardHeader><CardTitle>Daftar Pertanyaan</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {item.questions?.length ? item.questions.map((q: any, idx: number) => (
            <div key={q.id} className="border rounded-md p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">Q{idx + 1}. {q.title}</div>
                <div className="text-xs text-muted-foreground">
                  {q.type}{q.required ? " · required" : ""}
                </div>
              </div>
              {["multiple_choice", "checkbox"].includes(q.type) && (
                <ul className="mt-2 list-disc pl-6 text-sm">
                  {q.options?.map((o: any) => <li key={o.id}>{o.label}</li>)}
                </ul>
              )}
            </div>
          )) : <p className="text-sm text-muted-foreground">Belum ada pertanyaan.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
