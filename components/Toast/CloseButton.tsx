import type { MouseEvent } from 'react'
import type { CloseButtonProps } from 'react-toastify'

import { StyledToastCloseButton } from './styled'
import Icon from 'components/Icon'

export default function ToastCloseButton({
  closeToast: onCloseToast,
}: CloseButtonProps) {
  function closeToast(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    onCloseToast(e)
  }

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
