import { prisma } from '@/lib/prisma'
import { productValidator } from '@/lib/validators'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import qs from 'query-string'

type Props = {
  params: {
    storeId: string
  }
}

export async function POST(request: Request, { params }: Props) {
  const { storeId } = params

  try {
    const body = await request.json()
    const {
      name,
      categoryId,
      images,
      price,
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

    // check if product already exists
    const productExists = await prisma.product.findUnique({
      where: { name },
    })

    if (productExists) {
      return NextResponse.json(
        { message: 'Product with this name already exists' },
        { status: 409 }
      )
    }

    const product = await prisma.product.create({
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
          createMany: {
            data: images,
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Could not create product at this time. Please try later' },
      { status: 500 }
    )
  }
}

type Query = {
  categoryId: string
  sizeId: string
  colorId: string
  isFeatured: boolean
  isArchived: boolean
}

export async function GET(request: Request, { params }: Props) {
  const { storeId } = params

  try {
    // const { userId } = auth()

    // if (!userId) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)

    const { categoryId, sizeId, colorId, isFeatured, isArchived } = qs.parse(
      request.url,
      { parseBooleans: true }
    ) as Query

    const products = await prisma.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Could not retrieve products at this time. Please try later',
      },
      { status: 500 }
    )
  }
}
