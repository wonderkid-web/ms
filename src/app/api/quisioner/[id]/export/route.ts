import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

type Params = { params: { id: string } };

function toCsv(rows: string[][]) {
  return rows.map(r => r.map((v) => {
    const s = v ?? "";
    const needs = /[",\n]/.test(s);
    return needs ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(",")).join("\n");
}

export async function GET(_req: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("UNAUTHORIZED", { status: 401 });
  const id = Number(params.id);
  if (!id || Number.isNaN(id)) return new NextResponse("Invalid id", { status: 400 });

  const data = await prisma.response.findMany({
    where: { quisionerId: id },
    orderBy: { submittedAt: "asc" },
    select: {
      id: true, submittedAt: true, respondentId: true,
      answers: {
        include: {
          question: { select: { id: true, title: true, type: true } },
          selectedOptions: { include: { option: { select: { id: true, label: true } } } }
        }
      }
    }
  });

  const rows: string[][] = [["responseId","submittedAt","respondentId","questionId","question","type","answer"]];
  for (const r of data) {
    for (const a of r.answers) {
      let answer = "";
      switch (a.question.type) {
        case "short_text":
        case "long_text": answer = a.valueText ?? ""; break;
        case "number":    answer = a.valueNumber != null ? String(a.valueNumber) : ""; break;
        case "date":      answer = a.valueDate ? new Date(a.valueDate).toISOString() : ""; break;
        case "rating":    answer = a.rating != null ? String(a.rating) : ""; break;
        case "multiple_choice":
        case "checkbox":  answer = (a.selectedOptions || []).map(so => so.option.label).join("|"); break;
      }
      rows.push([
        String(r.id),
        r.submittedAt.toISOString(),
        r.respondentId ?? "",
        String(a.question.id),
        a.question.title,
        a.question.type,
        answer,
      ]);
    }
  }

  const csv = toCsv(rows);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="quisioner_${id}_responses.csv"`,
    }
  });
}
