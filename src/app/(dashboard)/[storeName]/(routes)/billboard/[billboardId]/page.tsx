import { BillboardForm } from '@/components/forms'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: { billboardId: string }
}

export default async function Page({ params }: Props) {
  const { billboardId: id } = params

  const billboard = await prisma.billboard.findUnique({ where: { id } })

  if (!billboard) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  )
}
