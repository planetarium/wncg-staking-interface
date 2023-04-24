import { useCallback, useEffect, useMemo } from 'react'
import { useMount } from 'react-use'
import { useSetAtom } from 'jotai'

import { breakpointAtom } from 'states/screen'
import { Breakpoint } from 'config/constants'

const bpEntries = Object.entries(Breakpoint)
const bpLength = bpEntries.length
const bpKeys = Object.keys(Breakpoint)
const bpQueries = Object.values(Breakpoint).map((value, i) => {
  if (i === bpLength - 1) return `(min-width: ${value}px)`

  const maxWidth = bpEntries[i + 1][1] - 1
  if (i === 0) return `(max-width: ${maxWidth}px)`
  return `(min-width: ${value}px) and (max-width: ${maxWidth}px)`
})

export function useMediaQuery() {
  const setBreakpoint = useSetAtom(breakpointAtom)

  const mql = useMemo(
    () =>
      bpQueries.map((query) => {
        if (typeof window === 'undefined') return null
        return window.matchMedia(query)
      }),
    []
  )

  const update = useCallback(() => {
    const match = mql.findIndex((mq) => !!mq?.matches)
    if (match < 0) return
    const newBp = bpKeys[match] as Breakpoint

    setBreakpoint(newBp)
  }, [mql, setBreakpoint])

  useMount(update)

  useEffect(() => {
    mql.forEach((mq) => mq?.addEventListener('change', update))

    return () => {
      mql.forEach((mq) => mq?.removeEventListener('change', update))
    }
  }, [mql, update])
}
