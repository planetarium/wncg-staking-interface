import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { bnum } from 'utils/num'

import { StyledAvailableTokenAmount } from './styled'
import NumberFormat from 'new/NumberFormat'

const motionVariants = {
  initial: {
    opacity: 0,
    y: '-100%',
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: '-100%',
  },
}

type AvailableTokenAmountProps = {
  label: string
  maxAmount: string | number
  decimals?: number
  disabled?: boolean
}

function AvailableTokenAmount({
  label,
  maxAmount,
  decimals = 4,
  disabled = false,
}: AvailableTokenAmountProps) {
  const bMaxAmount = bnum(maxAmount)

  const invalid =
    bMaxAmount.isZero() || bMaxAmount.isNaN() || !bMaxAmount.isFinite()

  return (
    <AnimatePresence>
      {(!invalid || disabled) && (
        <StyledAvailableTokenAmount
          className="availableTokenAmount"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={motionVariants}
        >
          <dt>{label}</dt>
          <dd>
            <NumberFormat value={maxAmount} decimals={decimals} />
          </dd>
        </StyledAvailableTokenAmount>
      )}
    </AnimatePresence>
  )
}

export default memo(AvailableTokenAmount)
