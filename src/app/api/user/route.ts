import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await prisma.account.findMany();
    if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, data });
}


