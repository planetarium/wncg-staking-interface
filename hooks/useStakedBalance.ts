import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'

import { accountState } from 'app/states/connection'
import { legacyModeState } from 'app/states/settings'
import { getStakedTokenBalance } from 'contracts/staking'
import { REFETCH_INTERVAL } from 'constants/time'
import { bnum } from 'utils/num'
import { useStakingContract } from './useStakingContract'

export function useStakedBalance() {
  const { legacyContract, newContract } = useStakingContract(true)

  const account = useRecoilValue(accountState)
  const legacyMode = useRecoilValue(legacyModeState)

  const newStakedBalance = useQuery(
    ['newStakedBalance', account],
    () => getStakedTokenBalance(newContract!, account),
    {
      enabled: !!newContract,
      refetchInterval: REFETCH_INTERVAL,
      keepPreviousData: true,
      placeholderData: '0',
    }
  )

  const legacyStakedBalance = useQuery(
    ['legacyStakedBalance', account],
    () => getStakedTokenBalance(legacyContract!, account),
    {
      enabled: !!legacyContract,
      refetchInterval: REFETCH_INTERVAL,
      keepPreviousData: true,
      placeholderData: '0',
      staleTime: 60 * 1_000,
    }
  )

  const stakedBalance = useMemo(
    () => (legacyMode ? legacyStakedBalance : newStakedBalance),
    [legacyMode, legacyStakedBalance, newStakedBalance]
  )

  const hasBalanceInLegacyContract = useMemo(
    () => bnum(legacyStakedBalance?.data || '0').gt(0),
    [legacyStakedBalance.data]
  )

  return {
    hasBalanceInLegacyContract,
    stakedBalance: stakedBalance.data || '0',
    fetchStakedBalance: stakedBalance.refetch,
  }
}
