import { useAtomValue } from 'jotai'

import { totalStakedAtom } from 'states/staking'
import { calcApr } from 'utils/calculator'
import { useStaking } from './contracts'
import { useFiatCurrency } from './useFiatCurrency'
import { useRewards } from './useRewards'

export function useApr() {
  const { getBptFiatValue } = useFiatCurrency()
  const { rewardTokenPrices } = useRewards()
  const { emissions } = useStaking()

  const totalStaked = useAtomValue(totalStakedAtom)

  const totalStakedValue = getBptFiatValue(totalStaked)

  const aprs = emissions.map((emission, i) =>
    calcApr(emission, rewardTokenPrices[i], totalStakedValue)
  )

  return {
    aprs,
    emissions,
    rewardTokenPrices,
  }
}
