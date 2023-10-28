import { z } from 'zod'

export const colorValidator = z.object({
  name: z.string().trim().min(1),
  value: z.string().trim().min(1),
})

export type ColorPayload = z.infer<typeof colorValidator>
