import type { MouseEvent } from 'react'
import type { CloseButtonProps } from 'react-toastify'
import { useAtomValue } from 'jotai'
import styles from './style.module.scss'

import { isMobileAtom } from 'states/ui'

import { Icon } from 'components/Icon'

export function ToastCloseButton({ closeToast }: CloseButtonProps) {
  const isMobile = useAtomValue(isMobileAtom)

  if (isMobile) {
    return null
  }

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
