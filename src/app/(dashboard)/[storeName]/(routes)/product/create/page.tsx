import { ProductForm } from '@/components/forms'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: { storeName: string }
}

export default async function Page({ params }: Props) {
  const { storeName: name } = params

  const store = await prisma.store.findUnique({ where: { name } })

  if (!store) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
  })

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm storeId={store.id} categories={categories} />
      </div>
    </div>
  )
}
