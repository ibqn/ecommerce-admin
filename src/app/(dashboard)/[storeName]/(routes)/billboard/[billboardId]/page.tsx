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

  return <div className="flex flex-col">billboard {id}</div>
}
