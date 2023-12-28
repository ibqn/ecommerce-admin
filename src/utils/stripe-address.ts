import Stripe from 'stripe'

export const addressToString = (address?: Stripe.Address | null) => {
  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ]

  const addressString = addressComponents.filter(Boolean).join(', ')

  return addressString
}
