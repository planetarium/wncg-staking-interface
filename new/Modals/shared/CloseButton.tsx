import { memo, MouseEvent } from 'react'

import type { ModalCategory } from 'states/ui'
import { useModal } from 'hooks'

import { StyledCloseButton } from './styled'
import SvgIcon from 'new/SvgIcon'

type CloseButtonProps = {
  modal: ModalCategory
  onClose?(): void
}

function CloseButton({ modal, onClose }: CloseButtonProps) {
  const { removeModal } = useModal()

  function close(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    removeModal(modal)
    onClose?.()
  }

  return (
    <StyledCloseButton
      className="closeButton"
      type="button"
      onClick={close}
      aria-label="Close this modal"
    >
      <SvgIcon icon="close" $size={32} />
    </StyledCloseButton>
  )
}

export default memo(CloseButton)
