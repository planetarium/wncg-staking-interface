import { NumericFormat, NumericFormatProps } from 'react-number-format'
import BigNumber from 'bignumber.js'

import { bnum } from 'utils/num'

type NumberFormatProps = {
  decimals?: number
  roundingMode?: BigNumber.RoundingMode
  showDashInInfinity?: boolean
  showDashInZero?: boolean
  showTitle?: boolean
}

function NumberFormat({
  value: defaultValue,
  allowNegative = false,
  className,
  decimals = 8,
  roundingMode = 1,
  showDashInInfinity = true,
  showDashInZero = false,
  showTitle = true,
  thousandSeparator = true,
  valueIsNumericString = true,
  ...props
}: NumberFormatProps & NumericFormatProps) {
  const bValue = bnum(bnum(defaultValue || 0).toFixed(decimals, roundingMode))

  const showDash =
    (showDashInZero && bValue.isZero()) ||
    (showDashInInfinity && !bValue.isFinite())

  if (showDash) {
    return <span className={className}>-</span>
  }

  const value = bValue.toString()

  return (
    <NumericFormat
      className={className}
      value={value}
      allowNegative={allowNegative}
      allowLeadingZeros={false}
      fixedDecimalScale={false}
      decimalScale={decimals}
      displayType="text"
      thousandSeparator={thousandSeparator}
      title={showTitle ? value : undefined}
      {...props}
    />
  )
}

export default NumberFormat
