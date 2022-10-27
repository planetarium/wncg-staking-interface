import { ModalCategory } from 'states/ui'
import { networkChainId, networkNameFor } from 'utils/network'
import { useModal, useSwitchNetwork } from 'hooks'

import { StyledSwitchNetworkModal } from './styled'
import Button from 'new/Button'

function SwitchNetworkModal() {
  const { removeModal } = useModal()
  const { switchNetwork: initSwitchNetwork } = useSwitchNetwork()

  function close() {
    removeModal(ModalCategory.SwitchNetwork)
  }

  function switchNetwork() {
    initSwitchNetwork()
    close()
  }

  return (
    <StyledSwitchNetworkModal>
      <header className="modalHeader">
        <h1 className="title">
          You must switch to
          <br />
          {networkNameFor(networkChainId)} to use <br />
          this protocol.
        </h1>
      </header>

      <div className="buttonGroup">
        <Button onClick={switchNetwork} $size="lg">
          Switch network
        </Button>
        <Button onClick={close} $variant="tertiary" $size="lg">
          Cancel
        </Button>
      </div>
    </StyledSwitchNetworkModal>
  )
}

export default SwitchNetworkModal
