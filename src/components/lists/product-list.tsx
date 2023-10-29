'use client'

import { Plus } from 'lucide-react'
import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import { ProductColumn, productColumns } from '@/components/columns'
import { ApiList } from '@/components/api-list'

type Props = {
  data: ProductColumn[]
  storeId: string
}

type Params = {
  storeName: string
}

export const ProductList = (props: Props) => {
  const { data, storeId } = props

  const router = useRouter()
  const params = useParams<Params>()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage Products for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeName}/product/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="name" columns={productColumns} data={data} />

      <Heading title="API" description="API calls for Products" />
      <Separator />

      <ApiList
        storeId={storeId}
        entityName="product"
        entityIdName="productId"
      />
    </>
  )
}
