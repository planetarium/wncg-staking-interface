/* eslint-disable react/no-unescaped-entities */
import store from 'store'
import styles from '../styles/UnstakeSidebar.module.scss'

import {
  getUnstakePeriod,
  getWithdrawEndsAt,
  resetWithdrawEndsAt,
  STORE_WITHDRAW_ENDS_AT_KEY,
} from 'app/states/unstake'
import { formatTimer } from 'utils/string'
import { useAppDispatch, useAppSelector, useTimer } from 'hooks'

export function UnstakeSidebarWithdrawWindow() {
  const dispatch = useAppDispatch()
  const unstakePeriod = useAppSelector(getUnstakePeriod)
  const withdrawEndsAt =
    useAppSelector(getWithdrawEndsAt) ||
    store.get(STORE_WITHDRAW_ENDS_AT_KEY) ||
    0

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
          <div
            className={styles.bar}
            style={{ width: `${percentRemaining}%` }}
          />
        </div>

        <div className={styles.content}>
          <span>Withdraw window expires in</span>
          <strong>
            {formatTimer(days)}d {formatTimer(hours)}h {formatTimer(minutes)}m{' '}
            {formatTimer(seconds)}s
          </strong>
        </div>
      </div>
    </>
  )
}
