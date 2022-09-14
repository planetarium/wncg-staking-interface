import { useMemo } from 'react'
import { useMount, useUnmount } from 'react-use'
import { useSetRecoilState } from 'recoil'

import { Breakpoint, breakpointState } from 'app/states/mediaQuery'

// NOTE: styles/constancts/_breakpoints.scss
const BP: Record<Breakpoint, number> = {
  xs: 0,
  sm: 540,
  md: 768,
  lg: 1024,
  xl: 1280,
}
const BP_ENTRIES = Object.entries(BP)
const BP_LENGTH = BP_ENTRIES.length
const BP_KEYS = Object.keys(BP) as Breakpoint[]

const MEDIA_QUERIES = BP_ENTRIES.map(([, value], i) => {
  if (i === BP_LENGTH - 1) {
    return `(min-width: ${value}px)`
  }
  const nextValue = BP_ENTRIES[i + 1][1] - 1
  if (i === 0) {
    return `(max-width: ${nextValue}px)`
  }
  return `(min-width: ${value}px) and (max-width: ${nextValue}px)`
})

export function useMediaQuery() {
  const setBreakpoint = useSetRecoilState(breakpointState)

  const mqlList = useMemo(
    () =>
      MEDIA_QUERIES.map((media) => {
        if (typeof window === 'undefined') return null
        return window.matchMedia(media)
      }),
    []
  )

  function updateBreakpoint() {
    const matchIndex = mqlList.findIndex((mql) => mql?.matches)

    if (matchIndex > -1) {
      const newBreakpoint = BP_KEYS[matchIndex]
      setBreakpoint(newBreakpoint)
    }
  }

  useMount(() => {
    updateBreakpoint()

    mqlList.forEach((mql) => {
      mql?.addEventListener('change', updateBreakpoint)
    })
  })

  useUnmount(() => {
    mqlList.forEach((mql) => {
      mql?.removeEventListener('change', updateBreakpoint)
    })
  })
}
