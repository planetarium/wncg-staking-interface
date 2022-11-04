import { useAtomValue } from 'jotai'

import { totalStakedAtom } from 'states/staking'
import { calcApr } from 'utils/calculator'
import { useFiatCurrency } from './useFiatCurrency'
import { useRewards } from './useRewards'
import { useStaking } from './useStaking'

export function useApr() {
  const { bptToFiat } = useFiatCurrency()
  const { rewardTokenPrices } = useRewards()
  const { emissions } = useStaking()

  const totalStaked = useAtomValue(totalStakedAtom)

  const totalStakedValue = bptToFiat(totalStaked)

  const aprs = emissions.map((emission, i) =>
    calcApr(emission, rewardTokenPrices[i], totalStakedValue)
  )

  return {
    aprs,
    emissions,
    rewardTokenPrices,
  }
}
