import { useState } from 'react'
import styles from '../styles/UnstakeSidebar.module.scss'

import { gaEvent } from 'lib/gtag'
import { useConnection, useUnstake, useUnstakeTimestamps } from 'hooks'
import { UnstakeStatus } from 'hooks/useUnstakeTimestamps'

import { Button } from 'components/Button'

export function CooldownButton() {
  const [loading, setLoading] = useState(false)

  const { connect } = useConnection()
  const { startCooldown } = useUnstake()
  const { unstakeStatus } = useUnstakeTimestamps()

  async function handleStartCooldown() {
    console.log('1')

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

  switch (unstakeStatus) {
    case UnstakeStatus.NotConnected:
      return (
        <Button size="large" onClick={connect} fullWidth>
          Connect
        </Button>
      )

    case UnstakeStatus.CooldownInProgress:
      return (
        <Button
          className={styles.coolingDownButton}
          variant="secondary"
          size="large"
          fullWidth
        >
          Cooling down...
        </Button>
      )

    case UnstakeStatus.NoStake:
      return (
        <Button variant="secondary" size="large" fullWidth disabled>
          No staked amount
        </Button>
      )

    case UnstakeStatus.NoCooldown:
      return (
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

    default:
      return null
  }
}
