import { useState } from 'react'
import clsx from 'clsx'
import styles from '../styles/UnstakeSidebar.module.scss'

import { getUnstakeStatus, UnstakeStatus } from 'app/states/unstake'
import { gaEvent } from 'lib/gtag'
import { useAppSelector, useConnection, useUnstake } from 'hooks'

import { Button } from 'components/Button'

export function UnstakeSidebarCooldown() {
  const [loading, setLoading] = useState(false)

  const { connect } = useConnection()
  const { startCooldown } = useUnstake()
  const status = useAppSelector(getUnstakeStatus)

  async function handleStartCooldown() {
    setLoading(true)
    gaEvent({
      name: 'start_cooldown',
    })
    try {
      await startCooldown()
    } catch (error) {
      setLoading(false)
    }
  }

  let button: JSX.Element | null
  switch (status) {
    case UnstakeStatus.NotConnected:
      button = (
        <Button size="large" onClick={connect} fullWidth>
          Connect
        </Button>
      )
      break
    case UnstakeStatus.CooldownInProgress:
      button = (
        <Button
          className={styles.coolingDownButton}
          variant="secondary"
          size="large"
          fullWidth
        >
          Cooling down...
        </Button>
      )
      break
    case UnstakeStatus.NoStake:
      button = (
        <Button variant="secondary" size="large" fullWidth disabled>
          No staked amount
        </Button>
      )
      break
    case UnstakeStatus.NoCooldown:
      button = (
        <Button
          size="large"
          onClick={handleStartCooldown}
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Start cooldown
        </Button>
      )
      break
    default:
      button = null
      break
  }

  return (
    <>
      <h1 className={styles.title}>Withdraw 20WETH-80WNCG</h1>
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
      {button}
    </>
  )
}
