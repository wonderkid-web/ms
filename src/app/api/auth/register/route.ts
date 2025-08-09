import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = (await req.json()) as {
      name?: string
      email?: string
      password?: string
    }
    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password wajib diisi." }, { status: 400 })
    }
    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (exists) {
      return NextResponse.json({ message: "Email sudah terdaftar." }, { status: 409 })
    }
    const passwordHash = await hash(password, 12)
    const data = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: email.toLowerCase(),
        passwordHash,
      },
    })
    console.log(data)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ message: "Terjadi kesalahan." }, { status: 500 })
  }
}
