import { Billboard } from '@/components/billboard'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {}

export default async function Page(props: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Billboard />
      </div>
    </div>
  )
}
