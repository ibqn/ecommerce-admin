import { prisma } from '@/lib/prisma'
import { sizeValidator } from '@/lib/validators'
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

    // check if size already exists
    const sizeExists = await prisma.size.findUnique({
      where: { name },
    })

    if (sizeExists) {
      return NextResponse.json(
        { message: 'Size with this name already exists' },
        { status: 409 }
      )
    }

    const size = await prisma.size.create({
      data: { name, value, storeId },
    })

    return NextResponse.json(size)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Could not create size at this time. Please try later' },
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

    const sizes = await prisma.size.findMany({
      where: { storeId },
    })

    return NextResponse.json(sizes)
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Could not retrieve sizes at this time. Please try later',
      },
      { status: 500 }
    )
  }
}
