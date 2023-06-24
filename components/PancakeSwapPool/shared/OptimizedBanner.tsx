import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import type { AddLiquidityFormElement } from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormOptimizedBanner } from './styled'
import Icon from 'components/Icon'

type AddLiquidityFormOptimizeBannerProps = {
  focusedElement: AddLiquidityFormElement
  optimized: boolean
}

export default function AddLiquidityFormOptimizedBanner({
  focusedElement,
  optimized,
}: AddLiquidityFormOptimizeBannerProps) {
  const showBanner = focusedElement === 'Optimize' && optimized

  return (
    <AnimatePresence>
      {showBanner && (
        <StyledAddLiquidityFormOptimizedBanner
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
        </StyledAddLiquidityFormOptimizedBanner>
      )}
    </AnimatePresence>
  )
}
