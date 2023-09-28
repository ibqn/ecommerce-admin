'use client'

import { PropsWithChildren, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Props = {
  title: string
  description: string
  isOpen: boolean
  onClose: () => void
}

export const Modal = (props: PropsWithChildren<Props>) => {
  const { isOpen, onClose, title, description, children } = props

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose()
      }
    },
    [onClose]
  )

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div>{children}</div>
      </DialogContent>
    </Dialog>
  )
}
