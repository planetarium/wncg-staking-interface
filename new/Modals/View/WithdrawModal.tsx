import { ModalCategory } from 'states/ui'

import { StyledModalContent } from '../shared/styled'
import CloseButton from '../shared/CloseButton'

function WithdrawModal() {
  return (
    <StyledModalContent>
      <CloseButton modal={ModalCategory.Withdraw} />
      <header>
        <h2>Withdraw</h2>
        <h3>How much do you want to withdraw?</h3>
      </header>
    </StyledModalContent>
  )
}

export default WithdrawModal
