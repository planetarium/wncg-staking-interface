import { memo } from 'react'
import Link from 'next/link'

import { poolUrlFor } from 'utils/poolUrlFor'
import { useStaking } from 'hooks'

import { StyledPoolMobileHeader } from './styled'
import { StyledCloseButton } from 'components/Modals/shared/styled'
import Icon from 'components/Icon'

type PoolMobileHeaderProps = {
  closePool(): void
}

function PoolMobileHeader({ closePool }: PoolMobileHeaderProps) {
  const { bptName } = useStaking()

  return (
    <StyledPoolMobileHeader className="modalHeader">
      <strong className="poolName">{bptName}</strong>

      <div className="titleGroup">
        <h2 className="title poolTitle">Join pool, Get LP Tokens!</h2>
      </div>

      <Link className="linkButton" target="_blank" href={poolUrlFor()}>
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
    </StyledPoolMobileHeader>
  )
}

export default memo(PoolMobileHeader)
