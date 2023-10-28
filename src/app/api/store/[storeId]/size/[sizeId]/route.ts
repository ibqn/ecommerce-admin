import { prisma } from '@/lib/prisma'
import { sizeValidator } from '@/lib/validators'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

type Props = {
  params: {
    storeId: string
    sizeId: string
  }
}

export async function PATCH(request: Request, { params }: Props) {
  const { storeId, sizeId } = params

  try {
    const body = await request.json()
    const { name, value } = sizeValidator.parse(body)

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

    // check if size exists
    const sizeExists = await prisma.size.findUnique({
      where: { id: sizeId },
    })

    if (!sizeExists) {
      return NextResponse.json(
        { message: 'Size with this id does not exist' },
        { status: 409 }
      )
    }

    const size = await prisma.size.update({
      where: { id: sizeId },
      data: { name, value },
    })

    return NextResponse.json(size)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Could not update size at this time. Please try later' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Props) {
  const { storeId, sizeId } = params

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

    // check if size exists
    const sizeExists = await prisma.size.findUnique({
      where: { id: sizeId },
    })

    if (!sizeExists) {
      return NextResponse.json(
        { message: 'Size with this id does not exist' },
        { status: 409 }
      )
    }

    const size = await prisma.size.delete({
      where: { id: sizeId },
    })

    return NextResponse.json(size)
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not delete size at this time. Please try later' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request, { params }: Props) {
  const { storeId, sizeId } = params

  try {
    // const { userId } = auth()

    // if (!userId) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    // }

    // check if store exists
    const storeExists = await prisma.store.findUnique({
      where: { id: storeId },
    })

    if (!storeExists) {
      return NextResponse.json(
        { message: 'Store with this id does not exist' },
        { status: 409 }
      )
    }

    // check if size exists
    const size = await prisma.size.findUnique({
      where: { id: sizeId },
    })

    if (!size) {
      return NextResponse.json(
        { message: 'Size with this id does not exist' },
        { status: 409 }
      )
    }

    return NextResponse.json(size)
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not get size at this time. Please try later' },
      { status: 500 }
    )
  }
}
