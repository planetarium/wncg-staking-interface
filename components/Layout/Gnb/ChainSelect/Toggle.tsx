import { MouseEvent, useCallback } from 'react'
import clsx from 'clsx'

import { getNetworkLabel } from 'utils/getNetworkLabel'
import { isEthereum } from 'utils/isEthereum'
import { useAuth, useChain, useConnect } from 'hooks'

import { StyledGnbChainSelectToggle } from './styled'
import CryptoIcon from 'components/CryptoIcon'

type GnbChainSelectToggleProps = {
  toggle(e: MouseEvent<HTMLButtonElement>): void
}

function GnbChainSelectToggle({ toggle }: GnbChainSelectToggleProps) {
  const { isConnected } = useAuth()
  const { openConnectModal } = useConnect()
  const { chainId } = useChain()

  const onClickToggle = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (isConnected) toggle(e)
      else openConnectModal()
    },
    [isConnected, openConnectModal, toggle]
  )

  return (
    <StyledGnbChainSelectToggle
      className={clsx('dropdownToggle', { disabled: !isConnected })}
      type="button"
      onClick={onClickToggle}
      aria-controls="menu"
      aria-haspopup
    >
      <CryptoIcon icon={isEthereum(chainId) ? 'ether' : 'bnb'} $size={24} />
      <span className="text">{getNetworkLabel(chainId)}</span>
    </StyledGnbChainSelectToggle>
  )
}

export default GnbChainSelectToggle
