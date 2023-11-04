import { OrderList } from '@/components/lists'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: {
    storeName: string
  }
}

export default async function Page({ params }: Props) {
  const { storeName: name } = params

  const store = await prisma.store.findUnique({ where: { name } })

  if (!store) {
    notFound()
  }

  const orders = await prisma.order.findMany({
    where: { storeId: store.id },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const transformedOrders = orders.map((order) => ({
    ...order,
    products: order.orderItems.map(({ product }) => product.name),
    totalPrice: order.orderItems.reduce(
      (total, { product }) => total + Number(product.price),
      0
    ),
  }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderList data={transformedOrders} />
      </div>
    </div>
  )
}
