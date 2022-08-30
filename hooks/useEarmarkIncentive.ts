import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'
import type BigNumber from 'bignumber.js'

import { networkMismatchState } from 'app/states/network'
import { getClaimableTokens } from 'contracts/liquidityGauge'
import { getEarmarkIncentiveFee, getFeeDenominator } from 'contracts/staking'
import { REFETCH_INTERVAL } from 'constants/time'
import { configService } from 'services/config'
import { LiquidityGaugeAbi, StakingAbi } from 'lib/abi'
import { bnum } from 'utils/num'
import { useFiatCurrency } from './useFiatCurrency'
import { useProvider } from './useProvider'
import { useStaking } from './useStaking'

const options = {
  staleTime: Infinity,
  keepPreviousData: true,
}

export function useEarmarkIncentive() {
  const provider = useProvider()
  const { liquidityGaugeAddress } = useStaking()
  const { toFiat } = useFiatCurrency()

  const networkMismatch = useRecoilValue(networkMismatchState)

  const stakingContract = useMemo(() => {
    if (!provider || networkMismatch) {
      return null
    }
    return new Contract(configService.stakingAddress, StakingAbi, provider)
  }, [networkMismatch, provider])

  const liquidityGaugeContract = useMemo(() => {
    if (!provider || networkMismatch || !liquidityGaugeAddress) {
      return null
    }
    return new Contract(liquidityGaugeAddress, LiquidityGaugeAbi, provider)
  }, [liquidityGaugeAddress, networkMismatch, provider])

  const earmarkIncentiveFee = useQuery(
    ['earmarkIncentiveFee'],
    () => getEarmarkIncentiveFee(stakingContract!),
    {
      ...options,
      enabled: !!stakingContract,
      placeholderData: 0,
    }
  )

  const feeDenominator = useQuery(
    ['feeDenominator'],
    () => getFeeDenominator(stakingContract!),
    {
      ...options,
      enabled: !!stakingContract,
      placeholderData: 0,
    }
  )

  const claimableTokens = useQuery(
    ['claimableTokens'],
    () => getClaimableTokens(liquidityGaugeContract),
    {
      refetchInterval: REFETCH_INTERVAL,
      placeholderData: '0',
    }
  )

  const earmarkIncentive = useMemo(() => {
    let amount: BigNumber
    const netAmount = claimableTokens.data || 0
    const pcnt = bnum(earmarkIncentiveFee.data || 0).div(
      feeDenominator.data || 0
    )
    amount = pcnt.times(netAmount)

    const isValid = amount.isFinite() && !amount.isNaN()
    return isValid ? amount.toNumber() : 0
  }, [claimableTokens.data, earmarkIncentiveFee.data, feeDenominator.data])

  const earmarkIncentiveInFiatValue = toFiat('bal', earmarkIncentive)

  return {
    earmarkIncentive,
    earmarkIncentiveInFiatValue,
    fetchEarmarkIncentive: claimableTokens.refetch,
  }
}
