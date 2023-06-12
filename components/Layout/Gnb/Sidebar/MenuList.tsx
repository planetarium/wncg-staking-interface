import { memo } from 'react'
import Link from 'next/link'

import config from 'config'
import { explorerUrlFor } from 'utils/explorerUrlFor'
import { useChain } from 'hooks'

import { StyledSidebarMenuList } from './styled'
import { STAKING_ADDRESS } from 'config/constants/addresses'

function MenuList() {
  const { chainId } = useChain()

  return (
    <StyledSidebarMenuList>
      <li className="navItem">
        <Link href={config.docs.notion} target="_blank" rel="noopener">
          Docs
        </Link>
      </li>

      <li className="navItem">
        <Link href={config.links.medium} target="_blank" rel="noopener">
          Medium
        </Link>
      </li>

      <li className="navItem">
        <Link
          href={explorerUrlFor(chainId, STAKING_ADDRESS[chainId])}
          target="_blank"
          rel="noopener"
        >
          Etherscan
        </Link>
      </li>
    </StyledSidebarMenuList>
  )
}

export default memo(MenuList)
