import dynamic from 'next/dynamic'

import { useChain, useModal, useSwitchNetwork } from 'hooks'

import { StyledSwitchNetworkModal } from './styled'
import Button from 'components/Button'

function SwitchNetworkModal() {
  const { removeModal } = useModal()
  const { name: networkName } = useChain()
  const { switchNetwork: initSwitchNetwork } = useSwitchNetwork()

  function switchNetwork() {
    initSwitchNetwork()
    removeModal()
  }

  return (
    <StyledSwitchNetworkModal>
      <header className="modalHeader">
        <h1 className="title">
          You must switch to
          <br />
          {networkName} to use <br />
          this protocol.
        </h1>
      </header>

      <div className="buttonGroup">
        <Button onClick={switchNetwork} $size="lg">
          Switch network
        </Button>
        <Button onClick={removeModal} $variant="tertiary" $size="lg">
          Cancel
        </Button>
      </div>
    </StyledSwitchNetworkModal>
  )
}

export default dynamic(() => Promise.resolve(SwitchNetworkModal), {
  ssr: false,
})
