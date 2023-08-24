import Link from 'next/link'

import config from 'config'
import { ANIMATION_MAP, MOTION } from 'config/constants/motions'

import { explorerUrlFor } from 'utils/explorerUrlFor'

import { StyledGnbMenuList } from './styled'
import Icon from 'components/Icon'
import { useChain } from 'hooks'

function GnbMenuList() {
  const { chainId, stakingAddress } = useChain()

  return (
    <StyledGnbMenuList {...MOTION} variants={ANIMATION_MAP.fadeIn}>
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
          href={explorerUrlFor(chainId, stakingAddress)}
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

export default GnbMenuList
