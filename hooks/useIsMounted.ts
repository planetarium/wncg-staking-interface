import { useState } from 'react'
import { useClientMount } from './useClientMount'

export function useIsMounted() {
  const [mounted, setIsMounted] = useState(false)

  useClientMount(() => setIsMounted(true))

  return mounted
}
