/* eslint-disable react/no-unescaped-entities */
import styles from './style.module.scss'

import { ModalCategory } from 'app/states/modal'
import { useModal } from 'hooks'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'

function MetaMaskGuideModal() {
  const { removeModal } = useModal()

  function close() {
    removeModal(ModalCategory.MetaMaskGuide)
  }

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>You don't have MetaMask</h1>
        <button
          className={styles.closeButton}
          type="button"
          onClick={close}
          aria-label="Close"
        >
          <Icon id="close" />
        </button>
      </header>

      <p className={styles.desc}>Please install MetaMask to connect</p>

      <Button
        href="https://metamask.io/"
        target="_blank"
        onClick={close}
        size="large"
        fullWidth
      >
        <Icon id="metamask" />
        Install MetaMask
      </Button>
    </div>
  )
}

export default MetaMaskGuideModal
