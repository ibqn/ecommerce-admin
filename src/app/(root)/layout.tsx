import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default async function DashboardLayout({ children }: Props) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const storeExists = await prisma.store.findFirst({
    where: { userId },
  })

  if (storeExists) {
    redirect(`/${storeExists.name}`)
  }

  return <>{children}</>
}
