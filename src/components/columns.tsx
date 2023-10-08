'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type BillboardColumn = {
  id: string
  label: string
  createdAt: Date
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Label
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = format(row.getValue('createdAt'), 'MMMM do, yyyy')
      return <div>{date}</div>
    },
  },
]
