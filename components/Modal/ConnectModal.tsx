import { useState } from 'react'
import styles from './style.module.scss'

import { ModalCategory } from 'app/states/modal'
import { useConnection, useModal } from 'hooks'

import { Button } from 'components/Button'
import { Checkbox } from 'components/Checkbox'
import { Icon } from 'components/Icon'

export function ConnectModal() {
  const { connect } = useConnection()
  const { removeModal } = useModal()

  const [checked, setChecked] = useState(false)

  function close() {
    removeModal(ModalCategory.Connect)
  }

  function handleCheck(value: boolean) {
    setChecked(value)
  }

  return (
    <div className={styles.connectModal}>
      <header className={styles.header}>
        <h1 className={styles.title}>Connect Your Wallet</h1>
        <button
          className={styles.closeButton}
          type="button"
          onClick={close}
          aria-label="Close"
        >
          <Icon id="close" />
        </button>
      </header>

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
