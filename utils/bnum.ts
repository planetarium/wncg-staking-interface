import BigNumber from 'bignumber.js'

BigNumber.config({ EXPONENTIAL_AT: [-40, 40] })

type SanitizeNumberValueOption = {
  allowEmptyString?: boolean
}

export function sanitizeNumber(
  value?: string | number | null,
  options?: SanitizeNumberValueOption
) {
  const { allowEmptyString } = options || {}
  let newValue = value ? String(value) : ''
  newValue = newValue.replace(/,/g, '')

  if (!newValue && !allowEmptyString) {
    newValue = '0'
  }

  return newValue
}

export function bnum(value: string | number | BigNumber): BigNumber {
  const number =
    typeof value === 'string' || typeof value === 'number'
      ? sanitizeNumber(value)
      : BigNumber.isBigNumber(value)
      ? value.toString()
      : '0'
  return new BigNumber(number)
}
