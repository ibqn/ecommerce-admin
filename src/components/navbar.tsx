import { UserButton, auth } from '@clerk/nextjs'
import { MainNav } from '@/components/main-nav'
import { StoreSwitcher } from '@/components/store-switcher'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

type Props = {}

export const Navbar = async (props: Props) => {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const stores = await prisma.store.findMany({
    where: { userId },
  })

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />

        <MainNav className="mx-6" />

        <div className="ml-auto flex items-center">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}
