import { useMemo } from 'react'

import config from 'config'
import { parseUnits } from 'utils/parseUnits'
import { useFiat } from './useFiat'
import { useStaking } from './useStaking'
import { useFetchUserData } from './queries'

export function useRewards() {
  const toFiat = useFiat()
  const { rewardTokenAddress, rewardTokenAddresses, tokenMap } = useStaking()
  const { earnedRewards = [] } = useFetchUserData().data ?? {}

  const rewardsInFiatValue = useMemo(
    () =>
      earnedRewards.map((reward, i) => toFiat(reward, rewardTokenAddresses[i])),
    [rewardTokenAddresses, earnedRewards, toFiat]
  )

  const rewardTokenPrices = useMemo(
    () => rewardTokenAddresses.map((a) => toFiat(1, a)),
    [toFiat, rewardTokenAddresses]
  )

  const rewardTokenSymbols = useMemo(
    () => rewardTokenAddresses.map((a) => tokenMap[a].symbol),
    [rewardTokenAddresses, tokenMap]
  )

  const rewardTokenDecimals = useMemo(
    () => rewardTokenAddresses.map((a) => tokenMap[a].decimals),
    [rewardTokenAddresses, tokenMap]
  )

  const rewardTokenIndex = useMemo(
    () => rewardTokenAddresses.indexOf(rewardTokenAddress),
    [rewardTokenAddress, rewardTokenAddresses]
  )

  const balTokenIndex = useMemo(
    () => rewardTokenAddresses.indexOf(config.bal),
    [rewardTokenAddresses]
  )

  const scaledRewards = useMemo(
    () =>
      earnedRewards.map((reward, i) =>
        parseUnits(reward, rewardTokenDecimals[i])
      ),
    [rewardTokenDecimals, earnedRewards]
  )

  return {
    balTokenIndex,
    rewards: earnedRewards,
    rewardsInFiatValue,
    rewardTokenAddress,
    rewardTokenIndex,
    rewardTokenAddresses,
    rewardTokenPrices,
    rewardTokenDecimals,
    rewardTokenSymbols,
    scaledRewards,
  }
}
