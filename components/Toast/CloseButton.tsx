import type { MouseEvent } from 'react'
import type { CloseButtonProps } from 'react-toastify'

import { useResponsive } from 'hooks'

import { StyledToastCloseButton } from './styled'
import Icon from 'components/Icon'

export default function ToastCloseButton({
  closeToast: onCloseToast,
}: CloseButtonProps) {
  const { isHandheld } = useResponsive()

  function closeToast(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    onCloseToast(e)
  }

  if (isHandheld) return null

  return (
    <StyledToastCloseButton
      type="button"
      onClick={closeToast}
      aria-label="Close"
    >
      <Icon icon="close" />
    </StyledToastCloseButton>
  )
}
