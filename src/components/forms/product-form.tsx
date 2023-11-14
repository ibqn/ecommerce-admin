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
import { Category, Color, Image, Product, Size } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Plus, Trash } from 'lucide-react'
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
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

type TransformedProduct = Omit<Product, 'price'> & {
  images: Image[]
  price: number
}

type Props = {
  initialData?: TransformedProduct
  storeId: string
  categories: Category[]
  sizes: Size[]
  colors: Color[]
}

type Params = {
  storeName: string
}

export const ProductForm = (props: Props) => {
  const { initialData, storeId, categories, sizes, colors } = props

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

  const router = useRouter()

  const form = useForm<ProductPayload>({
    resolver: zodResolver(productValidator),
    defaultValues: {
      images: [],
      ...initialData,
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
      router.push(`/${params.storeName}/products`)
      router.refresh()

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
      router.push(`/${params.storeName}/products`)
      router.refresh()

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

            <FormField
              name="sizeId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    {sizes.length > 0 ? (
                      <Select
                        disabled={loading || !sizes.length}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a size"
                          />
                        </SelectTrigger>

                        <SelectContent>
                          {sizes.map((size) => {
                            const { id, name } = size
                            return (
                              <SelectItem key={id} value={size.id}>
                                {name}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-x-4">
                        <span className="text-sm text-muted-foreground">
                          No sizes yet created.
                        </span>
                        <Button
                          onClick={() =>
                            router.push(`/${params.storeName}/size/create`)
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add new
                        </Button>
                      </div>
                    )}
                  </FormControl>

                  <FormDescription>
                    Select one of the existing sizes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="colorId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                          placeholder="Select a color"
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {colors.map((color) => {
                          const { id, name } = color
                          return (
                            <SelectItem key={id} value={color.id}>
                              {name}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormDescription>
                    Select one of the existing colors.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured product</FormLabel>
                    <FormDescription>
                      This product will appear on the home page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived product</FormLabel>
                    <FormDescription>
                      This product will be archived and thus will not appear on
                      the page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
