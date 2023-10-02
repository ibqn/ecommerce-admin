import { prisma } from '@/lib/prisma'
import { storeValidator } from '@/lib/validators'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

type Props = {
  params: {
    storeId: string
  }
}

export async function PATCH(request: Request, { params }: Props) {
  const { storeId } = params

  try {
    const body = await request.json()
    const { name } = storeValidator.parse(body)

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

    const store = await prisma.store.update({
      where: { id: storeId, userId },
      data: {
        name,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { message: 'Could not update store at this time. Please try later' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Props) {
  const { storeId } = params

  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
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

    const store = await prisma.store.delete({ where: { id: storeId, userId } })

    return NextResponse.json(store)
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not delete store at this time. Please try later' },
      { status: 500 }
    )
  }
}
