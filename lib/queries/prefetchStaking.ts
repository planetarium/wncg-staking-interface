import { readContracts } from 'wagmi'

import config from 'config'
import { StakingAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'

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

export async function prefetchStaking() {
  const contracts = FNS.map((fn) => ({
    address: config.stakingAddress,
    abi: StakingAbi,
    chainId: config.chainId,
    functionName: fn,
  }))

  try {
    const data = (await readContracts({
      allowFailure: true,
      contracts,
    })) as UnserializedStakingResponse

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

    const liquidityGaugeAddress = _balancerGauge.toLowerCase() as Hash
    const balRewardPoolAddress = _balRewardPool.toLowerCase() as Hash
    const rewardTokenAddress = _rewardToken.toLowerCase() as Hash
    const stakedTokenAddress = _stakedToken.toLowerCase() as Hash

    const rewardTokenAddresses = [_rewardToken, config.bal].map(
      (a) => a.toLowerCase() as Hash
    )
    const rewardEmissions = [_wncgEmissionPerSec, _balRewardRate].map((e) =>
      formatUnits(e)
    )

    const cooldownPeriod = _cooldownSeconds?.toNumber() ?? 0
    const unstakePeriod = _unstakeWindow?.toNumber() ?? 0
    const totalStaked = formatUnits(_totalStaked)

    return {
      cooldownPeriod,
      earmarkIncentivePcnt,
      balRewardPoolAddress,
      liquidityGaugeAddress,
      rewardEmissions,
      rewardTokenAddress,
      rewardTokenAddresses,
      stakedTokenAddress,
      unstakePeriod,
      totalStaked,
    }
  } catch (error) {
    throw error
  }
}
