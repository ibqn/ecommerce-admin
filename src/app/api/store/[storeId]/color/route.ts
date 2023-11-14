import { prisma } from '@/lib/prisma'
import { colorValidator } from '@/lib/validators'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

type Props = {
  params: {
    storeId: string
  }
}

export async function POST(request: Request, { params }: Props) {
  const { storeId } = params

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

    // check if color already exists
    const colorExists = await prisma.color.findUnique({
      where: { name_storeId: { name, storeId } },
    })

    if (colorExists) {
      return NextResponse.json(
        { message: 'Color with this name already exists' },
        { status: 409 }
      )
    }

    const color = await prisma.color.create({
      data: { name, value, storeId },
    })

    return NextResponse.json(color)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Could not create color at this time. Please try later' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request, { params }: Props) {
  const { storeId } = params

  try {
    // const { userId } = auth()

    // if (!userId) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    // }

    const colors = await prisma.color.findMany({
      where: { storeId },
    })

    return NextResponse.json(colors)
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Could not retrieve colors at this time. Please try later',
      },
      { status: 500 }
    )
  }
}
