'use client'

import { Modal } from '@/components/modal'
import { useStoreModal } from '@/hooks/use-store-modal'

type Props = {}

export const StoreModal = (props: Props) => {
  const storeModal = useStoreModal()
  return (
    <Modal
      title="Create New Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Create Store Form
    </Modal>
  )
}
