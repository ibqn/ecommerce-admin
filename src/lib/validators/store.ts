import { z } from 'zod'

export const storeValidator = z.object({
  name: z.string().min(1),
})

export type StorePayload = z.infer<typeof storeValidator>
