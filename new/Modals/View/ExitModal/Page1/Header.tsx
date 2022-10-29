import { ModalCategory } from 'states/ui'

import { StyledExitModalPage1Header } from './styled'
import SlippageDropdown from 'new/SlippageDropdown'
import CloseButton from 'new/Modals/shared/CloseButton'

function ExitModalPage1Header() {
  return (
    <StyledExitModalPage1Header className="modalHeader">
      <div className="titleGroup">
        <h2 className="title accent">Exit pool</h2>
        <h3 className="subtitle">Do you want to Exit pool?</h3>
      </div>

      <SlippageDropdown />
      <CloseButton modal={ModalCategory.Exit} />
    </StyledExitModalPage1Header>
  )
}

export default ExitModalPage1Header
