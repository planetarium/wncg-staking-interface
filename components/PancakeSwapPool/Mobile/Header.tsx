import { memo } from 'react'
import Link from 'next/link'

import { dexPoolUrlFor } from 'utils/dexPoolUrlFor'
import { useChain, useStaking } from 'hooks'

import { StyledPancakeSwapPoolMobileHeader } from './styled'
import { StyledCloseButton } from 'components/Modals/shared/styled'
import Icon from 'components/Icon'

type PoolMobileHeaderProps = {
  closePool(): void
}

function PoolMobileHeader({ closePool }: PoolMobileHeaderProps) {
  const { chainId } = useChain()
  const { lpToken } = useStaking()

  return (
    <StyledPancakeSwapPoolMobileHeader className="modalHeader">
      <strong className="poolName">{lpToken.name}</strong>

      <div className="titleGroup">
        <h2 className="title poolTitle">Join pool, Get Cake-LP!</h2>
      </div>

      <Link
        className="linkButton"
        target="_blank"
        href={dexPoolUrlFor(chainId)}
      >
        Pool information
        <Icon icon="outlink" />
      </Link>

      <StyledCloseButton
        className="closeButton"
        type="button"
        onClick={closePool}
        aria-label="Close the modal"
      >
        <Icon icon="close" $size={24} />
      </StyledCloseButton>
    </StyledPancakeSwapPoolMobileHeader>
  )
}

export default memo(PoolMobileHeader)
