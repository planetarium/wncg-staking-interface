import { memo } from 'react'
import styled from 'styled-components'

import { configService } from 'services/config'

const StyledMenuList = styled.nav`
  ul {
    display: flex;
    justify-content: flex-end;
  }

  a,
  button {
    padding: 8px;
    margin-left: 10px;
    font-size: 14px;
    background-color: green;
  }
`

function MenuList() {
  return (
    <StyledMenuList className="menuList">
      <h1 className="hidden">Menu</h1>
      <ul>
        <li>
          <a href={configService.docs.notion} target="_blank" rel="noopener">
            blog
          </a>
        </li>
        <li>
          <a
            href={configService.socialMedia.medium}
            target="_blank"
            rel="noopener"
          >
            medium
          </a>
        </li>
        <li>
          <a
            href={configService.github.repositoryUrl}
            target="_blank"
            rel="noopener"
          >
            github
          </a>
        </li>
        <li>
          <a target="_blank" rel="noopener">
            FAQ
          </a>
        </li>
      </ul>
    </StyledMenuList>
  )
}

export default memo(MenuList)
