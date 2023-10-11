import { prisma } from '@/lib/prisma'
import { billboardValidator } from '@/lib/validators'
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

    // check if billboard already exists
    const billboardExists = await prisma.billboard.findUnique({
      where: { label },
    })

    if (billboardExists) {
      return NextResponse.json(
        { message: 'Billboard with this name already exists' },
        { status: 409 }
      )
    }

    const billboard = await prisma.billboard.create({
      data: { label, imageUrl, storeId },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Could not create billboard at this time. Please try later' },
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

    const billboards = await prisma.billboard.findMany({
      where: { storeId },
    })

    return NextResponse.json(billboards)
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Could not retrieve billboards at this time. Please try later',
      },
      { status: 500 }
    )
  }
}
