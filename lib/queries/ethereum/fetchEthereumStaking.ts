import { StakingEthereumAbi } from 'config/abi'
import { BAL_ADDRESS, STAKING_ADDRESS } from 'config/constants/addresses'
import { readContractsPool } from 'lib/readContractsPool'
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

export async function fetchEthereumStaking(chainId: ChainId) {
  const contracts = FNS.map((fn) => ({
    address: STAKING_ADDRESS[chainId],
    abi: StakingEthereumAbi as Abi,
    chainId,
    functionName: fn,
  }))

  try {
    const data = (await readContractsPool.call({
      allowFailure: true,
      contracts,
    })) as [
      BigNumber,
      BigNumber,
      Hash,
      Hash,
      Hash,
      Hash,
      Hash,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber
    ]

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

    const balancerGaugeAddress = (_balancerGauge?.toLowerCase() ?? '') as Hash
    const balRewardPoolAddress = (_balRewardPool?.toLowerCase() ?? '') as Hash
    const rewardTokenAddress = (_rewardToken?.toLowerCase() ?? '') as Hash
    const stakedTokenAddress = (_stakedToken?.toLowerCase() ?? '') as Hash

    const rewardTokenAddresses = [rewardTokenAddress, BAL_ADDRESS[chainId]].map(
      (a) => a?.toLowerCase() as Hash
    )

    const rewardEmissionsPerSec = [_wncgEmissionPerSec, _balRewardRate].map(
      (e) => formatUnits(e)
    )

    const cooldownSeconds = _cooldownSeconds?.toNumber() ?? 0
    const withdrawSeconds = _unstakeWindow?.toNumber() ?? 0
    const totalStaked = formatUnits(_totalStaked)

    return {
      cooldownSeconds,
      rewardEmissionsPerSec,
      rewardTokenAddresses,
      stakedTokenAddress,
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
