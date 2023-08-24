import { MouseEvent } from 'react'
import dynamic from 'next/dynamic'

import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { truncateAddress } from 'utils/truncateAddress'
import { useAuth, useConnect } from 'hooks'

import { StyledGnbConnectButton } from './styled'
import Button from 'components/Button'
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
      <StyledGnbConnectButton {...MOTION} variants={ANIMATION_MAP.fadeIn}>
        <button className="accountButton" type="button" onClick={toggle}>
          <Jazzicon address={account!} diameter={24} />
          <strong className="address">{truncateAddress(account!, 5, 3)}</strong>
        </button>
      </StyledGnbConnectButton>
    )
  }

  return (
    <StyledGnbConnectButton {...MOTION} variants={ANIMATION_MAP.fadeIn}>
      <Button onClick={openConnectModal} disabled={disabled} $size="md">
        Connect Wallet
      </Button>
    </StyledGnbConnectButton>
  )
}

export default dynamic(() => Promise.resolve(GnbConnectButton), { ssr: false })
