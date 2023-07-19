import { useIsomorphicLayoutEffect } from 'framer-motion'

export function useClientMount(fn: any) {
  useIsomorphicLayoutEffect(fn, [])
}
