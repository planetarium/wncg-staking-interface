import { useMemo } from 'react'
import { useMount } from 'react-use'
import Link from 'next/link'
import { useAtom, useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { currentTimestampAtom } from 'states/system'
import { cooldownTxAtom } from 'states/tx'
import { bnum } from 'utils/bnum'
import { format } from 'utils/format'
import { formatISO } from 'utils/formatISO'
import { now } from 'utils/now'
import { txUrlFor } from 'utils/txUrlFor'
import { useChain, useStaking } from 'hooks'
import { useWatch } from './useWatch'

import { StyledToast } from './styled'
import Icon from 'components/Icon'
import ToastStatus from './Status'

type CooldownToastProps = {
  hash: Hash
}

export default function CooldownToast({ hash }: CooldownToastProps) {
  const { chainId } = useChain()
  const { cooldownSeconds, withdrawSeconds } = useStaking()

  const [currentTimestamp, setCurrentTimestamp] = useAtom(currentTimestampAtom)

  const schedule = useMemo(() => {
    const cooldownEndsAt = bnum(currentTimestamp)
      .plus(cooldownSeconds)
      .toNumber()

    return {
      cooldownStartsAt: currentTimestamp,
      cooldownEndsAt,
      unstakeStartsAt: cooldownEndsAt,
      unstakeEndsAt: bnum(cooldownEndsAt).plus(withdrawSeconds).toNumber(),
    }
  }, [cooldownSeconds, currentTimestamp, withdrawSeconds])

  const setTx = useSetAtom(cooldownTxAtom)

  const status = useWatch(hash)

  useMount(() => {
    setCurrentTimestamp(now())
    setTx(RESET)
  })

  return (
    <StyledToast>
      <header className="toastHeader">
        <Link href={txUrlFor(chainId, hash)!} target="_blank" rel="noopener">
          <h3 className="title">
            Cooldown started
            <Icon icon="outlink" />
          </h3>
          <ToastStatus status={status} />
        </Link>
      </header>

      <div className="toastContent">
        <dl className="scheduleList">
          <div className="scheduleItem">
            <dt>Cooldown</dt>
            <dd>
              <time dateTime={formatISO(schedule.cooldownStartsAt)}>
                {format(schedule.cooldownStartsAt, { dateOnly: true })}
              </time>
              <time
                className="hyphen"
                dateTime={formatISO(schedule.cooldownEndsAt)}
              >
                {format(schedule.cooldownEndsAt, { dateOnly: true })}
              </time>
            </dd>
          </div>
          <div className="scheduleItem">
            <dt>Withdraw</dt>
            <dd>
              <time dateTime={formatISO(schedule.unstakeStartsAt)}>
                {format(schedule.unstakeStartsAt, { dateOnly: true })}
              </time>
              <time
                className="hyphen"
                dateTime={formatISO(schedule.unstakeEndsAt)}
              >
                {format(schedule.unstakeEndsAt, { dateOnly: true })}
              </time>
            </dd>
          </div>
        </dl>
      </div>
    </StyledToast>
  )
}
