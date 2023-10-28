'use client'

import { Plus } from 'lucide-react'
import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { Size } from '@prisma/client'
import { DataTable } from '@/components/data-table'
import { colorColumns } from '@/components/columns'
import { ApiList } from '@/components/api-list'

type Props = {
  data: Size[]
  storeId: string
}

type Params = {
  storeName: string
}

export const ColorList = (props: Props) => {
  const { data, storeId } = props

  const router = useRouter()
  const params = useParams<Params>()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage colors for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeName}/color/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="name" columns={colorColumns} data={data} />

      <Heading title="API" description="API calls for colors" />
      <Separator />

      <ApiList storeId={storeId} entityName="color" entityIdName="colorId" />
    </>
  )
}
