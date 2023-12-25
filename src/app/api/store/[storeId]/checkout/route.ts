import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkoutValidator } from '@/lib/validators/checkout'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

type Props = {
  params: {
    storeId: string
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: Request, { params }: Props) {
  const { storeId } = params

  try {
    const body = await request.json()

    const { productIds } = checkoutValidator.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Error on checkout occurred. Please try later' },
      { status: 500 }
    )
  }
}
