import { AnimatePresence } from 'framer-motion'

import { EXIT_MOTION } from 'config/motions'
import { slideInDown } from 'config/motionVariants'
import type { JoinFormFocusedElement } from 'hooks/useJoinForm'

import { StyledJoinFormOptimizedBanner } from './styled'
import Icon from 'components/Icon'

type JoinFormOptimizeBannerProps = {
  focusedElement: JoinFormFocusedElement
  optimized: boolean
}

export default function JoinFormOptimizedBanner({
  focusedElement,
  optimized,
}: JoinFormOptimizeBannerProps) {
  const showBanner = focusedElement === 'OptimizeButton' && optimized

  return (
    <AnimatePresence>
      {showBanner && (
        <StyledJoinFormOptimizedBanner
          {...EXIT_MOTION}
          layout
          variants={slideInDown}
        >
          <span className="title">
            Optimized
            <Icon icon="check" />
          </span>

          <p className="desc">
            The maximum amount is entered while maintaining a pool ratio within
            the balance.
          </p>
        </StyledJoinFormOptimizedBanner>
      )}
    </AnimatePresence>
  )
}
