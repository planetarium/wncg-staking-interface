import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { slideInDown } from 'constants/motionVariants'
import { bnum } from 'utils/num'
import { useAccount } from 'hooks'

import { StyledAvailableTokenAmount } from './styled'
import NumberFormat from 'new/NumberFormat'

type AvailableTokenAmountProps = {
  label: string
  maxAmount: string | number
  decimals?: number
}

function AvailableTokenAmount({
  label,
  maxAmount,
  decimals = 4,
}: AvailableTokenAmountProps) {
  const { isConnected } = useAccount()
  const bMaxAmount = bnum(maxAmount)

  const invalidMaxAmount = bMaxAmount.isNaN() || !bMaxAmount.isFinite()
  const show = isConnected && !invalidMaxAmount

  return (
    <AnimatePresence>
      {show && (
        <StyledAvailableTokenAmount
          className="availableTokenAmount"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideInDown}
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
