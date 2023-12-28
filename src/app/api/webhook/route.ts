import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { addressToString } from '@/utils/stripe-address'
import { prisma } from '@/lib/prisma'

function getStripeWebhookSecret() {
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeWebhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET')
  }

  return stripeWebhookSecret
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('Stripe-Signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Signature is not present' },
      { status: 500 }
    )
  }

  const secret = getStripeWebhookSecret()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (error: any) {
    return NextResponse.json(
      { error: `Webhook error ${error?.message}` },
      { status: 400 }
    )
  }

  const session = event.data.object as Stripe.Checkout.Session
  const address = session?.customer_details?.address

  const addressString = addressToString(address)

  if (event.type === 'checkout.session.completed') {
    const order = await prisma.order.update({
      where: { id: session?.metadata?.orderId },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone ?? '',
      },
      include: {
        orderItems: true,
      },
    })

    const productIds = order.orderItems.map((orderItem) => orderItem.productId)

    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { isArchived: true },
    })
  }

  return NextResponse.json({ success: true })
}
