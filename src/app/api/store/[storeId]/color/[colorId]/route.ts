import { prisma } from '@/lib/prisma'
import { colorValidator } from '@/lib/validators'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

type Props = {
  params: {
    storeId: string
    colorId: string
  }
}

export async function PATCH(request: Request, { params }: Props) {
  const { storeId, colorId } = params

  try {
    const body = await request.json()
    const { name, value } = colorValidator.parse(body)

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

    // check if color exists
    const colorExists = await prisma.color.findUnique({
      where: { id: colorId },
    })

    if (!colorExists) {
      return NextResponse.json(
        { message: 'Color with this id does not exist' },
        { status: 409 }
      )
    }

    const color = await prisma.color.update({
      where: { id: colorId },
      data: { name, value },
    })

    return NextResponse.json(color)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Could not update color at this time. Please try later' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Props) {
  const { storeId, colorId } = params

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

    // check if color exists
    const colorExists = await prisma.color.findUnique({
      where: { id: colorId },
    })

    if (!colorExists) {
      return NextResponse.json(
        { message: 'Color with this id does not exist' },
        { status: 409 }
      )
    }

    const color = await prisma.color.delete({
      where: { id: colorId },
    })

    return NextResponse.json(color)
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not delete color at this time. Please try later' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request, { params }: Props) {
  const { storeId, colorId } = params

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

    // check if color exists
    const color = await prisma.color.findUnique({
      where: { id: colorId },
    })

    if (!color) {
      return NextResponse.json(
        { message: 'Color with this id does not exist' },
        { status: 409 }
      )
    }

    return NextResponse.json(color)
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not get color at this time. Please try later' },
      { status: 500 }
    )
  }
}
