import { z } from 'zod'

export const checkoutValidator = z.object({
  productIds: z.array(z.string().trim().min(1)),
})

export type CheckoutPayload = z.infer<typeof checkoutValidator>
