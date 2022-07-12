import type { MouseEvent } from 'react'
import type { CloseButtonProps } from 'react-toastify'
import styles from './style.module.scss'

import { Icon } from 'components/Icon'

export function ToastCloseButton({ closeToast }: CloseButtonProps) {
  function close(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    closeToast(e)
  }

  return (
    <button className={styles.closeButton} type="button" onClick={close}>
      <Icon id="close" />
    </button>
  )
}
