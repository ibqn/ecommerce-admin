import { useEffect, useState } from 'react'

export const useOrigin = (defaultOrigin: string = '') => {
  const [mounted, setMounted] = useState(false)

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : defaultOrigin

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return defaultOrigin
  }

  return origin
}
