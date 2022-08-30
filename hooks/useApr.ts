import { configService } from 'services/config'
import { calcApr } from 'utils/calculator'
import { useStaking } from './useStaking'
import { usePrices } from './usePrices'
import { useFiatCurrency } from './useFiatCurrency'

export function useApr() {
  const { priceFor } = usePrices()
  const { getBptFiatValue } = useFiatCurrency()
  const { balEmissionPerSec, wncgEmissionPerSec, totalStaked } = useStaking()

  const emissionPerSecList = [wncgEmissionPerSec, balEmissionPerSec]
  const rewardTokenPriceList = configService.rewardTokensList.map((address) =>
    priceFor(address)
  )

  const totalStakedValue = getBptFiatValue(totalStaked)

  const aprs = emissionPerSecList.map((emission, i) =>
    calcApr(emission, rewardTokenPriceList[i], totalStakedValue)
  )

  return {
    aprs,
    emissionPerSecList,
    rewardTokenPriceList,
    totalStakedValue,
  }
}
