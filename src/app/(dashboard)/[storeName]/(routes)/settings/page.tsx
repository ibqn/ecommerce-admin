import { prisma } from '@/lib/prisma'
import { SettingsForm } from './settings-form'
import { auth } from '@clerk/nextjs'
import { notFound, redirect } from 'next/navigation'

type Props = {
  params: { storeName: string }
}

export default async function Page({ params }: Props) {
  const { storeName: name } = params

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prisma.store.findFirst({ where: { name } })

  if (!store) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}
