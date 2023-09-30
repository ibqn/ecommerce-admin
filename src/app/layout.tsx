import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import { StoreModal } from '@/components/modals/store-modal'
import { ReactNode } from 'react'
import Providers from '@/lib/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}

type Props = {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <Providers>
            <StoreModal />
            {children}
            <Toaster />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
