'use client'

import { Modal } from '@/components/modal'
import { useStoreModal } from '@/hooks/use-store-modal'
import { storeValidator, type StorePayload } from '@/lib/validators'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

type Props = {}

export const StoreModal = (props: Props) => {
  const [loading, setLoading] = useState(false)

  const storeModal = useStoreModal()

  const form = useForm<StorePayload>({
    resolver: zodResolver(storeValidator),
    defaultValues: {
      name: '',
    },
  })

  const router = useRouter()

  const { mutate: createStore } = useMutation({
    mutationFn: (name: string) => axios.post(`/api/store`, { name }),
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'Store already exists',
          description: error.response?.data?.message,
          variant: 'yellow',
        })
      } else {
        toast({
          title: 'Error while creating store',
          description: 'Your store was not created. Please try again.',
          variant: 'destructive',
        })
      }
    },
    onSuccess: (result, variables, context) => {
      router.replace(`/${result.data.name}`)

      toast({
        title: 'New store created',
        description: `Store was created successfully`,
        variant: 'green',
      })
    },
  })

  const onSubmit = form.handleSubmit(({ name }: StorePayload) => {
    setLoading(true)
    createStore(name)
    setLoading(false)
  })

  return (
    <Modal
      title="Create New Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-4 pb-4">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="E-Commerce"
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

            <div className="flex w-full items-center justify-end space-x-2 pt-6">
              <Button
                disabled={loading}
                variant="outline"
                onClick={storeModal.onClose}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  )
}
