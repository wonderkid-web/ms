import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quisionerSchema } from "@/lib/quisioner/schema";

export async function GET() {
  const data = await prisma.quisioner.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, title: true, status: true, startDate: true, endDate: true, updatedAt: true,
      _count: { select: { questions: true, responses: true } }
    }
  });
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = quisionerSchema.parse(body);

    const created = await prisma.quisioner.create({
      data: {
        title: parsed.title,
        description: parsed.description ?? null,
        status: parsed.status,
        startDate: parsed.startDate ? new Date(parsed.startDate) : null,
        endDate: parsed.endDate ? new Date(parsed.endDate) : null,
        // createdBy: (await currentUser())?.id, // optional: integrasi Clerk
        questions: {
          create: parsed.questions.map((q, idx) => ({
            order: idx,
            title: q.title,
            type: q.type,
            required: q.required ?? false,
            options: (q.type === "multiple_choice" || q.type === "checkbox")
              ? { create: (q.options || []).map((o, i) => ({ label: o.label, order: i })) }
              : undefined,
          })),
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Invalid" }, { status: 400 });
  }
}
