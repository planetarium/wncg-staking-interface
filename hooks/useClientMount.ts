import { startTransition } from 'react'
import { useIsomorphicLayoutEffect } from 'framer-motion'

export function useClientMount(fn: any) {
  useIsomorphicLayoutEffect(() => {
    startTransition(fn)
  }, [])
}
