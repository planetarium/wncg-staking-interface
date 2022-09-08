import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'

import { accountState } from 'app/states/connection'
import { getStakedTokenBalance } from 'contracts/staking'
import { REFETCH_INTERVAL } from 'constants/time'
import { useStakingContract } from './useStakingContract'

export function useStakedBalance() {
  const { contract, stakingAddress } = useStakingContract(true)
  const account = useRecoilValue(accountState)

  const stakedBalance = useQuery(
    ['stakedBalance', account, stakingAddress],
    () => getStakedTokenBalance(contract!, account),
    {
      enabled: !!contract,
      refetchInterval: REFETCH_INTERVAL,
      keepPreviousData: true,
      placeholderData: '0',
    }
  )

  return {
    stakedBalance: stakedBalance.data || '0',
    fetchStakedBalance: stakedBalance.refetch,
  }
}
