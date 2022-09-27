import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'

import { legacyModeState } from 'app/states/settings'
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
  const legacyMode = useRecoilValue(legacyModeState)

  const balancerGaugeAddress = useQuery(
    ['balancerGaugeAddress', stakingAddress],
    () => getBalancerGaugeAddress(contract!),
    {
      ...options,
      enabled: !!contract,
      placeholderData: '',
    }
  )

  const _balEmissionPerSec = useQuery(
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

  const fetchStaking = useCallback(() => {
    _balEmissionPerSec.refetch()
    wncgEmissionPerSec.refetch()
    totalStaked.refetch()
    unstakeWindow.refetch()
  }, [_balEmissionPerSec, totalStaked, unstakeWindow, wncgEmissionPerSec])

  const balEmissionPerSec = useMemo(
    () => (legacyMode ? '0' : _balEmissionPerSec.data),
    [_balEmissionPerSec.data, legacyMode]
  )

  return {
    liquidityGaugeAddress: balancerGaugeAddress.data || '',
    balEmissionPerSec: balEmissionPerSec || '0',
    wncgEmissionPerSec: wncgEmissionPerSec.data || '0',
    totalStaked: totalStaked.data || '0',
    unstakeWindow: unstakeWindow.data || 0,
    fetchStaking,
  }
}
