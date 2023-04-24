import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { EXIT_MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'

import { StyledPoolDesktop, StyledPoolModalOverlay } from './styled'
import Icon from 'components/Icon'
import Balances from './Balances'
import Header from './Header'
import Information from './Information'
import Join from './Join'

const motionVariants = {
  initial: {
    y: '100%',
  },
  animate: {
    y: 0,
  },
  exit: {
    y: '100%',
  },
}

const motionTransition = {
  ease: 'easeOut',
  duration: 0.5,
}

type PoolDesktopProps = {
  show: boolean
  closePool(): void
}

function PoolDesktop({ show, closePool }: PoolDesktopProps) {
  return (
    <>
      <AnimatePresence>
        {show && (
          <StyledPoolModalOverlay
            {...EXIT_MOTION}
            variants={fadeIn}
            onClick={closePool}
            role="presentation"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show && (
          <StyledPoolDesktop
            {...EXIT_MOTION}
            variants={motionVariants}
            transition={motionTransition}
          >
            <div className="utils">
              <button className="closeButton" type="button" onClick={closePool}>
                <Icon icon="close" />
              </button>
            </div>

            <div className="container">
              <div className="left">
                <Header />
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

export default memo(PoolDesktop)
