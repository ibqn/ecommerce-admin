import { z } from 'zod'

export const categoryValidator = z.object({
  name: z.string().trim().min(1),
  billboardId: z.string().min(1),
})

export type CategoryPayload = z.infer<typeof categoryValidator>
