'use client'

import { Plus } from 'lucide-react'
import { Heading } from './heading'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { Billboard } from '@prisma/client'

type Props = {
  data: Billboard[]
}

type Params = {
  storeName: string
}

export const BillboardList = (props: Props) => {
  const { data } = props

  const router = useRouter()
  const params = useParams<Params>()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeName}/billboard/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <Separator />
    </>
  )
}
