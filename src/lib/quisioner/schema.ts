// src/lib/quisioner/schema.ts
import { z } from "zod";

export const questionTypeEnum = z.enum([
  "short_text",
  "long_text",
  "multiple_choice",
  "checkbox",
  "rating",
  "number",
  "date",
]);

export const optionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Option label wajib diisi"),
});

export const questionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Pertanyaan wajib diisi"),
  type: questionTypeEnum,
  required: z.boolean().default(false),
  options: z.array(optionSchema).default([]), // untuk multiple_choice/checkbox
}).refine((q) => {
  if (q.type === "multiple_choice" || q.type === "checkbox") {
    return q.options.length >= 2;
  }
  return true;
}, { message: "Minimal 2 opsi untuk tipe pilihan.", path: ["options"] });

export const quisionerSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  questions: z.array(questionSchema).min(1, "Minimal 1 pertanyaan."),
});

export type QuestionType = z.infer<typeof questionTypeEnum>;
export type QuisionerFormValues = z.infer<typeof quisionerSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Option = z.infer<typeof optionSchema>;
