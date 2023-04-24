import { useMemo } from 'react'

import { useAuth, useConnect } from 'hooks'

import Button from 'components/Button'

type StakeFormSubmitButtonProps = {
  disabled: boolean
}

export default function StakeFormSubmitButton({
  disabled,
}: StakeFormSubmitButtonProps) {
  const { isConnected } = useAuth()
  const { openConnectModal } = useConnect()

  const type = useMemo(() => (isConnected ? 'submit' : 'button'), [isConnected])

  const label = useMemo(
    () => (isConnected ? 'Stake' : 'Connect wallet'),
    [isConnected]
  )

  const handleClick = useMemo(
    () => (isConnected ? undefined : openConnectModal),
    [openConnectModal, isConnected]
  )

  return (
    <Button
      className="submitButton"
      type={type}
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </Button>
  )
}
