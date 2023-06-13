import { readContracts } from 'wagmi'

import { StakingEthereumAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { BAL_ADDRESS, STAKING_ADDRESS } from 'config/constants/addresses'

const FNS = [
  'earmarkIncentive',
  'FEE_DENOMINATOR',
  'balancerGauge',
  'BAL_REWARD_POOL',
  'REWARD_TOKEN',
  'STAKED_TOKEN',
  'getBALRewardRate',
  'getWNCGEmissionPerSec',
  'COOLDOWN_SECONDS',
  'UNSTAKE_WINDOW',
  'totalStaked',
]

export async function prefetchStaking(chainId: ChainId) {
  const stakingAddress = STAKING_ADDRESS[chainId]

  const contracts = FNS.map((fn) => ({
    address: stakingAddress,
    abi: StakingEthereumAbi,
    chainId,
    functionName: fn,
  }))

  try {
    const data = (await readContracts({
      allowFailure: true,
      contracts,
    })) as any

    const [
      _earmarkIncentiveFee,
      _feeDenominator,
      _balancerGauge,
      _balRewardPool,
      _rewardToken,
      _stakedToken,
      _balRewardRate,
      _wncgEmissionPerSec,
      _cooldownSeconds,
      _unstakeWindow,
      _totalStaked,
    ] = data

    const earmarkIncentivePcnt = Math.min(
      bnum(_earmarkIncentiveFee?.toNumber() ?? 0)
        .div(_feeDenominator?.toNumber() ?? 0)
        .toNumber() ?? 0.01,
      1
    )

    const liquidityGaugeAddress = _balancerGauge?.toLowerCase() as Hash
    const balRewardPoolAddress = _balRewardPool?.toLowerCase() as Hash
    const rewardTokenAddress = (_rewardToken?.toLowerCase() ?? '') as Hash
    const stakedTokenAddress = (_stakedToken?.toLowerCase() ?? '') as Hash

    const rewardTokenAddresses = [
      _rewardToken,
      (BAL_ADDRESS[chainId] ?? '') as Hash,
    ].map((a) => a?.toLowerCase() as Hash)

    const rewardEmissions = [_wncgEmissionPerSec, _balRewardRate].map((e) =>
      formatUnits(e)
    )

    const cooldownSeconds = _cooldownSeconds?.toNumber() ?? 0
    const withdrawSeconds = _unstakeWindow?.toNumber() ?? 0
    const totalStaked = formatUnits(_totalStaked)

    return {
      cooldownSeconds,
      earmarkIncentivePcnt,
      balRewardPoolAddress,
      liquidityGaugeAddress,
      rewardEmissions,
      rewardTokenAddress,
      rewardTokenAddresses,
      stakedTokenAddress,
      withdrawSeconds,
      totalStaked,
    }
  } catch (error) {
    throw error
  }
}
