import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useAuth } from 'hooks'

import { InputSize, StyledAvailableBalance } from './styled'
import NumberFormat from 'components/NumberFormat'

type AvailableBalanceProps = {
  label: string
  maxAmount: string | number
  decimals?: number
  fiatValue?: number | string
  disabled?: boolean
  symbol?: string
  $size?: InputSize
}

function AvailableBalance({
  label,
  maxAmount,
  decimals = 8,
  fiatValue,
  disabled,
  symbol,
  $size = 'lg',
}: AvailableBalanceProps) {
  const { isConnected } = useAuth()
  const bMaxAmount = bnum(maxAmount)

  const invalidMaxAmount = bMaxAmount.isNaN() || !bMaxAmount.isFinite()
  const showFiatValue = fiatValue != null && !bMaxAmount.isZero()

  if (!isConnected || invalidMaxAmount) return null

  return (
    <StyledAvailableBalance
      {...MOTION}
      className="availableTokenAmount"
      variants={ANIMATION_MAP.slideInDown}
      transition={{ easing: 'linear' }}
      $disabled={disabled}
      $size={$size}
    >
      <dt>{label}</dt>
      <dd>
        <NumberFormat value={maxAmount} symbol={symbol} decimals={decimals} />

        {showFiatValue && (
          <span className="parenthesis">
            <NumberFormat className="usd" value={fiatValue} type="fiat" />
          </span>
        )}
      </dd>
    </StyledAvailableBalance>
  )
}

export default AvailableBalance
