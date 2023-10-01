import { z } from 'zod'

export const storeValidator = z.object({
  name: z.string().trim().min(1),
})

export type StorePayload = z.infer<typeof storeValidator>
