import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

import { slideInDown } from 'constants/motionVariants'
import { REKT_PRICE_IMPACT } from 'constants/poolLiquidity'

import { StyledRektPriceImpact } from './styled'
import SvgIcon from 'new/SvgIcon'

type RektPriceImpactProps = {
  action: 'join' | 'exit'
  priceImpact: number
  className?: string
}

function RektPriceImpact({
  action,
  priceImpact,
  className,
}: RektPriceImpactProps) {
  const show = priceImpact >= REKT_PRICE_IMPACT

  return (
    <AnimatePresence>
      {show && (
        <StyledRektPriceImpact
          className={clsx('rektPriceImpact', className)}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideInDown}
          role="alert"
        >
          <SvgIcon icon="warning" />
          <h4 className="title">
            If the price impact exceeds 20%, {action} pool cannot be performed
          </h4>
        </StyledRektPriceImpact>
      )}
    </AnimatePresence>
  )
}

export default RektPriceImpact
