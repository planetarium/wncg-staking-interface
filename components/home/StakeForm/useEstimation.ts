import { useCallback } from 'react'

import { calcApr } from 'utils/calculator'
import { bnum } from 'utils/num'
import { useStaking, usePrices, useFiatCurrency, useApr } from 'hooks'

export function useEstimation() {
  const { emissionPerSecList, rewardTokenPriceList } = useApr()
  const { getBptFiatValue } = useFiatCurrency()
  const { bptPrice } = usePrices()
  const { totalStaked } = useStaking()

  const calcEstimatedRevenue = useCallback(
    (amount: string, option: string) => {
      const totalStakedValue = getBptFiatValue(
        bnum(totalStaked).plus(bnum(amount)).toNumber()
      )
      const aprs = emissionPerSecList.map((emission, i) =>
        calcApr(emission, rewardTokenPriceList[i], totalStakedValue)
      )

      return aprs.map((apr, i) =>
        calcRevenue(amount, apr, option, bptPrice, rewardTokenPriceList[i])
      )
    },
    [
      bptPrice,
      emissionPerSecList,
      getBptFiatValue,
      rewardTokenPriceList,
      totalStaked,
    ]
  )

  return {
    calcEstimatedRevenue,
  }
}

function calcRevenue(
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

  const value = bnum(amount)
    .times(tokenApr)
    .times(pcnt)
    .times(bptPrice)
    .div(tokenPrice)
    .div(100)

  return value.isFinite() && !value.isNaN() ? value.toNumber() : 0
}
