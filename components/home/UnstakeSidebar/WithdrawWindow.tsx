/* eslint-disable react/no-unescaped-entities */
import clsx from 'clsx'
import styles from '../styles/UnstakeSidebar.module.scss'

import {
  getUnstakePeriod,
  getWithdrawEndsAt,
  resetWithdrawEndsAt,
} from 'app/states/unstake'
import { formatTimer } from 'utils/string'
import { useAppDispatch, useAppSelector, useTimer } from 'hooks'

export function UnstakeSidebarWithdrawWindow() {
  const dispatch = useAppDispatch()
  const unstakePeriod = useAppSelector(getUnstakePeriod)
  const withdrawEndsAt = useAppSelector(getWithdrawEndsAt)

  function onExpiration() {
    if (!withdrawEndsAt) return
    dispatch(resetWithdrawEndsAt())
  }

  const { days, hours, minutes, seconds, isExpired, timeRemaining } = useTimer(
    withdrawEndsAt,
    onExpiration
  )

  const percentRemaining = (
    (Math.floor(timeRemaining / 1_000) / unstakePeriod) *
    100
  ).toFixed(2)

  return (
    <>
      <h1 className={styles.title}>Withdraw Window</h1>
      <p className={styles.desc}>
        You can withdraw the staked tokens. If you don't withdraw the tokens
        within the window, you need to cooldown the tokens again to withdraw.
      </p>

      <div className={styles.withdrawTimer}>
        <div className={styles.barGroup}>
          {isExpired ? (
            <div className={clsx(styles.bar, styles.loading)} />
          ) : (
            <div
              className={styles.bar}
              style={{ width: `${percentRemaining}%` }}
            />
          )}
        </div>

        <div className={styles.content}>
          <span>Withdraw window expires in</span>
          <strong className={clsx({ [styles.expired]: isExpired })}>
            {isExpired
              ? 'Calculating...'
              : generateTimerText(days, hours, minutes, seconds)}
          </strong>
        </div>
      </div>
    </>
  )
}

function generateTimerText(
  days: number,
  hours: number,
  minutes: number,
  seconds: number
) {
  return `${formatTimer(days)}d ${formatTimer(hours)}h ${formatTimer(
    minutes
  )}m ${formatTimer(seconds)}s`
}
