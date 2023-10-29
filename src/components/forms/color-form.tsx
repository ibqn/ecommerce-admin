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
import { ColorPayload, colorValidator } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Color } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  initialData?: Color
  storeId: string
}

type Params = {
  storeName: string
}

export const ColorForm = (props: Props) => {
  const { initialData, storeId } = props

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const params = useParams<Params>()

  const title = useMemo(
    () => (initialData ? 'Edit color' : 'Create color'),
    [initialData]
  )
  const description = useMemo(
    () =>
      initialData
        ? 'Adjust existing color configuration'
        : 'Add a new color configuration',
    [initialData]
  )
  const toastSuccessMessage = useMemo(
    () =>
      initialData
        ? {
            title: 'Color updated',
            description: 'Color configuration was saved',
          }
        : {
            title: 'Color created',
            description: 'A new color was created',
          },
    [initialData]
  )
  const toastErrorMessage = useMemo(
    () =>
      initialData
        ? {
            title: 'Error while updating color',
            description: 'Could not update color. Please try again.',
          }
        : {
            title: 'Error while creating color',
            description: 'Could not create color. Please try again.',
          },
    [initialData]
  )

  const action = useMemo(
    () => (initialData ? 'Save changes' : 'Create'),
    [initialData]
  )

  const router = useRouter()

  const form = useForm<ColorPayload>({
    resolver: zodResolver(colorValidator),
    defaultValues: {
      name: initialData?.name ?? '',
      value: initialData?.value ?? '',
    },
  })

  const { mutate: createOrUpdateColor } = useMutation({
    mutationFn: (data: ColorPayload) => {
      if (initialData) {
        return axios.patch(
          `/api/store/${storeId}/color/${initialData.id}`,
          data
        )
      }

      return axios.post(`/api/store/${storeId}/color`, data)
    },
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'Color does not exist',
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
      router.push(`/${params.storeName}/colors`)

      toast({
        ...toastSuccessMessage,
        variant: 'green',
      })
    },
  })

  const onSubmit = form.handleSubmit((data: ColorPayload) => {
    setLoading(true)
    createOrUpdateColor(data)
    setLoading(false)
  })

  const { mutate: deleteColor } = useMutation({
    mutationFn: () =>
      axios.delete(`/api/store/${storeId}/color/${initialData?.id}`),
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'color does not exist',
          description: error.response?.data?.message,
          variant: 'yellow',
        })
      } else {
        toast({
          title: 'Error while deleting color',
          description: 'Could not delete color. Please try again.',
          variant: 'destructive',
        })
      }
    },
    onSuccess: (result, variables, context) => {
      router.refresh()
      router.push(`/${params.storeName}/colors`)

      toast({
        title: 'Color deleted',
        description: `Color was deleted successfully`,
        variant: 'green',
      })
    },
  })

  const onDeletion = () => {
    setLoading(true)
    deleteColor()
    setLoading(false)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        message={
          <>
            Do you really want to delete{' '}
            <span className="italic">{initialData?.name}</span> color?
          </>
        }
        onClose={() => setOpen(false)}
        onDeletion={onDeletion}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant="destructive"
            color="sm"
            onClick={() => setOpen(true)}
          >
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
                      placeholder="Color name..."
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    This is your new color name.
                  </FormDescription>
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
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color value..."
                        {...field}
                      />
                      <div
                        className="rounded-full border p-4"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>

                  <FormDescription>
                    This is your new color value.
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
