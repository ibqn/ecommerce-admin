import { Dashboard } from '@/components/dashboard'
import { prisma } from '@/lib/prisma'

type Props = {
  params: { storeName: string }
}

export default async function Page({ params }: Props) {
  const { storeName: name } = params

  const store = await prisma.store.findUnique({ where: { name } })

  return (
    <div>
      <Dashboard name={store?.name} />
    </div>
  )
}
