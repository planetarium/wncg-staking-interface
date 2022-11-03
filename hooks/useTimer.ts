import { useEffect, useState } from 'react'
import { useInterval, usePrevious } from 'react-use'

import {
  SECOND_IN_MS as SECOND,
  MINUTE_IN_MS as MINUTE,
  DAY_IN_MS as DAY,
  HOUR_IN_MS as HOUR,
} from 'constants/time'

export function useTimer(expiresAt = 0, onExpiration?: () => void) {
  const [timeRemaining, setTimeRemaining] = useState(expiresAt - Date.now())
  const isExpired = timeRemaining <= 0
  const prevIsExpired = usePrevious(isExpired)

  function updateTimeRemaining() {
    setTimeRemaining(expiresAt - Date.now())
  }

  useInterval(updateTimeRemaining, SECOND)

  useEffect(() => {
    if (!prevIsExpired && isExpired) {
      onExpiration?.()
    }
  }, [isExpired, onExpiration, prevIsExpired])

  return {
    ...parseTimeRemaining(timeRemaining),
    isExpired,
    timeRemaining,
  }
}

function parseTimeRemaining(timestamp: number) {
  const days = Math.max(0, Math.floor(timestamp / DAY))
  const hours = Math.max(0, Math.floor((timestamp % DAY) / HOUR))
  const minutes = Math.max(0, Math.floor((timestamp % HOUR) / MINUTE))
  const seconds = Math.max(0, Math.floor((timestamp % MINUTE) / SECOND))

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}
