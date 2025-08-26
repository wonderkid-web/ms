import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

function isOpen(start?: Date|null, end?: Date|null) {
  const now = new Date();
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

export async function GET(_req: Request, { params }: Params) {
  const id = Number(params.id);
  if (!id || Number.isNaN(id)) return NextResponse.json({ ok:false, error:"Invalid id" }, { status:400 });

  const data = await prisma.quisioner.findUnique({
    where: { id, status: "published" },
    select: {
      id:true, title:true, description:true, status:true, startDate:true, endDate:true,
      questions: {
        orderBy: { order: "asc" },
        select: {
          id:true, title:true, type:true, required:true, order:true,
          options: { orderBy: { order: "asc" }, select: { id:true, label:true, order:true } }
        }
      },
    }
  });

  if (!data) return NextResponse.json({ ok:false, error:"Not found or not published" }, { status:404 });
  if (!isOpen(data.startDate ?? undefined, data.endDate ?? undefined)) {
    return NextResponse.json({ ok:false, error:"This survey is not open" }, { status:403 });
  }
  return NextResponse.json({ ok:true, data });
}
