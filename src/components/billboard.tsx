'use client'

import { Plus } from 'lucide-react'
import { Heading } from './heading'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { useParams, useRouter } from 'next/navigation'

type Props = {}

export const Billboard = (props: Props) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Billboards"
          description="Manage billboards for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeName}/billboard/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <Separator />
    </>
  )
}
