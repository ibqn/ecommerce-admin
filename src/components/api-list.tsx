'use client'

import { useOrigin } from '@/hooks/use-origin'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { ApiCallout } from '@/components/api-callout'

type Props = {
  entityName: string
  entityIdName: string
}

type Params = {
  storeName: string
}

export const ApiList = (props: Props) => {
  const { entityName, entityIdName } = props

  const params = useParams<Params>()
  const origin = useOrigin()

  const baseUrl = useMemo(
    () => `${origin}/api/${params.storeName}`,
    [origin, params]
  )

  return (
    <>
      <ApiCallout
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />

      <ApiCallout
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  )
}
