import { memo } from 'react'
import Link from 'next/link'

import config from 'config'
import { explorerUrlFor } from 'utils/explorerUrlFor'

import { StyledSidebarMenuList } from './styled'

function MenuList() {
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
          href={explorerUrlFor(config.stakingAddress)}
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
