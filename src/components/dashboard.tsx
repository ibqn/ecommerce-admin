'use client'

import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, DollarSign, Package } from 'lucide-react'
import { formatPrice } from '@/utils/format'

type Props = {
  name: string
}

export const Dashboard = ({ name }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center justify-between space-y-0 pb-2 text-sm font-medium">
                <span>Total Revenue</span>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(100)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center justify-between space-y-0 pb-2 text-sm font-medium">
                <span>Sales</span>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{'+25'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center justify-between space-y-0 pb-2 text-sm font-medium">
                <span>Products in Stock</span>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{'17'}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
