import { useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useContractReads } from 'wagmi'

import {
  earmarkIncentivePcntAtom,
  emissionListAtom,
  liquidityGaugeAddressAtom,
  rewardTokenAddressAtom,
  stakedTokenAddressAtom,
  stakingContractAddressAtom,
  unstakeWindowAtom,
} from 'states/staking'
import { networkChainId } from 'utils/network'
import { bnum } from 'utils/num'
import { findAbiFromStaking } from 'utils/wagmi'

const FNS = [
  'earmarkIncentive',
  'FEE_DENOMINATOR',
  'balancerGauge',
  'REWARD_TOKEN',
  'STAKED_TOKEN',
  'getBALRewardRate',
  'getWNCGEmissionPerSec',
  'UNSTAKE_WINDOW',
]
const ABIS = findAbiFromStaking(...FNS)

export function useStaking() {
  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const setEarmarkIncentivePcnt = useSetAtom(earmarkIncentivePcntAtom)
  const setEmissionList = useSetAtom(emissionListAtom)
  const setLiquidityGaugeAddress = useSetAtom(liquidityGaugeAddressAtom)
  const setRewardTokenAddress = useSetAtom(rewardTokenAddressAtom)
  const setStakedTokenAddress = useSetAtom(stakedTokenAddressAtom)
  const setUnstakeWindow = useSetAtom(unstakeWindowAtom)

  const contracts = useMemo(
    () =>
      FNS.map((fn) => ({
        addressOrName: stakingAddress,
        contractInterface: ABIS,
        functionName: fn,
        chainId: networkChainId,
      })),
    [stakingAddress]
  )

  useContractReads({
    contracts,
    cacheTime: Infinity,
    onSuccess(data) {
      const [
        earmarkIncentiveFee,
        feeDenominator,
        balancerGauge,
        rewardToken,
        stakedToken,
        balEmissionPerSec,
        wncgEmissionPerSec,
        unstakeWindow,
      ] = (data || []) as unknown as [
        BigNumber,
        BigNumber,
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber
      ]

      const earmarkIncentivePcnt = Math.min(
        bnum(earmarkIncentiveFee?.toNumber() || 0)
          .div(feeDenominator?.toNumber() || 0)
          .toNumber() || 0.01,
        1
      )
      setEarmarkIncentivePcnt(earmarkIncentivePcnt)

      const emissions = [wncgEmissionPerSec, balEmissionPerSec]
      setEmissionList(
        emissions.map((emission) => formatUnits(emission?.toString() || 0))
      )

      setLiquidityGaugeAddress(balancerGauge || '')
      setRewardTokenAddress(rewardToken || '')
      setStakedTokenAddress(stakedToken || '')
      setUnstakeWindow(unstakeWindow?.toNumber() || 0)
    },
  })
}
