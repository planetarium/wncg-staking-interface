import { useQuery } from '@tanstack/react-query'

import {
  getBalancerGaugeAddress,
  getBalEmissionPerSec,
  getTotalStaked,
  getUnstakeWindow,
  getWncgEmissionPerSec,
} from 'contracts/staking'
import { REFETCH_INTERVAL } from 'constants/time'
import { useStakingContract } from './useStakingContract'

const options = {
  staleTime: Infinity,
  keepPreviousData: true,
}

// NOTE: Fetch data from downgraded staking contract
export function useStaking() {
  const { contract, stakingAddress } = useStakingContract()

  console.log('stakingAddress: ', stakingAddress)

  const balancerGaugeAddress = useQuery(
    ['balancerGaugeAddress', stakingAddress],
    () => getBalancerGaugeAddress(contract!),
    {
      ...options,
      enabled: !!contract,
      placeholderData: '',
    }
  )

  const balEmissionPerSec = useQuery(
    ['balEmissionPerSec', stakingAddress],
    () => getBalEmissionPerSec(contract!),
    {
      ...options,
      enabled: !!contract,
      placeholderData: '0',
    }
  )

  const wncgEmissionPerSec = useQuery(
    ['wncgEmissionPerSec', stakingAddress],
    () => getWncgEmissionPerSec(contract!),
    {
      ...options,
      enabled: !!contract,
      placeholderData: '0',
    }
  )

  const totalStaked = useQuery(
    ['totalStaked', stakingAddress],
    () => getTotalStaked(contract!),
    {
      enabled: !!contract,
      refetchInterval: REFETCH_INTERVAL,
      placeholderData: '0',
      keepPreviousData: true,
    }
  )

  const unstakeWindow = useQuery(
    ['unstakeWindow', stakingAddress],
    () => getUnstakeWindow(contract!),
    {
      ...options,
      enabled: !!contract,
      placeholderData: 0,
    }
  )

  return {
    liquidityGaugeAddress: balancerGaugeAddress.data || '',
    balEmissionPerSec: balEmissionPerSec.data || '0',
    wncgEmissionPerSec: wncgEmissionPerSec.data || '0',
    totalStaked: totalStaked.data || '0',
    unstakeWindow: unstakeWindow.data || 0,
    fetchTotalStaked: totalStaked.refetch,
  }
}
