import { StyledStakeConnect } from './styled'
import Button from 'components/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function StakeConnect() {
  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <StyledStakeConnect>
          <Button className="connectButton" onClick={openConnectModal}>
            Connect wallet
          </Button>
        </StyledStakeConnect>
      )}
    </ConnectButton.Custom>
  )
}
