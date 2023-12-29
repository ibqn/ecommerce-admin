import { prisma } from '@/lib/prisma'
import { type GraphData } from '@/type'
import { getMonthName } from '@/utils/month-name'

export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prisma.order.findMany({
    where: { storeId, isPaid: true },
    include: { orderItems: { include: { product: true } } },
  })

  const monthlyRevenue: { [key: number]: number } = {}

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth()
    let revenueForOrder = 0

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber()
    }

    monthlyRevenue[month] = (monthlyRevenue[month] ?? 0) + revenueForOrder
  }

  const monthNames = Array.from({ length: 12 }, (_, index) =>
    getMonthName(index)
  )

  const graphData: GraphData[] = monthNames.map((monthName, index) => ({
    name: monthName,
    total: monthlyRevenue[index] ?? 0,
  }))

  return graphData
}
