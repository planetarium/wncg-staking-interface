import { MouseEvent } from 'react'

import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { truncateAddress } from 'utils/truncateAddress'
import { useAuth, useConnect } from 'hooks'

import { StyledGnbConnectButton } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Jazzicon from 'components/Jazzicon'

type GnbConnectProps = {
  toggle(e: MouseEvent): void
}

function GnbConnectButton({ toggle }: GnbConnectProps) {
  const { account, isConnected } = useAuth()
  const { openConnectModal } = useConnect()

  const disabled = !!isConnected

  if (isConnected == null) {
    return null
  }

  if (!!isConnected && !!account) {
    return (
      <StyledGnbConnectButton {...MOTION} variants={fadeIn}>
        <button className="accountButton" type="button" onClick={toggle}>
          <Jazzicon address={account!} diameter={24} />
          <strong className="address">{truncateAddress(account!, 5, 4)}</strong>
          <Icon icon="check" $size={24} />
        </button>
      </StyledGnbConnectButton>
    )
  }

  return (
    <StyledGnbConnectButton {...MOTION} variants={fadeIn}>
      <Button onClick={openConnectModal} disabled={disabled} $size="md">
        Connect Wallet
      </Button>
    </StyledGnbConnectButton>
  )
}

export default GnbConnectButton
