import { useQueries } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { parseUnits } from 'ethers/lib/utils'

import { accountState } from 'app/states/connection'
import { configService } from 'services/config'
import { getEarnedBal, getEarnedWncg } from 'contracts/staking'
import { REFETCH_INTERVAL } from 'constants/time'
import { getTokenInfo } from 'utils/token'
import { useFiatCurrency } from './useFiatCurrency'
import { useStakingContract } from './useStakingContract'

const queryFnList = [getEarnedWncg, getEarnedBal]

export function useRewards() {
  const { toFiat } = useFiatCurrency()
  const { contract, stakingAddress } = useStakingContract(true)

  const account = useRecoilValue(accountState)

  const { rewardTokensList } = configService
  const rewardTokenDecimals = rewardTokensList.map(
    (address) => getTokenInfo(address).decimals
  )
  const rewardTokenSymbols = rewardTokensList.map(
    (address) => getTokenInfo(address).symbol
  )

  const rewardsQuery = useQueries({
    queries: rewardTokensList.map((address, i) => ({
      queryKey: ['claimableRewards', address, stakingAddress],
      queryFn: () =>
        queryFnList[i]?.(contract!, account, rewardTokenDecimals[i]),
      enabled: !!contract,
      placeholderData: '0',
      refetchInterval: REFETCH_INTERVAL,
    })),
  })

  const rewards = rewardsQuery.map((reward) => reward.data || '0')
  const scaledRewards = rewards.map((reward, i) =>
    parseUnits(reward, rewardTokenDecimals[i])
  )
  const rewardsInFiatValue = rewards.map((reward, i) =>
    toFiat(rewardTokensList[i], reward)
  )

  const fetchRewards = async () => {
    const requests = rewardsQuery.map((query) => query.refetch)
    return await Promise.all(requests)
  }

  return {
    rewards,
    rewardsInFiatValue,
    rewardTokensList,
    rewardTokenSymbols,
    scaledRewards,
    fetchRewards,
  }
}
