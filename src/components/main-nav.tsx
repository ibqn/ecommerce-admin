'use client'

import { cn } from '@/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

type Props = {} & ComponentProps<'div'>

export const MainNav = ({ className, ...props }: Props) => {
  const pathname = usePathname()
  const params = useParams()

  const routes = [
    {
      href: `/${params.storeName}/settings`,
      label: 'Settings',
      active: pathname === `/${params.storeName}/settings`,
    },
  ]

  return (
    <nav className={cn('flex items-center px-4 lg:p-6', className)} {...props}>
      {routes.map((route, index) => {
        const { label, href, active } = route
        return (
          <Link
            key={index}
            href={href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              active ? 'text-black dark:text-white' : 'text-muted-foreground'
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}