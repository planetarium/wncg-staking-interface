import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import {
  ANIMATION_MAP,
  EXIT_MOTION,
  TRANSITION_MAP,
} from 'config/constants/motions'

import { StyledPoolDesktop, StyledPoolModalOverlay } from './styled'
import Icon from 'components/Icon'
import Balances from './Balances'
import Header from './Header'
import Information from './Information'
import Join from './Join'

type BalancerPoolDesktopProps = {
  show: boolean
  closePool(): void
}

function BalancerPoolDesktop({ show, closePool }: BalancerPoolDesktopProps) {
  return (
    <>
      <AnimatePresence>
        {show && (
          <StyledPoolModalOverlay
            {...EXIT_MOTION}
            variants={ANIMATION_MAP.fadeIn}
            transition={TRANSITION_MAP.modal}
            onClick={closePool}
            role="presentation"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show && (
          <StyledPoolDesktop
            {...EXIT_MOTION}
            variants={ANIMATION_MAP.appearInUp}
            transition={TRANSITION_MAP.modal}
          >
            <div className="utils">
              <button className="closeButton" type="button" onClick={closePool}>
                <Icon icon="close" />
              </button>
            </div>

            <div className="container">
              <div className="left">
                <Header />
                dklfasjkdlfajsdl
                <Information />
                <Join />
              </div>

              <div className="right">
                <Balances />
              </div>
            </div>
          </StyledPoolDesktop>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(BalancerPoolDesktop)
