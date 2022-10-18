import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useContractReads } from 'wagmi'

import { stakingContractAddressAtom } from 'states/staking'
import { configService } from 'services/config'
import { uniqAddress } from 'utils/address'
import { networkChainId } from 'utils/network'
import { bnum } from 'utils/num'
import { getTokenInfo } from 'utils/token'
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

  const contracts = useMemo(
    () =>
      FNS.map((fn) => ({
        address: stakingAddress,
        abi: ABIS,
        functionName: fn,
        chainId: networkChainId,
      })),
    [stakingAddress]
  )

  const { data } = useContractReads({
    contracts,
    cacheTime: Infinity,
    enabled: !!stakingAddress,
    suspense: true,
  })

  const [
    earmarkIncentiveFee,
    feeDenominator,
    balancerGauge,
    rewardToken,
    stakedToken,
    balEmissionPerSec,
    wncgEmissionPerSec,
    _unstakeWindow,
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

  const earmarkIncentivePcnt = useMemo(
    () =>
      Math.min(
        bnum(earmarkIncentiveFee?.toNumber() || 0)
          .div(feeDenominator?.toNumber() || 0)
          .toNumber() || 0.01,
        1
      ),
    [earmarkIncentiveFee, feeDenominator]
  )

  const emissions = useMemo(
    () =>
      [wncgEmissionPerSec, balEmissionPerSec].map((emission) =>
        formatUnits(emission?.toString() || 0)
      ),
    [balEmissionPerSec, wncgEmissionPerSec]
  )

  const liquidityGaugeAddress = useMemo(
    () => balancerGauge || '',
    [balancerGauge]
  )

  const rewardTokenAddress = useMemo(() => rewardToken || '', [rewardToken])

  const rewardTokensList = useMemo(
    () => uniqAddress([rewardTokenAddress, configService.bal]),
    [rewardTokenAddress]
  )

  const rewardTokenDecimals = useMemo(
    () => rewardTokensList.map((address) => getTokenInfo(address).decimals),
    [rewardTokensList]
  )

  const rewardTokenSymbols = useMemo(
    () => rewardTokensList.map((address) => getTokenInfo(address).symbol),
    [rewardTokensList]
  )

  const stakedTokenAddress = useMemo(() => stakedToken || '', [stakedToken])

  const unstakeWindow = useMemo(
    () => _unstakeWindow?.toNumber() || 0,
    [_unstakeWindow]
  )

  return {
    earmarkIncentivePcnt,
    emissions,
    liquidityGaugeAddress,
    rewardTokenAddress,
    rewardTokensList,
    rewardTokenDecimals,
    rewardTokenSymbols,
    stakedTokenAddress,
    unstakeWindow,
  }
}
