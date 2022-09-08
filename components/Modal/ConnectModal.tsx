import { useState } from 'react'
import styles from './style.module.scss'

import { useConnection } from 'hooks'

import { Button } from 'components/Button'
import { Checkbox } from 'components/Checkbox'
import { Icon } from 'components/Icon'

export function ConnectModal() {
  const [checked, setChecked] = useState(false)
  const { connect } = useConnection()

  function handleCheck(value: boolean) {
    setChecked(value)
  }

  return (
    <div className={styles.connectModal}>
      <h1 className={styles.title}>Connect Your Wallet</h1>
      <div className={styles.agreement}>
        <Checkbox
          className={styles.checkbox}
          id="agreement"
          variant="light"
          checked={checked}
          onChange={handleCheck}
        />
        <label htmlFor="agreement">
          I read and accept the
          <a href="/" target="_blank" rel="noopener">
            Terms of Service
          </a>
          and
          <a href="/" target="_blank" rel="noopener">
            Privacy Policy
          </a>
        </label>
      </div>

      <Button size="large" disabled={!checked} onClick={connect}>
        <Icon id="metamask" />
        Connect to MetaMask
      </Button>
    </div>
  )
}
