import { memo } from 'react'
import Link from 'next/link'

import config from 'config'

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
        <Link href={config.github.repositoryUrl} target="_blank" rel="noopener">
          Github
        </Link>
      </li>
    </StyledSidebarMenuList>
  )
}

export default memo(MenuList)
