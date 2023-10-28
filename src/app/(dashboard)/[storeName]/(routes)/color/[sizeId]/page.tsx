import { ColorForm } from '@/components/forms'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: {
    colorId: string
    storeName: string
  }
}

export default async function Page({ params }: Props) {
  const { colorId: id, storeName: name } = params

  const color = await prisma.color.findUnique({ where: { id } })

  if (!color) {
    notFound()
  }

  const store = await prisma.store.findUnique({ where: { name } })

  if (!store) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} storeId={store.id} />
      </div>
    </div>
  )
}
