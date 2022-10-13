import { memo } from 'react'

import type { ModalCategory } from 'states/ui'
import { useModal } from 'hooks'

import { StyledCloseButton } from './styled'
import SvgIcon from 'new/SvgIcon'

type ModalCloseProps = {
  modal: ModalCategory
  onClose?(): void
}

function ModalClose({ modal, onClose }: ModalCloseProps) {
  const { removeModal } = useModal()

  function close() {
    removeModal(modal)
    onClose?.()
  }

  return (
    <StyledCloseButton
      className="modalClose"
      type="button"
      onClick={close}
      aria-label="Close this modal"
    >
      <SvgIcon icon="close" $size={32} />
    </StyledCloseButton>
  )
}

export default memo(ModalClose)
