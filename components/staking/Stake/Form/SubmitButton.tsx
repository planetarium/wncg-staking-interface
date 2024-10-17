import { useAuth } from 'hooks'

import Button from 'components/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'

type StakeFormSubmitButtonProps = {
  disabled: boolean
}

export default function StakeFormSubmitButton({
  disabled,
}: StakeFormSubmitButtonProps) {
  const { isConnected } = useAuth()

  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <Button
            className="submitButton"
            type="button"
            onClick={openConnectModal}
            disabled={disabled}
          >
            Connect wallet
          </Button>
        )}
      </ConnectButton.Custom>
    )
  }

  return (
    <Button className="submitButton" type="submit" disabled={disabled}>
      Stake
    </Button>
  )
}
