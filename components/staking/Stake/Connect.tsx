import { useConnect } from 'hooks'

import { StyledStakeConnect } from './styled'
import Button from 'components/Button'

export default function StakeConnect() {
  const { openConnectModal } = useConnect()

  return (
    <StyledStakeConnect>
      <Button className="connectButton" onClick={openConnectModal}>
        Connect wallet
      </Button>
    </StyledStakeConnect>
  )
}
