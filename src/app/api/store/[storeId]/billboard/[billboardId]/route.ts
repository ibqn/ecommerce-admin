import { prisma } from '@/lib/prisma'
import { billboardValidator } from '@/lib/validators'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

type Props = {
  params: {
    storeId: string
    billboardId: string
  }
}

export async function PATCH(request: Request, { params }: Props) {
  const { storeId, billboardId } = params

  try {
    const body = await request.json()
    const { label, imageUrl } = billboardValidator.parse(body)

    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // check if store exists
    const storeExists = await prisma.store.findUnique({
      where: { id: storeId, userId },
    })

    if (!storeExists) {
      return NextResponse.json(
        { message: 'Store with this id does not exist' },
        { status: 409 }
      )
    }

    // check if billboard  exists
    const billboardExists = await prisma.billboard.findUnique({
      where: { id: billboardId },
    })

    if (!billboardExists) {
      return NextResponse.json(
        { message: 'Billboard with this id does not exist' },
        { status: 409 }
      )
    }

    const billboard = await prisma.billboard.update({
      where: { id: billboardId },
      data: { label, imageUrl },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Could not update billboard at this time. Please try later' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Props) {
  const { storeId, billboardId } = params

  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // check if store exists
    const storeExists = await prisma.store.findUnique({
      where: { id: storeId, userId },
    })

    if (!storeExists) {
      return NextResponse.json(
        { message: 'Store with this id does not exist' },
        { status: 409 }
      )
    }

    // check if billboard  exists
    const billboardExists = await prisma.billboard.findUnique({
      where: { id: billboardId },
    })

    if (!billboardExists) {
      return NextResponse.json(
        { message: 'Billboard with this id does not exist' },
        { status: 409 }
      )
    }

    const billboard = await prisma.billboard.delete({
      where: { id: billboardId },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not delete billboard at this time. Please try later' },
      { status: 500 }
    )
  }
}
