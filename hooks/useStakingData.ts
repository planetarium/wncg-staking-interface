import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { networkMismatchState } from 'app/states/network'
import { configService } from 'services/config'
import {
  getBalancerGaugeAddress,
  getBalEmissionPerSec,
  getTotalStaked,
  getUnstakeWindow,
  getWncgEmissionPerSec,
} from 'contracts/staking'
import { StakingAbi } from 'lib/abi'
import { useProvider } from './useProvider'

const options = {
  staleTime: Infinity,
  keepPreviousData: true,
}

// NOTE: Show data without connecting to Metamask
export function useStakingData() {
  const provider = useProvider()
  const networkMismatch = useRecoilValue(networkMismatchState)

  const contract = useMemo(() => {
    if (!provider || networkMismatch) return null
    return new Contract(configService.stakingAddress, StakingAbi, provider)
  }, [networkMismatch, provider])

  const balancerGaugeAddress = useQuery(
    ['balancerGaugeAddress'],
    () => getBalancerGaugeAddress(contract!),
    {
      ...options,
      enabled: !!contract,
      placeholderData: '',
    }
  )

  const balEmissionPerSec = useQuery(
    ['balEmissionPerSec'],
    () => getBalEmissionPerSec(contract!),
    {
      ...options,
      enabled: !!contract,
      placeholderData: '0',
    }
  )

  const wncgEmissionPerSec = useQuery(
    ['wncgEmissionPerSec'],
    () => getWncgEmissionPerSec(contract!),
    {
      ...options,
      enabled: !!contract,
      placeholderData: '0',
    }
  )

  const totalStaked = useQuery(
    ['totalStaked'],
    () => getTotalStaked(contract!),
    {
      ...options,
      enabled: !!contract,
      placeholderData: '0',
    }
  )

  const unstakeWindow = useQuery(
    ['unstakeWindow'],
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
