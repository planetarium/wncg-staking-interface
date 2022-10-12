import { NumericFormat } from 'react-number-format'
import type { NumericFormatProps } from 'react-number-format'

import { bnum } from 'utils/num'

type NumberFormatProps = NumericFormatProps & {
  decimals?: number
  showDashInInfinity?: boolean
  showDashInZero?: boolean
  showTitle?: boolean
}

function NumberFormat({
  value: defaultValue,
  allowNegative = false,
  className,
  decimals = 8,
  showDashInInfinity = true,
  showDashInZero = true,
  showTitle = true,
  thousandSeparator = true,
  valueIsNumericString = true,
  ...props
}: NumberFormatProps) {
  const bValue = bnum(defaultValue || 0)

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
      decimalScale={decimals}
      displayType="text"
      thousandSeparator={thousandSeparator}
      title={showTitle ? value : undefined}
      {...props}
    />
  )
}

export default NumberFormat
