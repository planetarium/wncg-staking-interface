import type { MouseEvent } from 'react'
import type { CloseButtonProps } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import styles from './style.module.scss'

import { isMobileState } from 'app/states/mediaQuery'

import { Icon } from 'components/Icon'

export function ToastCloseButton({ closeToast }: CloseButtonProps) {
  const isMobile = useRecoilValue(isMobileState)

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
