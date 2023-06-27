import { memo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import Link from 'next/link'

import config from 'config'
import { isEthereum } from 'utils/isEthereum'
import { useChain } from 'hooks'

import { StyledGlobalFooter } from './styled'
import Icon from 'components/Icon'
import ImportTokenDropdown from './ImportTokenDropdown'

function GlobalFooter() {
  const [showVersion, setShowVersion] = useState(false)

  const { chainId } = useChain()

  const currentBranch = process.env.NEXT_PUBLIC_AWS_BRANCH ?? ''
  const jobId = Number(process.env.NEXT_PUBLIC_AWS_JOB_ID ?? '0')
  const commitHash = process.env.NEXT_PUBLIC_AWS_COMMIT_ID ?? ''

  const githubUrl = `https://github.com/planetarium/staking_contract_wncg_${
    isEthereum(chainId) ? 'eth' : 'bsc'
  }`

  useHotkeys(
    'd+e+v',
    function () {
      if (process.env.NODE_ENV === 'development') return
      setShowVersion((prev) => !prev)
    },
    { splitKey: ',' }
  )

  return (
    <StyledGlobalFooter role="contentinfo" layout>
      <ImportTokenDropdown className="handheldOnly" />

      <div className="left">
        <h5 className="title">
          <strong>
            {config.stakingAppName}
            {showVersion && (
              <span className="version">
                {currentBranch}#{jobId} ({commitHash.slice(0, 6)})
              </span>
            )}
          </strong>
          <span>&copy; 2023 {config.stakingAppName}</span>
        </h5>

        <div className="buttonGroup">
          <Link
            className="linkButton"
            href="/docs/terms"
            target="_blank"
            rel="noopener"
          >
            Terms of Use
          </Link>

          <Link
            className="linkButton"
            href="/docs/privacy"
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
          href={githubUrl}
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
