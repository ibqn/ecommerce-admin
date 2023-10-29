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
import { ProductPayload, productValidator } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category, Image, Product } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImageUpload } from '@/components/image-upload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

type Props = {
  initialData?: Product & { images: Image[] }
  storeId: string
  categories: Category[]
}

type Params = {
  storeName: string
}

export const ProductForm = (props: Props) => {
  const { initialData, storeId, categories } = props

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const params = useParams<Params>()

  const title = useMemo(
    () => (initialData ? 'Edit product' : 'Create product'),
    [initialData]
  )
  const description = useMemo(
    () =>
      initialData
        ? 'Adjust existing product configuration'
        : 'Add a new product configuration',
    [initialData]
  )
  const toastSuccessMessage = useMemo(
    () =>
      initialData
        ? {
            title: 'Product updated',
            description: 'Product configuration was saved',
          }
        : {
            title: 'Product created',
            description: 'A new product was created',
          },
    [initialData]
  )
  const toastErrorMessage = useMemo(
    () =>
      initialData
        ? {
            title: 'Error while updating product',
            description: 'Could not update product. Please try again.',
          }
        : {
            title: 'Error while creating product',
            description: 'Could not create product. Please try again.',
          },
    [initialData]
  )

  const action = useMemo(
    () => (initialData ? 'Save changes' : 'Create'),
    [initialData]
  )

  const origin = useOrigin()

  const router = useRouter()

  const form = useForm<ProductPayload>({
    resolver: zodResolver(productValidator),
    defaultValues: {
      name: initialData?.name ?? '',
      images: initialData?.images ?? [],
      price: initialData?.price?.toNumber() ?? 0,
    },
  })

  const { mutate: createOrUpdateProduct } = useMutation({
    mutationFn: (data: ProductPayload) => {
      if (initialData) {
        return axios.patch(
          `/api/store/${storeId}/product/${initialData.id}`,
          data
        )
      }

      return axios.post(`/api/store/${storeId}/product`, data)
    },
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'Product does not exist',
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
      router.push(`/${params.storeName}/products`)

      toast({
        ...toastSuccessMessage,
        variant: 'green',
      })
    },
  })

  const onSubmit = form.handleSubmit((data: ProductPayload) => {
    setLoading(true)
    createOrUpdateProduct(data)
    setLoading(false)
  })

  const { mutate: deleteProduct } = useMutation({
    mutationFn: () =>
      axios.delete(`/api/store/${storeId}/product/${initialData?.id}`),
    onError: (error, variables, context) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: 'product does not exist',
          description: error.response?.data?.message,
          variant: 'yellow',
        })
      } else {
        toast({
          title: 'Error while deleting product',
          description: 'Could not delete product. Please try again.',
          variant: 'destructive',
        })
      }
    },
    onSuccess: (result, variables, context) => {
      router.refresh()
      router.push(`/${params.storeName}/products`)

      toast({
        title: 'Product deleted',
        description: `Product was deleted successfully`,
        variant: 'green',
      })
    },
  })

  const onDeletion = () => {
    setLoading(true)
    deleteProduct()
    setLoading(false)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        message={
          <>
            Do you really want to delete{' '}
            <span className="italic">{initialData?.name}</span> product?
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
            name="images"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange(
                        field.value.filter((image) => image.url !== url)
                      )
                    }
                  />
                </FormControl>

                <FormDescription>
                  These are images of your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      placeholder="Product name..."
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    This is your new product name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product price..."
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    This is the price of your product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                          placeholder="Select a category"
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {categories.map((category) => {
                          const { id, name } = category
                          return (
                            <SelectItem key={id} value={category.id}>
                              {name}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormDescription>
                    Select one of the existing categories.
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