import { useMemo } from 'react'
import {
  isBrowser as _isBrowser,
  isMobile as _isMobile,
  isTablet as _isTablet,
} from 'react-device-detect'
import { useAtomValue } from 'jotai'

import { breakpointAtom } from 'states/screen'
import { useIsMounted } from './useIsMounted'

export function useResponsive() {
  const mounted = useIsMounted()
  const bp = useAtomValue(breakpointAtom)

  const isMobile = useMemo(() => {
    return (!!bp && bp === 'mobile') ?? (mounted && _isMobile)
  }, [bp, mounted])

  const isTablet = useMemo(() => {
    return (
      (!!bp && (bp === 'tablet' || bp === 'smLaptop')) ?? (mounted && _isTablet)
    )
  }, [bp, mounted])

  const isSmallLaptop = useMemo(() => {
    return !!bp && bp === 'smLaptop'
  }, [bp])

  const isLaptop = useMemo(() => {
    return !!bp && bp === 'laptop'
  }, [bp])

  const isDesktop = useMemo(() => {
    return !!bp && bp === 'desktop'
  }, [bp])

  const isHandheld = useMemo(() => isMobile || isTablet, [isMobile, isTablet])

  const isSmallerThanDesktop = useMemo(
    () => isMobile || isTablet || isLaptop,
    [isLaptop, isMobile, isTablet]
  )

  const isBrowser = useMemo(() => isLaptop || isDesktop, [isDesktop, isLaptop])

  return {
    bp,
    isBrowser,
    isSmallerThanDesktop,
    isMobile,
    isTablet,
    isSmallLaptop,
    isLaptop,
    isDesktop,
    isHandheld,
  }
}
