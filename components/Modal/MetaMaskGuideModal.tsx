/* eslint-disable react/no-unescaped-entities */
import styles from './MetaMaskGuideModal.module.scss'

import { ModalCategory } from 'app/states/modal'
import { useModal } from 'hooks'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'

export function MetaMaskGuideModal() {
  const { removeModal } = useModal()

  function close() {
    removeModal(ModalCategory.MetaMaskGuide)
  }

  return (
    <div className={styles.metamaskGuideModal}>
      <h1 className={styles.title}>
        Oops!
        <br />
        You don't have MetaMask
      </h1>
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
