import { useMemo } from 'react'
import { useMount } from 'react-use'
import { useAtom } from 'jotai'

import { currentTimestampAtom } from 'states/system'
import { bnum } from 'utils/bnum'
import { format } from 'utils/format'
import { formatISO } from 'utils/formatISO'
import { now } from 'utils/now'
import { useStaking } from 'hooks'

import { StyledCooldownModalPage2Summary } from './styled'

export default function CooldownModalPage2Summary() {
  const { cooldownPeriod, unstakePeriod } = useStaking()

  const [currentTimestamp, setCurrentTimestamp] = useAtom(currentTimestampAtom)

  const expectedCooldownWindow = useMemo(
    () => bnum(currentTimestamp).plus(cooldownPeriod).toNumber(),
    [cooldownPeriod, currentTimestamp]
  )

  const expectedUnstakeWindow = useMemo(
    () => bnum(expectedCooldownWindow).plus(unstakePeriod).toNumber(),
    [expectedCooldownWindow, unstakePeriod]
  )

  useMount(() => {
    setCurrentTimestamp(now())
  })

  return (
    <StyledCooldownModalPage2Summary>
      <p className="desc">Withdrawal period (If you cool down from today)</p>
      <p className="period">
        <time dateTime={formatISO(expectedCooldownWindow)}>
          {formatISO(expectedCooldownWindow)}
          {format(expectedCooldownWindow)}
        </time>
        <time className="hyphen" dateTime={formatISO(expectedUnstakeWindow)}>
          {format(expectedUnstakeWindow)}
        </time>
      </p>
    </StyledCooldownModalPage2Summary>
  )
}
