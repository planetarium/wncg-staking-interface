import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { AddLiquidityFormElement } from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormAlert } from './styled'
import Icon from 'components/Icon'

type AddLiquidityFormOptimizeBannerProps = {
  focusedElement: AddLiquidityFormElement
  optimized: boolean
}

export default function AddLiquidityFormOptimizeBanner({
  focusedElement,
  optimized,
}: AddLiquidityFormOptimizeBannerProps) {
  const showBanner = focusedElement === 'Optimize' && optimized

  return (
    <AnimatePresence>
      {showBanner && (
        <StyledAddLiquidityFormAlert
          {...EXIT_MOTION}
          layout
          variants={ANIMATION_MAP.slideInDown}
          $optimized
        >
          <span className="title">
            Optimized
            <Icon icon="check" />
          </span>

          <p className="desc">
            The maximum amount is entered while maintaining a 5:5 ratio within
            the balance.
          </p>
        </StyledAddLiquidityFormAlert>
      )}
    </AnimatePresence>
  )
}
