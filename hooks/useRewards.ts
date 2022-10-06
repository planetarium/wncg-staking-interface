import { useAtomValue } from 'jotai'
import { parseUnits } from 'ethers/lib/utils'

import {
  rewardTokenDecimalsAtom,
  rewardTokensListAtom,
  rewardTokenSymbolsAtom,
} from 'states/staking'
import { rewardsAtom } from 'states/user'
import { useFiatCurrency } from './useFiatCurrency'

export function useRewards() {
  const { toFiat } = useFiatCurrency()

  const rewards = useAtomValue(rewardsAtom)
  const rewardTokensList = useAtomValue(rewardTokensListAtom)
  const rewardTokenDecimals = useAtomValue(rewardTokenDecimalsAtom)
  const rewardTokenSymbols = useAtomValue(rewardTokenSymbolsAtom)

  const scaledRewards = rewards.map((reward, i) =>
    parseUnits(reward, rewardTokenDecimals[i])
  )
  const rewardsInFiatValue = rewards.map((reward, i) =>
    toFiat(rewardTokensList[i], reward)
  )

  return {
    rewards,
    rewardsInFiatValue,
    rewardTokensList,
    rewardTokenSymbols,
    scaledRewards,
  }
}
