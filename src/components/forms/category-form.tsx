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
import { CategoryPayload, categoryValidator } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Billboard, Category } from '@prisma/client'
import { Select } from '@radix-ui/react-select'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {
  initialData?: Category
  storeId: string
  billboards: Billboard[]
}

type Params = {
  storeName: string
}

export const CategoryForm = (props: Props) => {
  const { initialData, storeId, billboards } = props

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const params = useParams<Params>()

  const title = useMemo(
    () => (initialData ? 'Edit category' : 'Create category'),
    [initialData]
  )
  const description = useMemo(
    () =>
      initialData
        ? 'Adjust existing category configuration'
        : 'Add a new category configuration',
    [initialData]
  )
  const toastSuccessMessage = useMemo(
    () =>
      initialData
        ? {
            title: 'Category updated',
            description: 'Category configuration was saved',
          }
        : {
            title: 'Category created',
            description: 'A new category was created',
          },
    [initialData]
  )
  const toastErrorMessage = useMemo(
    () =>
      initialData
        ? {
            title: 'Error while updating Category',
            description: 'Could not update category. Please try again.',
          }
        : {
            title: 'Error while creating category',
            description: 'Could not create category. Please try again.',
          },
    [initialData]
  )

  const action = useMemo(
    () => (initialData ? 'Save changes' : 'Create'),
    [initialData]
  )

  const router = useRouter()

  const form = useForm<CategoryPayload>({
    resolver: zodResolver(categoryValidator),
    defaultValues: {
      name: initialData?.name ?? '',
      billboardId: initialData?.billboardId ?? '',
    },
  })

  const { mutate: createOrUpdateCategory } = useMutation({
    mutationFn: (data: CategoryPayload) => {
      if (initialData) {
        return axios.patch(
          `/api/store/${storeId}/category/${initialData.id}`,
          data
        )
      }

      return axios.post(`/api/store/${storeId}/category`, data)
    },
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: "Could't create Category",
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
      router.push(`/${params.storeName}/categories`)
      router.refresh()

      toast({
        ...toastSuccessMessage,
        variant: 'green',
      })
    },
  })

  const onSubmit = form.handleSubmit((data: CategoryPayload) => {
    setLoading(true)
    createOrUpdateCategory(data)
    setLoading(false)
  })

  const { mutate: deleteCategory } = useMutation({
    mutationFn: () =>
      axios.delete(`/api/store/${storeId}/category/${initialData?.id}`),
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'Category does not exist',
          description: error.response?.data?.message,
          variant: 'yellow',
        })
      } else {
        toast({
          title: 'Error while deleting category',
          description: 'Could not delete category. Please try again.',
          variant: 'destructive',
        })
      }
    },
    onSuccess: (result, variables, context) => {
      router.push(`/${params.storeName}/categories`)
      router.refresh()

      toast({
        title: 'Category deleted',
        description: `Category was deleted successfully`,
        variant: 'green',
      })
    },
  })

  const onDeletion = () => {
    setLoading(true)
    deleteCategory()
    setLoading(false)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        message={
          <>
            Do you really want to delete{' '}
            <span className="italic">{initialData?.name}</span> category?
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
                      placeholder="Category name..."
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    This is your new category name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="billboardId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {billboards.map((billboard) => {
                          const { id, label } = billboard
                          return (
                            <SelectItem key={id} value={billboard.id}>
                              {label}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormDescription>
                    Select one of the existing billboards.
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
