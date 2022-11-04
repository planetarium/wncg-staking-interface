import { memo } from 'react'

import { configService } from 'services/config'

import { StyledMenuList } from './styled'
import SvgIcon from 'components/SvgIcon'

function MenuList() {
  return (
    <StyledMenuList className="menuList">
      <h1 className="hidden">Menu</h1>

      <ul>
        <li>
          <a href={configService.docs.notion} target="_blank" rel="noopener">
            Docs
            <SvgIcon icon="export" />
          </a>
        </li>
        <li>
          <a
            href={configService.socialMedia.medium}
            target="_blank"
            rel="noopener"
          >
            medium
            <SvgIcon icon="export" />
          </a>
        </li>
        <li>
          <a
            href={configService.github.repositoryUrl}
            target="_blank"
            rel="noopener"
          >
            github
            <SvgIcon icon="export" />
          </a>
        </li>
      </ul>
    </StyledMenuList>
  )
}

export default memo(MenuList)
