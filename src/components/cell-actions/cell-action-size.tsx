'use client'

import { type SizeColumn } from '@/components/columns'
import { AlertModal } from '@/components/modals'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

type Props = {
  data: SizeColumn
}

type Params = {
  storeName: string
}

export const CellActionSize = (props: Props) => {
  const { data } = props

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const params = useParams<Params>()

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast({
      title: 'Copied',
      description: `Size ID copied to clipboard.`,
      variant: 'green',
    })
  }

  const { mutate: deleteSize } = useMutation({
    mutationFn: () =>
      axios.delete(`/api/store/${data.storeId}/size/${data.id}`),
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'Size does not exist',
          description: error.response?.data?.message,
          variant: 'yellow',
        })
      } else {
        toast({
          title: 'Error while deleting size',
          description: 'Could not delete size. Please try again.',
          variant: 'destructive',
        })
      }
    },
    onSuccess: (result, variables, context) => {
      setOpen(false)
      router.refresh()

      toast({
        title: 'Size deleted',
        description: `Size was deleted successfully`,
        variant: 'green',
      })
    },
  })

  const onDeletion = () => {
    setLoading(true)
    deleteSize()
    setLoading(false)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        message={
          <>
            Do you really want to delete{' '}
            <span className="italic">{data.name}</span> size?
          </>
        }
        onClose={() => setOpen(false)}
        onDeletion={onDeletion}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeName}/size/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-600 focus:text-red-500"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
