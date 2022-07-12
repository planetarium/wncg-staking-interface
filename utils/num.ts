import { Decimal } from 'decimal.js'
import { BigNumberish, utils } from 'ethers'

Decimal.set({
  precision: 20,
  rounding: 4,
  toExpNeg: -20,
  toExpPos: 21,
  modulo: 1,
  crypto: false,
})

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

export function etherToWei(amount: string) {
  return utils.parseEther(amount).toString()
}

export function weiToEther(amount: BigNumberish) {
  return utils.formatEther(amount)
}

export default Decimal
