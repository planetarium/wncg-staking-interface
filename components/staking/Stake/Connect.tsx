import { useConnect } from 'hooks'

import { StyledStakeConnect } from './styled'
import Button from 'components/Button'
import { InputPlaceholder } from 'components/Form'

export default function StakeConnect() {
  const { openConnectModal } = useConnect()

  return (
    <StyledStakeConnect>
      <InputPlaceholder
        className="placeholder"
        placeholder="Connect wallet to stake LP tokens!"
        $size="sm"
      />

      <Button className="connectButton" onClick={openConnectModal}>
        Connect wallet
      </Button>
    </StyledStakeConnect>
  )
}
