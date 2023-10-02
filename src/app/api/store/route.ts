import { prisma } from '@/lib/prisma'
import { storeValidator } from '@/lib/validators'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = storeValidator.parse(body)

    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // check if store already exists
    const storeExists = await prisma.store.findUnique({
      where: { name },
    })

    if (storeExists) {
      return NextResponse.json(
        { message: 'Store with this name already exists' },
        { status: 409 }
      )
    }

    const store = await prisma.store.create({
      data: {
        name,
        userId,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { message: 'Could not create store at this time. Please try later' },
      { status: 500 }
    )
  }
}
