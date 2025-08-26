import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// Jika pakai Clerk, aktifkan ini untuk login wajib & simpan respondentId
// import { auth } from "@clerk/nextjs/server";

type Params = { params: { id: string } };

function isOpen(start?: Date|null, end?: Date|null) {
  const now = new Date();
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

export async function POST(req: Request, { params }: Params) {
  // const { userId } = await auth(); if (!userId) return NextResponse.json({ ok:false, error:"UNAUTHORIZED" }, { status:401 });
  const id = Number(params.id);
  if (!id || Number.isNaN(id)) return NextResponse.json({ ok:false, error:"Invalid id" }, { status:400 });

  let payload: any;
  try { payload = await req.json(); }
  catch { return NextResponse.json({ ok:false, error:"Invalid JSON" }, { status:400 }); }

  const q = await prisma.quisioner.findUnique({
    where: { id },
    select: {
      id:true, status:true, startDate:true, endDate:true,
      questions: { select: { id:true, type:true, required:true, options: { select: { id:true } } } }
    }
  });
  if (!q) return NextResponse.json({ ok:false, error:"Not found" }, { status:404 });
  if (q.status !== "published" || !isOpen(q.startDate ?? undefined, q.endDate ?? undefined)) {
    return NextResponse.json({ ok:false, error:"Survey is closed" }, { status:403 });
  }

  const answers = Array.isArray(payload?.answers) ? payload.answers : [];
  const byId = new Map<number, any>(answers.map((a: any) => [Number(a.questionId), a]));
  for (const qq of q.questions) {
    const a = byId.get(qq.id);
    if (qq.required) {
      const val = a?.value;
      const ok = qq.type === "checkbox" ? Array.isArray(val) && val.length > 0 : (val !== undefined && val !== null && String(val).trim() !== "");
      if (!ok) return NextResponse.json({ ok:false, error:`Required question missing: ${qq.id}` }, { status:400 });
    }
  }

  const created = await prisma.response.create({
    data: {
      quisionerId: q.id,
      // respondentId: userId ?? null,
      answers: {
        create: q.questions.map(qq => {
          const a = byId.get(qq.id);
          const base: any = { questionId: qq.id };
          if (!a) return base;
          switch (qq.type) {
            case "short_text":
            case "long_text":
              base.valueText = String(a.value ?? ""); break;
            case "number":
              base.valueNumber = typeof a.value === "number" ? a.value : Number(a.value); break;
            case "date":
              base.valueDate = a.value ? new Date(a.value) : null; break;
            case "rating":
              base.rating = typeof a.value === "number" ? a.value : Number(a.value); break;
            case "multiple_choice":
              if (a.value) base.selectedOptions = { create: [{ option: { connect: { id: Number(a.value) } } }] };
              break;
            case "checkbox":
              if (Array.isArray(a.value) && a.value.length)
                base.selectedOptions = { create: a.value.map((oid: any) => ({ option: { connect: { id: Number(oid) } } })) };
              break;
          }
          return base;
        }),
      },
    },
    select: { id: true }
  });

  return NextResponse.json({ ok:true, id: created.id }, { status:201 });
}
