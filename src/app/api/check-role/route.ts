// app/api/check-role/route.ts
import { prisma } from "@/lib/prisma"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST() {
    const { userId } = await auth()
    const clerk = await clerkClient()
    if (!userId) return NextResponse.json({ ok: false }, { status: 401 })


    const role = await prisma.account.findUnique({ where: { clerkId: userId }, select: { role: true } }) // ambil dari DB kamu

    await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { role: role?.role },                   // simpan role ke metadata
    })

    return NextResponse.json({ ok: true, role })
}
