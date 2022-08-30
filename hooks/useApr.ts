import { calcApr } from 'utils/calculator'
import { useStakingData } from './useStakingData'
import { useTokenPrices } from './useTokenPrices'
import { useUsd } from './useUsd'

export function useApr() {
  const { balPrice, wncgPrice } = useTokenPrices()
  const { getBptFiatValue } = useUsd()
  const { balEmissionPerSec, wncgEmissionPerSec, totalStaked } =
    useStakingData()

  const totalStakedValue = getBptFiatValue(totalStaked)

  const wncgApr = calcApr(wncgEmissionPerSec, wncgPrice, totalStakedValue)
  const balApr = calcApr(balEmissionPerSec, balPrice, totalStakedValue)

  return {
    balApr,
    wncgApr,
  }
}
