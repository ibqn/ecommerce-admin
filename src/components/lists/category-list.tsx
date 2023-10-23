'use client'

import { Plus } from 'lucide-react'
import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import { CategoryColumn, categoryColumns } from '@/components/columns'
import { ApiList } from '@/components/api-list'

type Props = {
  data: CategoryColumn[]
  storeId: string
}

type Params = {
  storeName: string
}

export const CategoryList = (props: Props) => {
  const { data, storeId } = props

  const router = useRouter()
  const params = useParams<Params>()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeName}/category/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="label" columns={categoryColumns} data={data} />

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
