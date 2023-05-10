import { memo } from 'react'
import Link from 'next/link'

import config from 'config'
import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { explorerUrlFor } from 'utils/explorerUrlFor'

import { StyledGnbMenuList } from './styled'
import Icon from 'components/Icon'

function GnbMenuList() {
  return (
    <StyledGnbMenuList {...MOTION} variants={fadeIn}>
      <li className="navItem">
        <Link href={config.docs.notion} target="_blank" rel="noopener">
          <span className="textButton">
            Docs
            <Icon icon="outlink" />
          </span>

          <Icon
            className="iconButton"
            icon="docs"
            ariaLabel="Documents"
            $size={24}
          />
        </Link>
      </li>

      <li className="navItem">
        <Link href={config.links.medium} target="_blank" rel="noopener">
          <span className="textButton">
            Medium
            <Icon icon="outlink" />
          </span>

          <Icon
            className="iconButton"
            icon="medium"
            ariaLabel="Medium"
            $size={24}
          />
        </Link>
      </li>

      <li className="navItem">
        <Link
          href={explorerUrlFor(config.stakingAddress)}
          target="_blank"
          rel="noopener"
        >
          <span className="textButton">
            Etherscan
            <Icon icon="outlink" />
          </span>

          <Icon
            className="iconButton"
            icon="etherscan"
            ariaLabel="Etherscan"
            $size={24}
          />
        </Link>
      </li>
    </StyledGnbMenuList>
  )
}

export default memo(GnbMenuList)
