'use client'

import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/data-table'
import { orderColumns, type OrderColumn } from '@/components/columns'

type Props = {
  data: OrderColumn[]
}

export const OrderList = (props: Props) => {
  const { data } = props

  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />

      <Separator />

      <DataTable searchKey="products" columns={orderColumns} data={data} />
    </>
  )
}
