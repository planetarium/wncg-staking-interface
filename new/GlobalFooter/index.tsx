import { memo } from 'react'
import Link from 'next/link'
import styled from 'styled-components'

import { configService } from 'services/config'

import { Icon } from 'components/Icon'

const StyledGlobalFooter = styled.footer`
  display: flex;
  justify-content: space-between;

  ul {
    display: flex;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

function GlobalFooter() {
  return (
    <StyledGlobalFooter>
      <ul>
        <li>
          <a
            href={configService.socialMedia.twitter}
            target="_blank"
            rel="noopener"
          >
            <Icon id="twitter" />
          </a>
        </li>
        <li>
          <a
            href={configService.socialMedia.discord}
            target="_blank"
            rel="noopener"
          >
            <Icon id="discord" />
          </a>
        </li>
        <li>
          <a
            href={configService.socialMedia.telegram}
            target="_blank"
            rel="noopener"
          >
            <Icon id="twitter" />
          </a>
        </li>
      </ul>

      <div>
        <Link href="/wncg/terms">Terms of Use</Link>
        <Link href="/wncg/privacy">Privacy Policy</Link>
        <div>
          <strong>WNCG Staking</strong>
          <span>© 2022 WNCG Staking</span>
        </div>
      </div>
    </StyledGlobalFooter>
  )
}

export default memo(GlobalFooter)
