import { utils } from 'ethers'
import type { BigNumberish } from 'ethers'
import OldBigNumber from 'bignumber.js'

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

export function bnum(value: string | number | OldBigNumber): OldBigNumber {
  const number =
    typeof value === 'string' || typeof value === 'number'
      ? sanitizeNumber(value)
      : OldBigNumber.isBigNumber(value)
      ? value.toString()
      : '0'
  return new OldBigNumber(number)
}

export function isLessThanMinAmount(
  amount: string | number,
  minAmount = 0.0001
) {
  const bAmount = bnum(amount)
  return !bAmount.isZero() && bAmount.lt(minAmount)
}

export function hasAmounts(amounts: string[]) {
  return amounts.some((amount) => bnum(amount).gt(0))
}
