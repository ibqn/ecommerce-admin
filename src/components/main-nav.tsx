'use client'

import { cn } from '@/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { ComponentProps, useMemo } from 'react'

type Props = {} & ComponentProps<'div'>

export const MainNav = ({ className, ...props }: Props) => {
  const pathname = usePathname()
  const params = useParams()

  const routes = useMemo(
    () => [
      {
        href: `/${params.storeName}`,
        label: 'Overview',
      },
      {
        href: `/${params.storeName}/billboards`,
        label: 'Billboards',
      },
      {
        href: `/${params.storeName}/categories`,
        label: 'Categories',
      },
      {
        href: `/${params.storeName}/sizes`,
        label: 'Sizes',
      },
      {
        href: `/${params.storeName}/settings`,
        label: 'Settings',
      },
    ],
    [params.storeName]
  )

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {routes.map((route, index) => {
        const { label, href } = route
        return (
          <Link
            key={index}
            href={href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === href
                ? 'text-black dark:text-white'
                : 'text-muted-foreground'
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
