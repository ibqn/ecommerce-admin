import { z } from 'zod'

export const sizeValidator = z.object({
  name: z.string().trim().min(1),
  value: z.string().trim().min(1),
})

export type SizePayload = z.infer<typeof sizeValidator>
