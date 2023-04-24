import { memo, useMemo } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import clsx from 'clsx'

import { bnum } from 'utils/bnum'
import { prepareNumber } from 'utils/prepareNumber'

import { StyledNumberFormat } from './styled'

type NumberFormatProps = Pick<NumericFormatProps, 'renderText'> & {
  value: string | number
  allowTrailingZeros?: boolean
  approx?: boolean | null
  className?: string
  colon?: boolean
  decimals?: number
  equals?: boolean
  maxDecimals?: number
  parenthesis?: boolean
  plus?: boolean
  prefix?: string
  roundingMode?: RoundingMode
  suffix?: string
  symbol?: string
  tilde?: boolean
  type?: NumericValueType
  abbr?: boolean
  minus?: boolean
}

function NumberFormat({
  value: _value,
  allowTrailingZeros = false,
  approx: _approx = null,
  className,
  colon,
  decimals: _decimals,
  equals,
  maxDecimals,
  parenthesis,
  plus,
  prefix: _prefix,
  roundingMode = 3,
  suffix: _suffix,
  symbol,
  tilde,
  type = 'token',
  abbr = false,
  minus = false,
}: NumberFormatProps) {
  const result = useMemo(
    () =>
      prepareNumber(
        type,
        _value,
        _decimals,
        maxDecimals,
        _prefix,
        _suffix,
        _approx,
        roundingMode,
        abbr
      ),
    [
      _approx,
      _decimals,
      _prefix,
      _suffix,
      _value,
      abbr,

      maxDecimals,
      roundingMode,
      type,
    ]
  )

  if (result == null) return null

  const { decimals, value, prefix, suffix, approx } = result

  return (
    <StyledNumberFormat
      className={clsx('number', className, {
        approx,
        colon,
        equals,
        parenthesis,
        plus,
        minus,
        tilde,
      })}
    >
      <NumericFormat
        value={bnum(value).toNumber()}
        prefix={prefix}
        suffix={suffix}
        allowNegative={false}
        allowLeadingZeros={false}
        fixedDecimalScale={allowTrailingZeros}
        decimalScale={decimals}
        displayType="text"
        thousandSeparator=","
        title={value}
      />
      {symbol && <span className="symbol">{symbol}</span>}
    </StyledNumberFormat>
  )
}

export default memo(NumberFormat)
