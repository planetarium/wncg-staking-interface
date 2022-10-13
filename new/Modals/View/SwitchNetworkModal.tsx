import { ModalCategory } from 'states/ui'
import { networkChainId, networkNameFor } from 'utils/network'
import { useModal, useSwitchNetwork } from 'hooks'

import { StyledSwitchNetworkModal } from './styled'
import { Icon } from 'components/Icon'

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
      <header>
        <Icon id="alert" />
        <h1>
          You must switch to {networkNameFor(networkChainId)} to use this
          protocol.
        </h1>
      </header>

      <div>
        <button type="button" onClick={switchNetwork}>
          Switch network
        </button>
        <button type="button" onClick={close}>
          Cancel
        </button>
      </div>
    </StyledSwitchNetworkModal>
  )
}

export default SwitchNetworkModal
