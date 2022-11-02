import { useCallback } from 'react'
import { useAtomValue } from 'jotai'

import { totalStakedAtom } from 'states/staking'
import { calcApr } from 'utils/calculator'
import { bnum } from 'utils/num'
import { useApr, useFiatCurrency, usePrices } from 'hooks'

export function useEstimation() {
  const { emissions, rewardTokenPrices } = useApr()
  const { bptToFiat } = useFiatCurrency()
  const { bptPrice } = usePrices()

  const totalStaked = useAtomValue(totalStakedAtom)

  const calcEstimatedRevenue = useCallback(
    (amount: string, option: string) => {
      const totalStakedValue = bptToFiat(
        bnum(totalStaked).plus(bnum(amount)).toNumber()
      )
      const aprs = emissions.map((emission, i) =>
        calcApr(emission, rewardTokenPrices[i], totalStakedValue)
      )

      return aprs.map((apr, i) =>
        calcRevenue(amount, apr, option, bptPrice, rewardTokenPrices[i])
      )
    },
    [bptPrice, emissions, bptToFiat, rewardTokenPrices, totalStaked]
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
