import { getCooldownEndsAt, resetCooldownEndsAt } from 'app/states/unstake'
import { formatTimer } from 'utils/string'
import { useAppDispatch, useAppSelector, useTimer } from 'hooks'

import { Icon } from 'components/Icon'

export function UnstakeFormTimer() {
  const dispatch = useAppDispatch()
  const cooldownEndsAt = useAppSelector(getCooldownEndsAt)

  function onExpiration() {
    dispatch(resetCooldownEndsAt())
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
