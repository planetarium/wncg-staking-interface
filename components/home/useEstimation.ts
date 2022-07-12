import { useCallback } from 'react'

import { getTotalStaked } from 'app/states/bpt'
import { getBalEmissionPerSec, getWncgEmissionPerSec } from 'app/states/reward'
import { getBalPrice, getBptPrice, getWncgPrice } from 'app/states/token'
import { assertUnreachable } from 'utils/assertion'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector } from 'hooks'
import { calculateApr } from 'hooks/useApr'

export function useEstimation() {
  const balEmissionPerSec = useAppSelector(getBalEmissionPerSec)
  const balPrice = useAppSelector(getBalPrice)
  const bptPrice = useAppSelector(getBptPrice)
  const wncgEmissionPerSec = useAppSelector(getWncgEmissionPerSec)
  const wncgPrice = useAppSelector(getWncgPrice)
  const totalStaked = useAppSelector(getTotalStaked)

  const getEstimation = useCallback(
    (amount: string, option: string) => {
      const value = sanitizeNumber(amount, { allowEmptyString: false })
      const totalStakedValue = new Decimal(totalStaked)
        .plus(value)
        .mul(bptPrice)
        .toNumber()

      const balApr = calculateApr(balEmissionPerSec, balPrice, totalStakedValue)
      const wncgApr = calculateApr(
        wncgEmissionPerSec,
        wncgPrice,
        totalStakedValue
      )

      const newBal = calculateEstimatedToken(
        amount,
        balApr,
        option,
        bptPrice,
        balPrice
      )
      const newWncg = calculateEstimatedToken(
        amount,
        wncgApr,
        option,
        bptPrice,
        wncgPrice
      )

      return {
        bal: newBal,
        wncg: newWncg,
      }
    },
    [
      balEmissionPerSec,
      balPrice,
      bptPrice,
      totalStaked,
      wncgEmissionPerSec,
      wncgPrice,
    ]
  )

  return {
    getEstimation,
  }
}

function getOptionPercentage(option: string) {
  switch (option) {
    case 'day':
      return 1 / 365
    case 'week':
      return 1 / 52
    case 'month':
      return 1 / 12
    case 'year':
      return 1
    default:
      assertUnreachable(option)
  }
}

function calculateEstimatedToken(
  amount: string,
  tokenApr: number,
  option: string,
  bptPrice: number,
  tokenPrice: number
) {
  return new Decimal(sanitizeNumber(amount, { allowEmptyString: false }))
    .mul(tokenApr)
    .mul(getOptionPercentage(option))
    .mul(bptPrice)
    .div(tokenPrice)
    .div(100)
    .toNumber()
}
