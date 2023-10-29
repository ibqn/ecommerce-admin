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
import { BillboardPayload, billboardValidator } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Billboard } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImageUpload } from '@/components/image-upload'

type Props = {
  initialData?: Billboard
  storeId: string
}

type Params = {
  storeName: string
}

export const BillboardForm = (props: Props) => {
  const { initialData, storeId } = props

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const params = useParams<Params>()

  const title = useMemo(
    () => (initialData ? 'Edit billboard' : 'Create billboard'),
    [initialData]
  )
  const description = useMemo(
    () =>
      initialData
        ? 'Adjust existing billboard configuration'
        : 'Add a new billboard configuration',
    [initialData]
  )
  const toastSuccessMessage = useMemo(
    () =>
      initialData
        ? {
            title: 'Billboard updated',
            description: 'Billboard configuration was saved',
          }
        : {
            title: 'Billboard created',
            description: 'A new billboard was created',
          },
    [initialData]
  )
  const toastErrorMessage = useMemo(
    () =>
      initialData
        ? {
            title: 'Error while updating billboard',
            description: 'Could not update billboard. Please try again.',
          }
        : {
            title: 'Error while creating billboard',
            description: 'Could not create billboard. Please try again.',
          },
    [initialData]
  )

  const action = useMemo(
    () => (initialData ? 'Save changes' : 'Create'),
    [initialData]
  )

  const router = useRouter()

  const form = useForm<BillboardPayload>({
    resolver: zodResolver(billboardValidator),
    defaultValues: {
      label: initialData?.label ?? '',
      imageUrl: initialData?.imageUrl ?? '',
    },
  })

  const { mutate: createOrUpdateBillboard } = useMutation({
    mutationFn: (data: BillboardPayload) => {
      if (initialData) {
        return axios.patch(
          `/api/store/${storeId}/billboard/${initialData.id}`,
          data
        )
      }

      return axios.post(`/api/store/${storeId}/billboard`, data)
    },
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'Billboard does not exist',
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
      router.push(`/${params.storeName}/billboards`)

      toast({
        ...toastSuccessMessage,
        variant: 'green',
      })
    },
  })

  const onSubmit = form.handleSubmit((data: BillboardPayload) => {
    setLoading(true)
    createOrUpdateBillboard(data)
    setLoading(false)
  })

  const { mutate: deleteBillboard } = useMutation({
    mutationFn: () =>
      axios.delete(`/api/store/${storeId}/billboard/${initialData?.id}`),
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'billboard does not exist',
          description: error.response?.data?.message,
          variant: 'yellow',
        })
      } else {
        toast({
          title: 'Error while deleting billboard',
          description: 'Could not delete billboard. Please try again.',
          variant: 'destructive',
        })
      }
    },
    onSuccess: (result, variables, context) => {
      router.refresh()
      router.push(`/${params.storeName}/billboards`)

      toast({
        title: 'Billboard deleted',
        description: `Billboard was deleted successfully`,
        variant: 'green',
      })
    },
  })

  const onDeletion = () => {
    setLoading(true)
    deleteBillboard()
    setLoading(false)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        message={
          <>
            Do you really want to delete{' '}
            <span className="italic">{initialData?.label}</span> billboard?
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
          <FormField
            name="imageUrl"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>

                <FormDescription>
                  This is your background image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="label"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label..."
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    This is your new billboard label.
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
