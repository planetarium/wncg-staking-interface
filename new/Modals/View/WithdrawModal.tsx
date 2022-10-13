import { ModalCategory } from 'states/ui'

import { StyledModalContent } from '../shared/styled'
import ModalClose from '../shared/ModalClose'

function WithdrawModal() {
  return (
    <StyledModalContent>
      <ModalClose modal={ModalCategory.Withdraw} />
      <header>
        <h2>Withdraw</h2>
        <h3>How much do you want to withdraw?</h3>
      </header>
    </StyledModalContent>
  )
}

export default WithdrawModal
