'use client'

import { useStoreModal } from '@/hooks/use-store-modal'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  name: string
}

export const Dashboard = ({ name }: Props) => {
  const onClose = useStoreModal((state) => state.onClose)
  const onOpen = useStoreModal((state) => state.onOpen)
  const isOpen = useStoreModal((state) => state.isOpen)

  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [])

  return (
    <div className="flex items-center gap-4 p-4">
      dashboard {name}
      <Button onClick={onOpen}>open</Button>
    </div>
  )
}
