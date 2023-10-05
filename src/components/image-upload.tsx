'use client'

import { CldUploadWidget, type CldUploadWidgetResults } from 'next-cloudinary'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ImagePlus, Trash } from 'lucide-react'
import { useCallback } from 'react'

type Props = {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

type CldUploadInfo = {
  secure_url?: string
}

export const ImageUpload = (props: Props) => {
  const { disabled, onChange, onRemove, value } = props

  const onUpload = useCallback(
    (result: CldUploadWidgetResults) => {
      const url = (result?.info as unknown as CldUploadInfo)?.secure_url ?? ''

      onChange(url)
    },
    [onChange]
  )

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url, index) => {
          console.log('url', url)
          return (
            <div
              key={index}
              className="relative h-[200px] w-[200px] overflow-hidden rounded-md"
            >
              <Image fill className="object-cover" alt="Image" src={url} />

              <div className="absolute right-2 top-2 z-10">
                <Button
                  type="button"
                  size="icon"
                  onClick={() => onRemove(url)}
                  variant="destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset="next-ecommerce"
        signatureEndpoint="/api/sign-cloudinary-params"
      >
        {({ open }) => {
          const onClick = () => {
            open()
          }

          return (
            <Button
              onClick={onClick}
              type="button"
              disabled={disabled}
              variant="secondary"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Upload image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}
