import { prisma } from '@/lib/prisma'
import { billboardValidator, categoryValidator } from '@/lib/validators'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

type Props = {
  params: {
    storeId: string
    categoryId: string
  }
}

export async function PATCH(request: Request, { params }: Props) {
  const { storeId, categoryId } = params

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

    // check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!categoryExists) {
      return NextResponse.json(
        { message: 'Category with this id does not exist' },
        { status: 409 }
      )
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name, billboardId },
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Could not update category at this time. Please try later' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Props) {
  const { storeId, categoryId } = params

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

    // check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!categoryExists) {
      return NextResponse.json(
        { message: 'Category with this id does not exist' },
        { status: 409 }
      )
    }

    const category = await prisma.category.delete({
      where: { id: categoryId },
    })

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not delete category at this time. Please try later' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request, { params }: Props) {
  const { storeId, categoryId } = params

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

    // check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { message: 'Category with this id does not exist' },
        { status: 409 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not get category at this time. Please try later' },
      { status: 500 }
    )
  }
}
