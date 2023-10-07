import { BillboardForm } from '@/components/forms'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: { billboardId: string; storeName: string }
}

export default async function Page({ params }: Props) {
  const { billboardId: id, storeName: name } = params

  const billboard = await prisma.billboard.findUnique({ where: { id } })

  if (!billboard) {
    notFound()
  }

  const store = await prisma.store.findUnique({ where: { name } })

  if (!store) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} storeId={store.id} />
      </div>
    </div>
  )
}
