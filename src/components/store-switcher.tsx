'use client'

import { ComponentPropsWithoutRef, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Store } from '@prisma/client'
import { useStoreModal } from '@/hooks/use-store-modal'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from 'lucide-react'
import { cn } from '@/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

type Props = {
  items: Store[]
} & ComponentPropsWithoutRef<typeof PopoverTrigger>

export const StoreSwitcher = ({ className, items, ...props }: Props) => {
  const storeModal = useStoreModal()
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const formattedItems = items.map(({ name }) => name)

  const currentStore = formattedItems.find((name) => name === params.storeName)

  const onStoreSelect = (storeName: string) => () => {
    setOpen(false)
    router.push(`/${storeName}`)
    router.refresh()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select store"
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((name, index) => (
                <CommandItem
                  key={index}
                  className="text-sm"
                  onSelect={onStoreSelect(name)}
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {name}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentStore === name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          <CommandSeparator />

          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  storeModal.onOpen()
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
