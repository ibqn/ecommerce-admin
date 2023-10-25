import { CategoryForm } from '@/components/forms'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: { categoryId: string; storeName: string }
}

export default async function Page({ params }: Props) {
  const { categoryId: id, storeName: name } = params

  const category = await prisma.category.findUnique({ where: { id } })

  if (!category) {
    notFound()
  }

  const store = await prisma.store.findUnique({ where: { name } })

  if (!store) {
    notFound()
  }

  const billboards = await prisma.billboard.findMany({
    where: { storeId: store.id },
  })

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm
          initialData={category}
          storeId={store.id}
          billboards={billboards}
        />
      </div>
    </div>
  )
}
