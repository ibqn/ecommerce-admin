'use client'

import { useStoreModal } from '@/hooks/use-store-modal'
import { UserButton } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function SetupPage() {
  const onOpen = useStoreModal((state) => state.onOpen)
  const isOpen = useStoreModal((state) => state.isOpen)

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [onOpen, isOpen])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <p>admin dashboard</p>
      <div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </main>
  )
}
