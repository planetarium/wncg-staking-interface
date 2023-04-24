import { memo, MouseEvent } from 'react'
import { LayoutGroup, motion } from 'framer-motion'

import { EXIT_MOTION } from 'config/motions'
import {
  fadeIn,
  layoutTransition,
  slideInFromRight,
} from 'config/motionVariants'
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
        variants={fadeIn}
        transition={layoutTransition}
        onClick={closeSidebar}
        role="presentation"
      />

      <StyledGnbSidebarContent
        {...EXIT_MOTION}
        variants={slideInFromRight}
        transition={layoutTransition}
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

export default memo(GnbSidebar)
