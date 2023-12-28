import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkoutValidator } from '@/lib/validators/checkout'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'

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

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'USD',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price.toNumber() * 100,
        },
      })
    })

    const order = await prisma.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId) => ({
            product: { connect: { id: productId } },
          })),
        },
      },
    })

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=true`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=true`,
      metadata: { orderId: order.id },
    })

    return NextResponse.json({ url: session.url }, { headers: corsHeaders })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.message },
        { status: 400, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { message: 'Error on checkout occurred. Please try later' },
      { status: 500, headers: corsHeaders }
    )
  }
}
