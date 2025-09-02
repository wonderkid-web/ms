import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


type Params = { params: { id: string } };
export async function GET(_req: Request, { params }: Params) {
    const id = Number(params.id);
    if (!id || Number.isNaN(id)) {
        return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }
    const data = await prisma.account.findUnique({
        where: { id },
        select: { role:true}
    });
    if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, data });
}


