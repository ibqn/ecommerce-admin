import { z } from 'zod'

export const productValidator = z.object({
  name: z.string().trim().min(1),
  images: z.object({ url: z.string().min(1) }).array(),
  price: z.coerce.number().min(0),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
})

export type ProductPayload = z.infer<typeof productValidator>
