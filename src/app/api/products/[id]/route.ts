
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const data = await request.json()
  const product = await prisma.product.update({
    where: { id },
    data,
  })
  return NextResponse.json(product)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  await prisma.product.delete({
    where: { id },
  })
  return new NextResponse(null, { status: 204 })
}
