import { ModalCategory } from 'states/ui'

import { CloseButton, ModalPage } from 'components/Modals/shared'

function WithdrawModal() {
  return (
    <ModalPage>
      <CloseButton modal={ModalCategory.Withdraw} />
      <header>
        <h2>Withdraw</h2>
        <h3>How much do you want to withdraw?</h3>
      </header>
    </ModalPage>
  )
}

export default WithdrawModal
