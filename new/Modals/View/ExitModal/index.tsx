import { memo } from 'react'

import { ModalCategory } from 'states/ui'

import { StyledExitModal } from './styled'
import ModalClose from '../../shared/ModalClose'

function ExitModal() {
  return (
    <StyledExitModal>
      <ModalClose modal={ModalCategory.Exit} />
      <header>
        <h2>Exit Pool</h2>
        <h3>Title</h3>
      </header>
    </StyledExitModal>
  )
}

export default memo(ExitModal)
