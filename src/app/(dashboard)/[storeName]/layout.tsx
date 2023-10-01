import { Navbar } from '@/components/navbar'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs'
import { notFound, redirect } from 'next/navigation'
import { ReactNode } from 'react'

type Props = {
  params: { storeName: string }
  children: ReactNode
}

export default async function DashboardLayout({ children, params }: Props) {
  const { storeName: name } = params

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const storeExists = await prisma.store.findFirst({
    where: { userId, name },
  })

  if (!storeExists) {
    notFound()
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
