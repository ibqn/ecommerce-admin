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
import { useOrigin } from '@/hooks/use-origin'
import { BillboardPayload, billboardValidator } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Billboard } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImageUpload } from '../image-upload'

type Props = {
  initialData?: Billboard
}

export const BillboardForm = (props: Props) => {
  const { initialData } = props

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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
  const toastTitle = useMemo(
    () => (initialData ? 'Billboard updated' : 'Billboard created'),
    [initialData]
  )
  const toastMessage = useMemo(
    () =>
      initialData
        ? 'Billboard configuration was saved'
        : 'A new billboard was created',
    [initialData]
  )

  const action = useMemo(
    () => (initialData ? 'Save changes' : 'Create'),
    [initialData]
  )

  const origin = useOrigin()

  const router = useRouter()

  const form = useForm<BillboardPayload>({
    resolver: zodResolver(billboardValidator),
    defaultValues: {
      label: initialData?.label ?? '',
      imageUrl: initialData?.imageUrl ?? '',
    },
  })

  const { mutate: updateStore } = useMutation({
    mutationFn: (name: string) => axios.patch(`/api/store/`, { name }),
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'Store does not exist',
          description: error.response?.data?.message,
          variant: 'yellow',
        })
      } else {
        toast({
          title: 'Error while creating store',
          description: 'Could not update store. Please try again.',
          variant: 'destructive',
        })
      }
    },
    onSuccess: (result, variables, context) => {
      router.refresh()
      router.push(`/${result.data.name}/settings`)

      toast({
        title: 'Store updated',
        description: `Store was updated successfully`,
        variant: 'green',
      })
    },
  })

  const onSubmit = form.handleSubmit((data: BillboardPayload) => {
    setLoading(true)
    //todo
    setLoading(false)
  })

  const { mutate: deleteStore } = useMutation({
    mutationFn: () => axios.delete(`/api/store/`),
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'Store does not exist',
          description: error.response?.data?.message,
          variant: 'yellow',
        })
      } else {
        toast({
          title: 'Error while creating store',
          description: 'Could not delete store. Please try again.',
          variant: 'destructive',
        })
      }
    },
    onSuccess: (result, variables, context) => {
      router.refresh()
      router.push(`/`)

      toast({
        title: 'Store deleted',
        description: `Store was deleted successfully`,
        variant: 'green',
      })
    },
  })

  const onDeletion = () => {
    setLoading(true)
    deleteStore()
    setLoading(false)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        name={''}
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
