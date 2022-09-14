import clsx from 'clsx'
import styles from '../styles/UnstakeSidebar.module.scss'

import { usePool } from 'hooks'

import { CooldownButton } from './CooldownButton'

export function UnstakeSidebarCooldown() {
  const { poolTokenName } = usePool()

  return (
    <>
      <h1 className={styles.title}>Withdraw {poolTokenName}</h1>
      <p className={styles.desc}>
        Staked tokens can be withdrawn after the cooldown period ends and the
        withdrawal window is active. Currently cooldown period and withdrawal
        window are set like below.
      </p>

      <div className={styles.cooldownGraph}>
        <div className={styles.barGroup} aria-hidden>
          <span className={clsx(styles.bar, styles.cooldown)} />
          <span className={clsx(styles.bar, styles.withdraw)} />
        </div>

        <dl className={styles.detail}>
          <div className={styles.detailItem}>
            <dt>Cooldown period</dt>
            <dd>
              <strong>14 days</strong>
            </dd>
          </div>
          <div className={styles.detailItem}>
            <dt>Withdraw window</dt>
            <dd>
              <strong>3 days</strong>
            </dd>
          </div>
        </dl>
      </div>

      <CooldownButton />
    </>
  )
}
