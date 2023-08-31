import { MouseEvent } from 'react'

import { useModal, useResponsive } from 'hooks'

import { StyledCloseButton } from './styled'
import Icon from 'components/Icon'

type CloseButtonProps = {
  onClose?(): void
}

function CloseButton({ onClose }: CloseButtonProps) {
  const { removeModal } = useModal()
  const { isHandheld, isSmallLaptop } = useResponsive()

  function closeModal(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    removeModal()
    onClose?.()
  }

  const $size = isHandheld && !isSmallLaptop ? 24 : 32

  return (
    <StyledCloseButton
      className="closeButton"
      type="button"
      onClick={closeModal}
      aria-label="Close the modal"
    >
      <Icon icon="close" $size={$size} />
    </StyledCloseButton>
  )
}

export default CloseButton
