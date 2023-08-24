import { MouseEvent } from 'react'
import { LayoutGroup, motion } from 'framer-motion'

import {
  ANIMATION_MAP,
  EXIT_MOTION,
  TRANSITION_MAP,
} from 'config/constants/motions'
import { useAuth } from 'hooks'

import {
  StyledGnbSidebar,
  StyledGnbSidebarContent,
  StyledGnbSidebarOverlay,
} from './styled'
import Icon from 'components/Icon'
import Suspense from 'components/Suspense'
import Account from './Account'
import MenuList from './MenuList'
import Rewards from './Rewards'
import Staking from './Staking'

type GnbSidebarProps = {
  closeSidebar(e: MouseEvent): void
}

function GnbSidebar({ closeSidebar }: GnbSidebarProps) {
  const { isConnected } = useAuth()

  return (
    <StyledGnbSidebar>
      <StyledGnbSidebarOverlay
        {...EXIT_MOTION}
        variants={ANIMATION_MAP.fadeIn}
        transition={TRANSITION_MAP.layout}
        onClick={closeSidebar}
        role="presentation"
      />

      <StyledGnbSidebarContent
        {...EXIT_MOTION}
        variants={ANIMATION_MAP.slideInFromRight}
        transition={TRANSITION_MAP.layout}
      >
        <header className="header">
          <button className="closeButton" type="button" onClick={closeSidebar}>
            <Icon icon="close" $size={24} />
          </button>
        </header>

        <motion.div className="content">
          <dl className="sidebarList">
            <LayoutGroup>
              <Account closeSidebar={closeSidebar} />

              {isConnected && (
                <Suspense>
                  <Staking closeSidebar={closeSidebar} />
                </Suspense>
              )}

              {isConnected && (
                <Suspense>
                  <Rewards closeSidebar={closeSidebar} />
                </Suspense>
              )}
            </LayoutGroup>
          </dl>

          <MenuList />
        </motion.div>
      </StyledGnbSidebarContent>
    </StyledGnbSidebar>
  )
}

export default GnbSidebar
