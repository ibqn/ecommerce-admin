'use client'

import { useOrigin } from '@/hooks/use-origin'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { ApiCallout } from '@/components/api-callout'

type Props = {
  entityName: string
  entityIdName: string
  storeId: string
}

type Params = {
  storeName: string
}

export const ApiList = (props: Props) => {
  const { entityName, entityIdName, storeId } = props

  const params = useParams<Params>()
  const origin = useOrigin()

  const baseUrl = useMemo(
    () => `${origin}/api/store/${storeId}`,
    [origin, storeId]
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

      <ApiCallout
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />

      <ApiCallout
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />

      <ApiCallout
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  )
}
