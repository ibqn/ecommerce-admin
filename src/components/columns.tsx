'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

export type BillboardColumn = {
  id: string
  label: string
  createdAt: Date
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const date = format(row.getValue('createdAt'), 'MMMM do, yyyy')
      return <div>{date}</div>
    },
  },
]
