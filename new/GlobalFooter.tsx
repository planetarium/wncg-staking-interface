import { memo } from 'react'
import Link from 'next/link'

import { configService } from 'services/config'

import { StyledGlobalFooter } from './styled'
import SvgIcon from './SvgIcon'

function GlobalFooter() {
  return (
    <StyledGlobalFooter className="globalFooter">
      <div className="container">
        <div className="content">
          <h5>
            <strong>WNCG Staking</strong>
            <span>© 2022 WNCG Staking</span>
          </h5>

          <Link href="/wncg/terms">
            <a>Terms of Use</a>
          </Link>
          <Link href="/wncg/privacy">
            <a>Privacy Policy</a>
          </Link>
        </div>

        <ul className="buttonGroup">
          <li>
            <a
              className="snsButton"
              href={configService.socialMedia.twitter}
              target="_blank"
              rel="noopener"
              aria-label="Open twitter"
            >
              <SvgIcon icon="twitter" $size={24} />
            </a>
          </li>
          <li>
            <a
              className="snsButton"
              href={configService.socialMedia.discord}
              target="_blank"
              rel="noopener"
              aria-label="Open discord"
            >
              <SvgIcon icon="discord" $size={24} />
            </a>
          </li>
          <li>
            <a
              className="snsButton"
              href={configService.socialMedia.telegram}
              target="_blank"
              rel="noopener"
              aria-label="Open telegram"
            >
              <SvgIcon icon="telegram" $size={24} />
            </a>
          </li>
        </ul>
      </div>
    </StyledGlobalFooter>
  )
}

export default memo(GlobalFooter)
