import { ProductList } from '@/components/lists'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/utils/format'
import { notFound } from 'next/navigation'

type Props = {
  params: {
    storeName: string
  }
}

export default async function Page({ params }: Props) {
  const { storeName: name } = params

  const store = await prisma.store.findUnique({ where: { name } })

  if (!store) {
    notFound()
  }

  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    include: {
      color: true,
      size: true,
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const transformedProducts = products.map((product) => ({
    ...product,
    price: formatPrice(product.price.toNumber()),
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
  }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductList data={transformedProducts} storeId={store.id} />
      </div>
    </div>
  )
}
