import { ProductForm } from '@/components/forms'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: {
    productId: string
    storeName: string
  }
}

export default async function Page({ params }: Props) {
  const { productId: id, storeName: name } = params

  const store = await prisma.store.findUnique({ where: { name } })

  if (!store) {
    notFound()
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  })

  if (!product) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
  })

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          storeId={store.id}
          categories={categories}
        />
      </div>
    </div>
  )
}
