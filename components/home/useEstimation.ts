import { useCallback } from 'react'

import { calcApr } from 'utils/calculator'
import Decimal, { bnum, sanitizeNumber } from 'utils/num'
import { useStakingData, useTokenPrices, useUsd } from 'hooks'

export function useEstimation() {
  const { balPrice, wncgPrice, bptPrice } = useTokenPrices()
  const { balEmissionPerSec, wncgEmissionPerSec, totalStaked } =
    useStakingData()
  const { getBptFiatValue } = useUsd()

  const getEstimation = useCallback(
    (amount: string, option: string) => {
      const totalStakedValue = getBptFiatValue(
        bnum(totalStaked).plus(bnum(amount)).toNumber()
      )

      const balApr = calcApr(balEmissionPerSec, balPrice, totalStakedValue)
      const wncgApr = calcApr(wncgEmissionPerSec, wncgPrice, totalStakedValue)

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
      getBptFiatValue,
      totalStaked,
      wncgEmissionPerSec,
      wncgPrice,
    ]
  )

  return {
    getEstimation,
  }
}

function calculateEstimatedToken(
  amount: string,
  tokenApr: number | string,
  option: string,
  bptPrice: number | string,
  tokenPrice: number | string
) {
  let pcnt = 0

  switch (option) {
    case 'day':
      pcnt = 1 / 365
      break
    case 'week':
      pcnt = 1 / 52
      break
    case 'month':
      pcnt = 1 / 12
      break
    case 'year':
      pcnt = 1
      break
    default:
      break
  }

  return new Decimal(sanitizeNumber(amount, { allowEmptyString: false }))
    .mul(tokenApr)
    .mul(pcnt)
    .mul(bptPrice)
    .div(tokenPrice)
    .div(100)
    .toNumber()
}
