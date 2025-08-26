import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const id = Number(params.id);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }
  const data = await prisma.quisioner.findUnique({
    where: { id },
    select: {
      id: true, title: true, description: true, status: true, startDate: true, endDate: true, updatedAt: true, createdAt: true,
      questions: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, type: true, required: true, order: true,
          options: { orderBy: { order: "asc" }, select: { id: true, label: true, order: true } } }
      },
      _count: { select: { responses: true } }
    }
  });
  if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data });
}

export async function PATCH(req: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  const id = Number(params.id);
  if (!id || Number.isNaN(id)) return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });

  let body: any = {};
  try { body = await req.json(); } catch {}

  const data: any = {};
  if (body.status && (body.status === "draft" || body.status === "published")) data.status = body.status;
  if (body.title) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.startDate !== undefined) data.startDate = body.startDate ? new Date(body.startDate) : null;
  if (body.endDate !== undefined) data.endDate = body.endDate ? new Date(body.endDate) : null;

  const updated = await prisma.quisioner.update({ where: { id }, data, select: { id: true, status: true } });
  return NextResponse.json({ ok: true, data: updated });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  const id = Number(params.id);
  if (!id || Number.isNaN(id)) return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  await prisma.quisioner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
