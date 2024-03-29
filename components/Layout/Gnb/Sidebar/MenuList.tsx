import Link from 'next/link'

import config from 'config'
import { explorerUrlFor } from 'utils/explorerUrlFor'
import { useChain } from 'hooks'

import { StyledSidebarMenuList } from './styled'

function MenuList() {
  const { chainId, stakingAddress, explorerName } = useChain()

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
          href={explorerUrlFor(chainId, stakingAddress)}
          target="_blank"
          rel="noopener"
        >
          {explorerName}
        </Link>
      </li>
    </StyledSidebarMenuList>
  )
}

export default MenuList
