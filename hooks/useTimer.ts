import { useEffect, useState } from 'react'
import { useInterval, usePrevious } from 'react-use'

const SECOND = 1_000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

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
  const days = Math.floor(timestamp / DAY)
  const hours = Math.floor((timestamp % DAY) / HOUR)
  const minutes = Math.floor((timestamp % HOUR) / MINUTE)
  const seconds = Math.floor((timestamp % MINUTE) / SECOND)

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}
