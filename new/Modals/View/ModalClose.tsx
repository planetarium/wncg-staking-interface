import { memo } from 'react'

import styled from 'styled-components'

import type { ModalCategory } from 'states/ui'
import { useModal } from 'hooks'

import { Icon } from 'components/Icon'

const StyledModalClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px !important;
  height: 32px !important;
  margin-bottom: 24px !important;
  margin-left: auto;
  color: white !important;
  background-color: #000 !important;

  svg {
    width: 18px !important;
    height: 18px !important;
  }
`

type ModalCloseProps = {
  modal: ModalCategory
}

function ModalClose({ modal }: ModalCloseProps) {
  const { removeModal } = useModal()

  function close() {
    removeModal(modal)
  }

  return (
    <StyledModalClose
      className="modalClose"
      type="button"
      onClick={close}
      aria-label="Close"
    >
      <Icon id="close" />
    </StyledModalClose>
  )
}

export default memo(ModalClose)
