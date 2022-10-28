import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { slideInDown } from 'constants/motionVariants'
import { bnum } from 'utils/num'
import { useAccount } from 'hooks'

import { StyledAvailableTokenAmount } from './styled'
import NumberFormat from 'new/NumberFormat'

type AvailableTokenAmountProps = {
  label: string
  maxAmount?: string | number
  fiatValue?: number
  decimals?: number
}

function AvailableTokenAmount({
  label,
  maxAmount,
  fiatValue,
  decimals = 4,
}: AvailableTokenAmountProps) {
  const { isConnected } = useAccount()
  const bMaxAmount = bnum(maxAmount || 0)

  const invalidMaxAmount =
    typeof maxAmount === 'undefined' ||
    bMaxAmount.isNaN() ||
    !bMaxAmount.isFinite()
  const show = isConnected && !invalidMaxAmount
  const showFiatValue = typeof fiatValue === 'number'

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
            {showFiatValue && (
              <NumberFormat
                className="usd"
                value={fiatValue}
                decimals={2}
                prefix="($"
                suffix=")"
              />
            )}
          </dd>
        </StyledAvailableTokenAmount>
      )}
    </AnimatePresence>
  )
}

export default memo(AvailableTokenAmount)
