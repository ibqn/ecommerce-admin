import { SizeForm } from '@/components/forms'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: {
    sizeId: string
    storeName: string
  }
}

export default async function Page({ params }: Props) {
  const { sizeId: id, storeName: name } = params

  const size = await prisma.size.findUnique({ where: { id } })

  if (!size) {
    notFound()
  }

  const store = await prisma.store.findUnique({ where: { name } })

  if (!store) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} storeId={store.id} />
      </div>
    </div>
  )
}
