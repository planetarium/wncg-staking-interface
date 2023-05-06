import { memo } from 'react'
import Link from 'next/link'

import config from 'config'

import { StyledGlobalFooter } from './styled'
import Icon from 'components/Icon'
import ImportTokenDropdown from './ImportTokenDropdown'

function GlobalFooter() {
  return (
    <StyledGlobalFooter role="contentinfo" layout>
      <div className="left">
        <h5 className="title">
          <strong>{config.appName}</strong>
          <span>&copy; 2022 {config.appName}</span>
        </h5>

        <div className="buttonGroup">
          <Link
            className="linkButton"
            href="/wncg/terms"
            target="_blank"
            rel="noopener"
          >
            Terms of Use
          </Link>

          <Link
            className="linkButton"
            href="/wncg/privacy"
            target="_blank"
            rel="noopener"
          >
            Privacy Policy
          </Link>
        </div>
      </div>

      <div className="right">
        <ImportTokenDropdown />

        <a
          className="iconButton"
          href={config.links.twitter}
          target="_blank"
          rel="noopener"
          aria-label="Open twitter"
        >
          <Icon icon="twitter" $size={24} />
        </a>

        <a
          className="iconButton"
          href={config.links.discord}
          target="_blank"
          rel="noopener"
          aria-label="Open discord"
        >
          <Icon icon="discord" $size={24} />
        </a>
      </div>
    </StyledGlobalFooter>
  )
}

export default memo(GlobalFooter)
