import clsx from 'clsx'
import styles from '../styles/UnstakeSidebar.module.scss'

import { formatTimer } from 'utils/string'
import { usePool, useStaking, useTimer, useUnstakeTimestamps } from 'hooks'

import { CooldownButton } from './CooldownButton'

type UnstakeSidebarMigrationProps = {
  isWithdrawable?: boolean
}

export function UnstakeSidebarMigration({
  isWithdrawable,
}: UnstakeSidebarMigrationProps) {
  const { poolTokenName } = usePool()
  const { withdrawWindowPeriod } = useStaking()
  const { refetchTimestamps, withdrawEndsAt } = useUnstakeTimestamps()

  function onExpiration() {
    if (!withdrawEndsAt) return
    refetchTimestamps()
  }

  const { days, hours, minutes, seconds, isExpired, timeRemaining } = useTimer(
    withdrawEndsAt,
    onExpiration
  )

  const percentRemaining = (
    Math.min(Math.floor(timeRemaining / 1_000) / withdrawWindowPeriod, 1) * 100
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
                  <strong>60 seconds</strong>
                </dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Withdraw window</dt>
                <dd>
                  <strong>60 days</strong>
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
