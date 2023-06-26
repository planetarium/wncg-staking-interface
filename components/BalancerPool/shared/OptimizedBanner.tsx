import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import type { JoinPoolFormElement } from 'hooks/balancer/useJoinForm'

import { StyledJoinFormOptimizedBanner } from './styled'
import Icon from 'components/Icon'

type JoinFormOptimizeBannerProps = {
  focusedElement: JoinPoolFormElement
  optimized: boolean
}

export default function JoinFormOptimizedBanner({
  focusedElement,
  optimized,
}: JoinFormOptimizeBannerProps) {
  const showBanner = focusedElement === 'Optimize' && optimized

  return (
    <AnimatePresence>
      {showBanner && (
        <StyledJoinFormOptimizedBanner
          {...EXIT_MOTION}
          layout
          variants={ANIMATION_MAP.slideInDown}
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
