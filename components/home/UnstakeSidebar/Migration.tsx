/* eslint-disable react/no-unescaped-entities */
import clsx from 'clsx'
import styles from '../styles/UnstakeSidebar.module.scss'

import { usePool, useStaking, useTimer, useUnstakeTimestamps } from 'hooks'
import { formatTimer } from 'utils/string'

import { CooldownButton } from './CooldownButton'

type UnstakeSidebarMigrationProps = {
  isWithdrawable?: boolean
}

export function UnstakeSidebarMigration({
  isWithdrawable,
}: UnstakeSidebarMigrationProps) {
  const { poolTokenName } = usePool()
  const { unstakeWindow } = useStaking()
  const { fetchTimestamps, withdrawEndsAt } = useUnstakeTimestamps()

  function onExpiration() {
    if (!withdrawEndsAt) return
    fetchTimestamps()
  }

  const { days, hours, minutes, seconds, isExpired, timeRemaining } = useTimer(
    withdrawEndsAt,
    onExpiration
  )

  const percentRemaining = (
    (Math.floor(timeRemaining / 1_000) / unstakeWindow) *
    100
  ).toFixed(2)

  return (
    <>
      <h1 className={styles.title}>Withdraw {poolTokenName}</h1>
      <p className={styles.desc}>
        Due to the migration, currently you can withdraw staked tokens right
        after the cooldown transaction is confirmed.
      </p>

      {!isWithdrawable && (
        <>
          <div className={clsx(styles.cooldownGraph, styles.migration)}>
            <div className={styles.barGroup} aria-hidden>
              <span className={clsx(styles.bar, styles.cooldown)} />
              <span className={clsx(styles.bar, styles.withdraw)} />
            </div>

            <dl className={styles.detail}>
              <div className={styles.detailItem}>
                <dt>Cooldown period</dt>
                <dd>
                  <strong>-</strong>
                </dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Withdraw window</dt>
                <dd>
                  <strong>∞</strong>
                </dd>
              </div>
            </dl>
          </div>

          <CooldownButton />
        </>
      )}

      {isWithdrawable && (
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
      )}
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
