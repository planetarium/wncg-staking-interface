import { useEffect, useMemo, useState } from 'react'
import { usePrevious } from 'react-use'
import {
  CountUp as ReactCountUp,
  Props as ReactCountUpProps,
} from 'use-count-up'
import type { CSSProperties } from 'styled-components'
import clsx from 'clsx'

import { bnum } from 'utils/bnum'
import { fixDecimals } from 'utils/decimals'
import { DEFAULT_VALUE, prepareNumber } from 'utils/prepareNumber'

import { StyledCountUp } from './styled'

type CountUpProps = Omit<ReactCountUpProps, 'value' | 'decimalPlaces'> & {
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
  style?: CSSProperties
  tilde?: boolean
  type?: NumericValueType
  abbr?: boolean
}

function CountUp({
  value: _value,
  allowTrailingZeros = false,
  approx: _approx = null,
  className,
  colon = false,
  decimals: _decimals,
  duration = 0.75,
  equals = false,
  maxDecimals,
  parenthesis = false,
  plus = false,
  prefix: _prefix,
  roundingMode = 3, // ROUND_DOWN
  style = {},
  suffix: _suffix,
  symbol,
  tilde = false,
  type = 'token',
  abbr,
}: CountUpProps) {
  const [start, setStart] = useState(0)

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

  const { decimals, value, prefix, approx, suffix } = result || DEFAULT_VALUE

  const prevValue = usePrevious(value)

  useEffect(() => {
    if (prevValue == null || value == null) return
    if (!bnum(prevValue).eq(value)) {
      setStart(bnum(prevValue).toNumber() || 0)
    }
  }, [_value, prevValue, value])

  if (result == null) return null

  return (
    <StyledCountUp
      className={clsx('countUp', className, {
        approx,
        colon,
        equals,
        parenthesis,
        plus: plus && !bnum(value!).isZero(),
        tilde,
      })}
      style={style}
    >
      {prefix}
      <ReactCountUp
        isCounting
        key={`countUp:${start}:${value}`}
        start={start}
        end={bnum(value!).toNumber()}
        duration={duration}
        decimalPlaces={fixDecimals(value!, decimals, allowTrailingZeros)}
        decimalSeparator="."
        thousandsSeparator=","
      />
      {suffix}
      {symbol && <span className="symbol">{symbol}</span>}
    </StyledCountUp>
  )
}

export default CountUp
