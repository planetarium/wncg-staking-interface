import { useAtomValue } from 'jotai'

import {
  emissionListAtom,
  rewardTokensListAtom,
  totalStakedAtom,
} from 'states/staking'
import { calcApr } from 'utils/calculator'
import { useFiatCurrency } from './useFiatCurrency'
import { usePrices } from './usePrices'

export function useApr() {
  const { getBptFiatValue } = useFiatCurrency()
  const { priceFor } = usePrices()

  const rewardTokensList = useAtomValue(rewardTokensListAtom)
  const emissionPerSecList = useAtomValue(emissionListAtom)
  const totalStaked = useAtomValue(totalStakedAtom)

  const rewardTokenPriceList = rewardTokensList.map((address) =>
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
