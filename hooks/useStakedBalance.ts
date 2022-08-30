import { useQuery } from '@tanstack/react-query'

import { getAccount } from 'app/states/connection'
import { getStakedTokenBalance } from 'contracts/staking'
import { REFETCH_INTERVAL } from 'constants/time'
import { useAppSelector } from './useRedux'
import { useStakingContract } from './useStakingContract'

export function useStakedBalance() {
  const contract = useStakingContract(true)
  const account = useAppSelector(getAccount)

  const stakedBalance = useQuery(
    ['stakedBalance', account],
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
