import { memo } from 'react'
import Link from 'next/link'

import config from 'config'

import { StyledGlobalFooter } from './styled'
import Icon from 'components/Icon'
import ImportTokenDropdown from './ImportTokenDropdown'

function GlobalFooter() {
  return (
    <StyledGlobalFooter role="contentinfo" layout>
      <ImportTokenDropdown className="handheldOnly" />

      <div className="left">
        <h5 className="title">
          <strong>{config.appName}</strong>
          <span>&copy; 2023 {config.appName}</span>
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
        <ImportTokenDropdown className="browserOnly" />

        <Link
          className="iconButton"
          href={config.links.twitter}
          target="_blank"
          rel="noopener"
          aria-label="Open twitter"
        >
          <Icon icon="twitter" $size={24} />
        </Link>

        <Link
          className="iconButton"
          href={config.links.discord}
          target="_blank"
          rel="noopener"
          aria-label="Open discord"
        >
          <Icon icon="discord" $size={24} />
        </Link>

        <Link
          className="iconButton"
          href={config.github.repositoryUrl}
          target="_blank"
          rel="noopener"
          aria-label="Open github"
        >
          <Icon icon="github" $size={24} />
        </Link>
      </div>
    </StyledGlobalFooter>
  )
}

export default memo(GlobalFooter)
