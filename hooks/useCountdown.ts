import { useCallback, useEffect, useState } from 'react'
import { useInterval, usePrevious } from 'react-use'
import { useSetAtom } from 'jotai'

import { currentTimestampAtom } from 'states/system'
import { now } from 'utils/now'
import { parseCountdown } from 'utils/parseCountdown'

type UseCountdownOptions = {
  enabled?: boolean
  intervals?: number
  leadingZero?: boolean
  onExpiration?(): void
}

export function useCountdown(expiresAt = 0, options: UseCountdownOptions = {}) {
  const {
    enabled,
    leadingZero = true,
    intervals = 1_000,
    onExpiration,
  } = options
  const delay = enabled ? intervals : null

  const [timeRemaining, setTimeRemaining] = useState(expiresAt - now())
  const isExpired = timeRemaining <= 0
  const prevIsExpired = usePrevious(isExpired)

  const setCurrentTimestamp = useSetAtom(currentTimestampAtom)

  function update() {
    setTimeRemaining(expiresAt - now())
  }

  const handleExpiration = useCallback(() => {
    setCurrentTimestamp(now())
    onExpiration?.()
  }, [onExpiration, setCurrentTimestamp])

  useInterval(update, delay)

  useEffect(() => {
    if (!enabled) return
    if (!prevIsExpired && isExpired) handleExpiration()
  }, [enabled, handleExpiration, isExpired, onExpiration, prevIsExpired])

  return {
    ...parseCountdown(timeRemaining, leadingZero),
    isExpired,
    timeRemaining,
  }
}
