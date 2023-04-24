import { useState } from 'react'
import { useMount } from 'react-use'

export function useIsMounted() {
  const [mounted, setIsMounted] = useState(false)

  useMount(() => setIsMounted(true))

  return mounted
}
