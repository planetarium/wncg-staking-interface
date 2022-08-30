import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { getAccount } from 'app/states/connection'
import { networkMismatchState } from 'app/states/network'
import { configService } from 'services/config'
import { getEarnedBal, getEarnedWncg } from 'contracts/staking'
import { StakingAbi } from 'lib/abi'
import { getTokenInfo } from 'utils/token'
import { useProvider } from './useProvider'

import { useAppSelector } from './useRedux'
import { useUsd } from './useUsd'

const queryFnList = [getEarnedWncg, getEarnedBal]

export function useRewardData() {
  const provider = useProvider()
  const { getFiatValue } = useUsd()

  const networkMismatch = useRecoilValue(networkMismatchState)
  const account = useAppSelector(getAccount)

  const { rewardTokensList } = configService
  const rewardTokenDecimals = rewardTokensList.map(
    (address) => getTokenInfo(address).decimals
  )

  const contract = useMemo(() => {
    if (!provider || networkMismatch || !account) return null
    return new Contract(
      configService.stakingAddress,
      StakingAbi,
      provider.getSigner(account)
    )
  }, [account, networkMismatch, provider])

  const rewardsQuery = useQueries({
    queries: rewardTokensList.map((address, i) => ({
      queryKey: ['claimableRewards', address],
      queryFn: () =>
        queryFnList[i]?.(contract!, account, rewardTokenDecimals[i]),
      enabled: !!contract,
      placeholderData: '0',
    })),
  })

  const rewards = rewardsQuery.map((reward) => reward.data || '0')
  const rewardsInFiatValue = rewards.map((reward, i) =>
    getFiatValue(rewardTokensList[i], reward)
  )
  const fetchRewards = async () => {
    const requests = rewardsQuery.map((query) => query.refetch)
    return await Promise.all(requests)
  }

  return {
    rewards,
    rewardsInFiatValue,
    rewardTokensList,
    fetchRewards,
  }
}
