import { prisma } from '@/lib/prisma'
import { categoryValidator } from '@/lib/validators'
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
    const { name, billboardId } = categoryValidator.parse(body)

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

    // check if category already exists
    const categoryExists = await prisma.category.findUnique({
      where: { name },
    })

    if (categoryExists) {
      return NextResponse.json(
        { message: 'Category with this name already exists' },
        { status: 409 }
      )
    }

    const category = await prisma.category.create({
      data: { name, billboardId, storeId },
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Could not create category at this time. Please try later' },
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

    const categories = await prisma.category.findMany({
      where: { storeId },
      orderBy: {
        orderBy: 'asc',
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Could not retrieve categories at this time. Please try later',
      },
      { status: 500 }
    )
  }
}
