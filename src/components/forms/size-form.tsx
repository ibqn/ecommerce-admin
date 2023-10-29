'use client'

import { Heading } from '@/components/heading'
import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { SizePayload, sizeValidator } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Size } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  initialData?: Size
  storeId: string
}

type Params = {
  storeName: string
}

export const SizeForm = (props: Props) => {
  const { initialData, storeId } = props

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const params = useParams<Params>()

  const title = useMemo(
    () => (initialData ? 'Edit size' : 'Create size'),
    [initialData]
  )
  const description = useMemo(
    () =>
      initialData
        ? 'Adjust existing size configuration'
        : 'Add a new size configuration',
    [initialData]
  )
  const toastSuccessMessage = useMemo(
    () =>
      initialData
        ? {
            title: 'Size updated',
            description: 'Size configuration was saved',
          }
        : {
            title: 'Size created',
            description: 'A new size was created',
          },
    [initialData]
  )
  const toastErrorMessage = useMemo(
    () =>
      initialData
        ? {
            title: 'Error while updating size',
            description: 'Could not update size. Please try again.',
          }
        : {
            title: 'Error while creating size',
            description: 'Could not create size. Please try again.',
          },
    [initialData]
  )

  const action = useMemo(
    () => (initialData ? 'Save changes' : 'Create'),
    [initialData]
  )

  const router = useRouter()

  const form = useForm<SizePayload>({
    resolver: zodResolver(sizeValidator),
    defaultValues: {
      name: initialData?.name ?? '',
      value: initialData?.value ?? '',
    },
  })

  const { mutate: createOrUpdateSize } = useMutation({
    mutationFn: (data: SizePayload) => {
      if (initialData) {
        return axios.patch(`/api/store/${storeId}/size/${initialData.id}`, data)
      }

      return axios.post(`/api/store/${storeId}/size`, data)
    },
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'Size does not exist',
          description: error.response?.data?.message,
          variant: 'yellow',
        })
      } else {
        toast({
          ...toastErrorMessage,
          variant: 'destructive',
        })
      }
    },
    onSuccess: (result, variables, context) => {
      router.refresh()
      router.push(`/${params.storeName}/sizes`)

      toast({
        ...toastSuccessMessage,
        variant: 'green',
      })
    },
  })

  const onSubmit = form.handleSubmit((data: SizePayload) => {
    setLoading(true)
    createOrUpdateSize(data)
    setLoading(false)
  })

  const { mutate: deleteSize } = useMutation({
    mutationFn: () =>
      axios.delete(`/api/store/${storeId}/size/${initialData?.id}`),
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'size does not exist',
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
      router.refresh()
      router.push(`/${params.storeName}/sizes`)

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
            <span className="italic">{initialData?.name}</span> size?
          </>
        }
        onClose={() => setOpen(false)}
        onDeletion={onDeletion}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
            <Trash className="h4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={onSubmit} className="w-full space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size name..."
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>This is your new size name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="value"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size value..."
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    This is your new size value.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
    </>
  )
}
