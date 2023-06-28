import { memo, MouseEvent } from 'react'

import { getNetworkLabel } from 'utils/getNetworkLabel'
import { isEthereum } from 'utils/isEthereum'
import { useAuth, useChain } from 'hooks'

import { StyledGnbChainSelectToggle } from './styled'
import CryptoIcon from 'components/CryptoIcon'

type GnbChainSelectToggleProps = {
  toggle(e: MouseEvent<HTMLButtonElement>): void
}

function GnbChainSelectToggle({ toggle }: GnbChainSelectToggleProps) {
  const { isConnected } = useAuth()
  const { chainId } = useChain()

  return (
    <StyledGnbChainSelectToggle
      className="dropdownToggle"
      type="button"
      onClick={toggle}
      disabled={!isConnected}
      aria-controls="menu"
      aria-haspopup
    >
      <CryptoIcon icon={isEthereum(chainId) ? 'ether' : 'bnb'} $size={24} />
      <span className="text">{getNetworkLabel(chainId)}</span>
    </StyledGnbChainSelectToggle>
  )
}

export default memo(GnbChainSelectToggle)
