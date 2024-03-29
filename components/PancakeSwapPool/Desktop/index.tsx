import { AnimatePresence } from 'framer-motion'

import {
  ANIMATION_MAP,
  EXIT_MOTION,
  TRANSITION_MAP,
} from 'config/constants/motions'

import { StyledPancakeSwapPoolDesktop, StyledPoolModalOverlay } from './styled'
import Icon from 'components/Icon'
import AddLiquidity from './AddLiquidity'
import Balances from './Balances'
import Header from './Header'
import Information from './Information'

type PancakeSwapPoolDesktopProps = {
  show: boolean
  closePool(): void
}

function PancakeSwapPoolDesktop({
  show,
  closePool,
}: PancakeSwapPoolDesktopProps) {
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
          <StyledPancakeSwapPoolDesktop
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
                <Information />
                <AddLiquidity />
              </div>

              <div className="right">
                <Balances />
              </div>
            </div>
          </StyledPancakeSwapPoolDesktop>
        )}
      </AnimatePresence>
    </>
  )
}

export default PancakeSwapPoolDesktop
