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
        <Link
          href={config.docs.notion}
          target="_blank"
          rel="noopener"
          aria-label="Documents"
        >
          <Icon className="iconButton" icon="docs" $size={24} />
        </Link>
      </li>

      <li className="navItem">
        <Link
          href={config.links.medium}
          target="_blank"
          rel="noopener"
          aria-label="Medium"
        >
          <Icon className="iconButton" icon="medium" $size={24} />
        </Link>
      </li>

      <li className="navItem">
        <Link
          href={explorerUrlFor(config.stakingAddress)}
          target="_blank"
          rel="noopener"
          aria-label="Etherscan"
        >
          <Icon className="iconButton" icon="etherscan" $size={24} />
        </Link>
      </li>
    </StyledGnbMenuList>
  )
}

export default memo(GnbMenuList)
