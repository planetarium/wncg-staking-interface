import { formatTimer } from 'utils/string'
import { useTimer, useUnstakeTimestamps } from 'hooks'

import { Icon } from 'components/Icon'

export function UnstakeFormTimer() {
  const { cooldownEndsAt, fetchTimestamps } = useUnstakeTimestamps()

  function onExpiration() {
    // dispatch(resetCooldownEndsAt())
    fetchTimestamps()
  }

  const { days, hours, minutes, seconds, isExpired } = useTimer(
    cooldownEndsAt || 0,
    onExpiration
  )

  if (isExpired) {
    return null
  }

  return (
    <>
      <Icon id="clock" />
      <h1>
        {formatTimer(days)}d {formatTimer(hours)}h {formatTimer(minutes)}m{' '}
        {formatTimer(seconds)}s left
      </h1>
    </>
  )
}
