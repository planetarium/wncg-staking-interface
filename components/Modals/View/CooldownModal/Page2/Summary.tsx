import { useMemo } from 'react'
import { useAtom } from 'jotai'

import { currentTimestampAtom } from 'states/system'
import { bnum } from 'utils/bnum'
import { format } from 'utils/format'
import { formatISO } from 'utils/formatISO'
import { now } from 'utils/now'
import { useClientMount, useStaking } from 'hooks'

import { StyledCooldownModalPage2Summary } from './styled'

export default function CooldownModalPage2Summary() {
  const { cooldownSeconds, withdrawSeconds } = useStaking()

  const [currentTimestamp, setCurrentTimestamp] = useAtom(currentTimestampAtom)

  const expectedCooldownWindow = useMemo(
    () => bnum(currentTimestamp).plus(cooldownSeconds).toNumber(),
    [cooldownSeconds, currentTimestamp]
  )

  const expectedUnstakeWindow = useMemo(
    () => bnum(expectedCooldownWindow).plus(withdrawSeconds).toNumber(),
    [expectedCooldownWindow, withdrawSeconds]
  )

  useClientMount(() => {
    setCurrentTimestamp(now())
  })

  return (
    <StyledCooldownModalPage2Summary>
      <p className="desc">Withdrawal period (If you cool down from today)</p>
      <p className="period">
        <time dateTime={formatISO(expectedCooldownWindow)}>
          {format(expectedCooldownWindow)}
        </time>
        <time className="hyphen" dateTime={formatISO(expectedUnstakeWindow)}>
          {format(expectedUnstakeWindow)}
        </time>
      </p>
    </StyledCooldownModalPage2Summary>
  )
}
