"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quisionerSchema, QuisionerFormValues } from "@/lib/quisioner/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QuestionBuilder from "@/components/quisioner/QuestionBuilder";
import { Save } from "lucide-react";

export default function CreateQuisionerPage() {
  const router = useRouter();
  const form = useForm<QuisionerFormValues>({
    resolver: zodResolver(quisionerSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
      startDate: "",
      endDate: "",
      questions: [],
    },
    mode: "onChange",
  });

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = form;
  const questions = watch("questions");

  const onSubmit = async (data: QuisionerFormValues) => {
    try {
      const res = await fetch("/api/quisioner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      // Redirect ke list setelah sukses
      router.push("/admin/quisioner");
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan kuesioner. Coba lagi.");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Create Quisioner</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.back()}>Batal</Button>
          <Button
            variant="outline"
            className="border-green-600 text-white mb-3 bg-green-600 hover:bg-green-700 hover:text-white flex gap-2 ml-auto"
            onClick={handleSubmit(onSubmit)} disabled={isSubmitting}><Save /> Simpan</Button>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Informasi Umum</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="mb-1 block">Judul</Label>
              <Input placeholder="Contoh: Survey Kepuasan Pekerja" {...register("title")} />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message as string}</p>}
            </div>
            <div>
              <Label className="mb-1 block">Deskripsi</Label>
              <Textarea rows={4} placeholder="Tujuan survey, instruksi, dsb." {...register("description")} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="mb-1 block">Status</Label>
                <Select value={watch("status")} onValueChange={(v: "draft" | "published") => setValue("status", v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1 block">Start Date</Label>
                <Input type="date" {...register("startDate")} />
              </div>
              <div>
                <Label className="mb-1 block">End Date</Label>
                <Input type="date" {...register("endDate")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tips</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Gunakan pertanyaan wajib hanya jika benar-benar diperlukan.</p>
            <p>• Untuk pilihan ganda/checkbox, sediakan opsi "Lainnya" bila relevan.</p>
            <p>• Pastikan <i>End Date</i> tidak sebelum <i>Start Date</i>.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Daftar Pertanyaan</CardTitle></CardHeader>
        <CardContent>
          <QuestionBuilder
            value={questions || []}
            onChange={(next) => setValue("questions", next, { shouldDirty: true, shouldValidate: true })}
          />
          {errors.questions && <p className="text-sm text-red-500 mt-2">{errors.questions.message as string}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
