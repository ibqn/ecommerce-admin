import { z } from 'zod'

export const billboardValidator = z.object({
  label: z.string().trim().min(1),
  imageUrl: z.string(),
})

export type BillboardPayload = z.infer<typeof billboardValidator>
