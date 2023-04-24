import { UNIT } from 'config/misc'
import { bnum } from './bnum'
import { getDefaultDecimals, getDefaultMaxDecimals } from './decimals'
import { formatUnits } from './formatUnits'

export function prepareNumber(
  type: NumericValueType,
  _value?: string | number | null,
  _decimals?: number,
  _maxDecimals?: number,
  _prefix?: string,
  _suffix?: string,
  _approx?: boolean | null,
  roundingMode?: RoundingMode,
  abbr?: boolean
) {
  if (_value == null) return null

  const initDecimals = _decimals ?? getDefaultDecimals(type)
  const initMaxDecimals = _maxDecimals ?? getDefaultMaxDecimals(type)

  let prefix = _prefix ?? (type === 'fiat' ? '$' : '')
  const approx = _approx ?? (type === 'fiat' ? true : false)
  let suffix = _suffix ?? (type === 'percent' ? '%' : undefined)

  const maxDecimals = Math.max(initMaxDecimals, initDecimals)

  let decimals = initDecimals

  const softMinAmount = formatUnits(UNIT, decimals).toString()
  const hardMinAmount = formatUnits(UNIT, maxDecimals).toString()

  const bValue = bnum(bnum(_value).toFixed(decimals, roundingMode))

  let value = bValue.toString()

  if (type === 'percent') {
    return {
      value,
      decimals: bnum(value).gte(100) ? 0 : decimals,
      prefix,
      suffix: '%',
      approx,
    }
  }

  if (bnum(_value).isZero()) {
    return {
      value: '0',
      decimals: 0,
      prefix,
      suffix,
      approx: false,
    }
  }

  if (bnum(value).lt(softMinAmount)) {
    value = bnum(_value).toFixed(maxDecimals, roundingMode)

    if (bnum(value).lt(hardMinAmount)) {
      return {
        value: hardMinAmount,
        decimals: maxDecimals,
        prefix: `<${prefix}`,
        approx,
        suffix,
      }
    }

    return {
      value,
      decimals: maxDecimals,
      prefix,
      approx,
      suffix,
    }
  }

  if (!!abbr) {
    if (bnum(value).gte(1000000000000)) {
      return {
        value: bnum(value).div(1000000000000).toFixed(2, 3),
        decimals: 2,
        suffix: suffix ? `T${suffix}` : `T`,
        prefix,
        approx,
      }
    }

    if (bnum(value).gte(1000000000)) {
      return {
        value: bnum(value).div(1000000000).toFixed(2, 3),
        decimals: 2,
        suffix: suffix ? `B${suffix}` : `B`,
        prefix,
        approx,
      }
    }

    if (bnum(value).gte(1000000)) {
      return {
        value: bnum(value).div(1000000).toFixed(2, 3),
        decimals: 2,
        suffix: suffix ? `M${suffix}` : `M`,
        prefix,
        approx,
      }
    }
  }

  return {
    value,
    decimals,
    suffix,
    prefix,
    approx,
  }
}

export const DEFAULT_VALUE = {
  decimals: 0,
  value: null,
  suffix: null,
  prefix: null,
  approx: null,
}
