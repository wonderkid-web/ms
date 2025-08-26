"use client";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Question, QuestionType } from "@/lib/quisioner/schema";
import { X, ArrowUp, ArrowDown, Plus, ListChecks, Text, CheckSquare, Star, Hash, Calendar } from "lucide-react";

type Props = {
  value: Question[];
  onChange: (next: Question[]) => void;
};

const typeOptions: { value: QuestionType; label: string; icon: React.ComponentType<any> }[] = [
  { value: "short_text", label: "Short text", icon: Text },
  { value: "long_text", label: "Long text", icon: Text },
  { value: "multiple_choice", label: "Multiple choice", icon: ListChecks },
  { value: "checkbox", label: "Checkboxes", icon: CheckSquare },
  { value: "rating", label: "Rating (1-5)", icon: Star },
  { value: "number", label: "Number", icon: Hash },
  { value: "date", label: "Date", icon: Calendar },
];

export default function QuestionBuilder({ value, onChange }: Props) {
  const addQuestion = () => {
    const q: Question = {
      id: uuidv4(),
      title: "",
      type: "short_text",
      required: false,
      options: [],
    };
    onChange([...(value || []), q]);
  };

  const update = (id: string, patch: Partial<Question>) => {
    onChange(value.map(q => q.id === id ? { ...q, ...patch } : q));
  };

  const remove = (id: string) => onChange(value.filter(q => q.id !== id));

  const move = (id: string, dir: -1 | 1) => {
    const idx = value.findIndex(q => q.id === id);
    if (idx < 0) return;
    const next = [...value];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next);
  };

  const addOption = (qid: string) => {
    const next = value.map(q => {
      if (q.id !== qid) return q;
      const id = uuidv4();
      const label = `Option ${q.options.length + 1}`;
      return { ...q, options: [...(q.options || []), { id, label }] };
    });
    onChange(next);
  };

  const updateOption = (qid: string, oid: string, label: string) => {
    const next = value.map(q => {
      if (q.id !== qid) return q;
      const opts = q.options.map(o => o.id === oid ? { ...o, label } : o);
      return { ...q, options: opts };
    });
    onChange(next);
  };

  const removeOption = (qid: string, oid: string) => {
    const next = value.map(q => {
      if (q.id !== qid) return q;
      const opts = q.options.filter(o => o.id !== oid);
      return { ...q, options: opts };
    });
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {value?.map((q, idx) => {
        const Icon = typeOptions.find(t => t.value === q.type)?.icon ?? Text;
        return (
          <Card key={q.id} className="border-dashed">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <Icon className="size-4" />
                <CardTitle className="text-base">Pertanyaan {idx + 1}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => move(q.id, -1)}><ArrowUp className="size-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => move(q.id, 1)}><ArrowDown className="size-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(q.id)}><X className="size-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <Label className="mb-1 block">Teks pertanyaan</Label>
                  <Input value={q.title} onChange={(e) => update(q.id, { title: e.target.value })} placeholder="Contoh: Berapa kepuasan Anda?" />
                </div>
                <div>
                  <Label className="mb-1 block">Tipe</Label>
                  <Select value={q.type} onValueChange={(v: QuestionType) => update(q.id, { type: v, options: (v === "multiple_choice" || v === "checkbox") ? (q.options?.length ? q.options : [{ id: crypto.randomUUID?.() ?? 'opt1', label: 'Option 1' }, { id: crypto.randomUUID?.() ?? 'opt2', label: 'Option 2' }]) : [] })}>
                    <SelectTrigger><SelectValue placeholder="Pilih tipe" /></SelectTrigger>
                    <SelectContent>
                      {typeOptions.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(q.type === "multiple_choice" || q.type === "checkbox") && (
                <div className="space-y-2">
                  <Label>Opsi jawaban</Label>
                  <div className="space-y-2">
                    {q.options?.map((o) => (
                      <div key={o.id} className="flex items-center gap-2">
                        <Input value={o.label} onChange={(e) => updateOption(q.id, o.id, e.target.value)} className="flex-1" />
                        <Button variant="ghost" size="icon" onClick={() => removeOption(q.id, o.id)}><X className="size-4" /></Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={() => addOption(q.id)}>
                    <Plus className="mr-1 size-4" /> Tambah opsi
                  </Button>
                </div>
              )}

              {q.type === "long_text" && (
                <div>
                  <Label className="mb-1 block">Contoh jawaban (opsional)</Label>
                  <Textarea placeholder="Tulis contoh jawaban untuk responden..." />
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                <Switch id={`req-${q.id}`} checked={q.required} onCheckedChange={(b) => update(q.id, { required: b })} />
                <Label htmlFor={`req-${q.id}`}>Wajib diisi</Label>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="pt-2">
        <Button type="button" onClick={addQuestion}>
          <Plus className="mr-2 size-4" /> Tambah pertanyaan
        </Button>
      </div>
    </div>
  );
}
