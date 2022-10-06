import { formatTimer } from 'utils/string'
import { useTimer, useUnstakeTimestamps } from 'hooks'

import { Icon } from 'components/Icon'

export function UnstakeFormTimer() {
  const { cooldownEndsAt, refetchTimestamps } = useUnstakeTimestamps()

  const { days, hours, minutes, seconds, isExpired } = useTimer(
    cooldownEndsAt || 0,
    refetchTimestamps
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
