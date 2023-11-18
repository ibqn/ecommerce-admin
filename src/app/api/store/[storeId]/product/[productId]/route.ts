import { prisma } from '@/lib/prisma'
import { productValidator } from '@/lib/validators'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

type Props = {
  params: {
    storeId: string
    productId: string
  }
}

export async function PATCH(request: Request, { params }: Props) {
  const { storeId, productId } = params

  try {
    const body = await request.json()
    const {
      name,
      images,
      price,
      categoryId,
      colorId,
      sizeId,
      isArchived,
      isFeatured,
    } = productValidator.parse(body)

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

    // check if product exists
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!productExists) {
      return NextResponse.json(
        { message: 'Product with this id does not exist' },
        { status: 409 }
      )
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        images: {
          deleteMany: {},
        },
      },
    })

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        storeId,
        images: {
          createMany: { data: images.map((url) => url) },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Could not update product at this time. Please try later' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Props) {
  const { storeId, productId } = params

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

    // check if product exists
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!productExists) {
      return NextResponse.json(
        { message: 'Product with this id does not exist' },
        { status: 409 }
      )
    }

    const product = await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not delete product at this time. Please try later' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request, { params }: Props) {
  const { storeId, productId } = params

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

    // check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        size: true,
        color: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Product with this id does not exist' },
        { status: 409 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not get product at this time. Please try later' },
      { status: 500 }
    )
  }
}
