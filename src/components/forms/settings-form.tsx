'use client'

import { ApiCallout } from '@/components/api-callout'
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
import { StorePayload, storeValidator } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Store } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  initialData: Store
}

export const SettingsForm = (props: Props) => {
  const { initialData } = props

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const origin = useOrigin()
  const router = useRouter()

  const form = useForm<StorePayload>({
    resolver: zodResolver(storeValidator),
    defaultValues: {
      name: initialData.name,
    },
  })

  const { mutate: updateStore } = useMutation({
    mutationFn: (name: string) =>
      axios.patch(`/api/store/${initialData.id}`, { name }),
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
      router.push(`/${result.data.name}/settings`)
      router.refresh()

      toast({
        title: 'Store updated',
        description: `Store was updated successfully`,
        variant: 'green',
      })
    },
  })

  const onSubmit = form.handleSubmit(({ name }: StorePayload) => {
    setLoading(true)
    updateStore(name)
    setLoading(false)
  })

  const { mutate: deleteStore } = useMutation({
    mutationFn: () => axios.delete(`/api/store/${initialData.id}`),
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'Store does not exist',
          description: error.response?.data?.message,
          variant: 'yellow',
        })
      } else {
        toast({
          title: 'Error while deleting store',
          description: 'Could not delete store. Please try again.',
          variant: 'destructive',
        })
      }
    },
    onSuccess: (result, variables, context) => {
      router.push(`/`)
      router.refresh()

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
        message={
          <>
            Do you really want to delete{' '}
            <span className="italic">{initialData.name}</span> store?
          </>
        }
        onClose={() => setOpen(false)}
        onDeletion={onDeletion}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store settings" />

        <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
          <Trash className="h4 w-4" />
        </Button>
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
                      placeholder="Store name..."
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    This is your new store name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} type="submit">
            Save changes
          </Button>
        </form>
      </Form>

      <Separator />

      <ApiCallout
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${initialData.name}`}
        variant="public"
      />
    </>
  )
}
