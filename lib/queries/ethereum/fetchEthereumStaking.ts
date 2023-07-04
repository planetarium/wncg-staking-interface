import { readContracts } from 'wagmi'

import { StakingEthereumAbi } from 'config/abi'
import { BAL_ADDRESS, STAKING_ADDRESS } from 'config/constants/addresses'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { resolveReadContractsResult } from 'utils/resolveReadContractsResult'

const FNS = [
  'earmarkIncentive',
  'FEE_DENOMINATOR',
  'balancerGauge',
  'BAL_REWARD_POOL',
  'REWARD_TOKEN',
  'getBALRewardRate',
  'getWNCGEmissionPerSec',
  'COOLDOWN_SECONDS',
  'UNSTAKE_WINDOW',
  'totalStaked',
]

export async function fetchEthereumStaking(chainId: ChainId) {
  const contracts = FNS.map((fn) => ({
    address: STAKING_ADDRESS[chainId],
    abi: StakingEthereumAbi as Abi,
    chainId,
    functionName: fn,
  }))

  try {
    const data = await readContracts({
      allowFailure: true,
      contracts,
    })

    const [
      _earmarkIncentiveFee,
      _feeDenominator,
      _balancerGauge,
      _balRewardPool,
      _rewardToken,
      _balRewardRate,
      _wncgEmissionPerSec,
      _cooldownSeconds,
      _unstakeWindow,
      _totalStaked,
    ] = resolveReadContractsResult(data) as [
      BigInt,
      BigInt,
      Hash,
      Hash,
      Hash,
      BigInt,
      BigInt,
      BigInt,
      BigInt,
      BigInt
    ]

    const earmarkIncentivePcnt = Math.min(
      bnum(_earmarkIncentiveFee?.toString() ?? 0)
        .div(_feeDenominator?.toString() ?? 0)
        .toNumber() ?? 0.01,
      1
    )

    const balancerGaugeAddress = (_balancerGauge?.toLowerCase() ?? '') as Hash
    const balRewardPoolAddress = (_balRewardPool?.toLowerCase() ?? '') as Hash
    const rewardTokenAddress = (_rewardToken?.toLowerCase() ?? '') as Hash

    const rewardTokenAddresses = [rewardTokenAddress, BAL_ADDRESS[chainId]].map(
      (a) => a?.toLowerCase() as Hash
    )

    const rewardEmissionsPerSec = [_wncgEmissionPerSec, _balRewardRate].map(
      (e) => formatUnits(e.toString())
    )

    const cooldownSeconds = bnum(_cooldownSeconds?.toString() ?? 0).toNumber()
    const withdrawSeconds = bnum(_unstakeWindow?.toString() ?? 0).toNumber()
    const totalStaked = formatUnits(_totalStaked.toString())

    return {
      cooldownSeconds,
      rewardEmissionsPerSec,
      rewardTokenAddresses,
      totalStaked,
      withdrawSeconds,
      balancerGaugeAddress,
      balRewardPoolAddress,
      earmarkIncentivePcnt,
    }
  } catch (error) {
    throw error
  }
}
