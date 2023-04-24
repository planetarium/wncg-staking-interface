import { assertUnreachable } from './assertUnreachable'
import { removeTrailingZero } from './removeTrailingZero'

export function getDefaultDecimals(type: 'fiat' | 'token' | 'percent') {
  switch (type) {
    case 'fiat':
    case 'percent':
      return 2
    case 'token':
      return 4
    default:
      assertUnreachable(type)
  }
}

export function getDefaultMaxDecimals(type: 'fiat' | 'token' | 'percent') {
  switch (type) {
    case 'fiat':
      return 4
    case 'percent':
      return 2
    case 'token':
      return 8
    default:
      assertUnreachable(type)
  }
}

export function fixDecimals(
  value: string | number,
  maxDecimals: number,
  allowTrailingZeros = false
) {
  value = removeTrailingZero(value)

  const float = value.split('.')?.[1]?.length ?? 0

  if (allowTrailingZeros) {
    return Math.max(float, maxDecimals)
  }

  return Math.min(float, maxDecimals)
}
