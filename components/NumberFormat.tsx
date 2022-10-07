import { NumericFormat } from 'react-number-format'
import type { NumericFormatProps } from 'react-number-format'

import { bnum } from 'utils/num'

type NumberFormatProps = NumericFormatProps & {
  showDashInInfinity?: boolean
  showDashInZero?: boolean
  showTitle?: boolean
}

export function NumberFormat({
  value: defaultValue,
  allowNegative = false,
  decimalScale = 8,
  valueIsNumericString = true,
  showDashInInfinity = true,
  showDashInZero = true,
  showTitle = true,
  thousandSeparator = true,
  className,
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
      displayType="text"
      decimalScale={decimalScale}
      thousandSeparator={thousandSeparator}
      title={showTitle ? value : undefined}
      {...props}
    />
  )
}
