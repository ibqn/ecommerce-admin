import Stripe from 'stripe'

function getStripeApiKey() {
  const stripeKey = process.env.STRIPE_API_KEY

  if (!stripeKey) {
    throw new Error('Missing STRIPE_API_KEY')
  }

  return stripeKey
}

export const stripe = new Stripe(getStripeApiKey(), {
  apiVersion: '2023-10-16',
  typescript: true,
})
