'use client'

import { Plus } from 'lucide-react'
import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { Billboard } from '@prisma/client'
import { DataTable } from '@/components/data-table'
import { columns } from '@/components/columns'
import { ApiList } from '@/components/api-list'

type Props = {
  data: Billboard[]
  storeId: string
}

type Params = {
  storeName: string
}

export const BillboardList = (props: Props) => {
  const { data, storeId } = props

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

      <DataTable searchKey="label" columns={columns} data={data} />

      <Heading title="API" description="API calls for billboards" />
      <Separator />

      <ApiList
        storeId={storeId}
        entityName="billboard"
        entityIdName="billboardId"
      />
    </>
  )
}
