import { useAtomValue } from 'jotai'
import { parseUnits } from 'ethers/lib/utils'

import { rewardsAtom } from 'states/user'
import { useFiatCurrency } from './useFiatCurrency'
import { usePrices } from './usePrices'
import { useStaking } from './contracts'

export function useRewards() {
  const { toFiat } = useFiatCurrency()
  const { priceFor } = usePrices()
  const { rewardTokensList, rewardTokenDecimals } = useStaking()

  const rewards = useAtomValue(rewardsAtom)

  const scaledRewards = rewards.map((reward, i) =>
    parseUnits(reward, rewardTokenDecimals[i])
  )

  const rewardsInFiatValue = rewards.map((reward, i) =>
    toFiat(rewardTokensList[i], reward)
  )

  const rewardTokenPrices = rewardTokensList.map((address) => priceFor(address))

  return {
    rewards,
    rewardsInFiatValue,
    rewardTokenPrices,
    scaledRewards,
  }
}
