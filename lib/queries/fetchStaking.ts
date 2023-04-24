import config from 'config'
import { LiquidityGaugeAbi, StakingAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { readContractsPool } from 'lib/readContractsPool'

const FNS = [
  'earmarkIncentive',
  'FEE_DENOMINATOR',
  'getBALRewardRate',
  'getWNCGEmissionPerSec',
  'COOLDOWN_SECONDS',
  'UNSTAKE_WINDOW',
  'totalStaked',
]

const CONTRACTS = FNS.map((fn) => ({
  address: config.stakingAddress,
  abi: StakingAbi as Abi,
  chainId: config.chainId,
  functionName: fn,
}))

export async function fetchStaking(liquidityGaugeAddress: Hash) {
  const contracts = [
    ...CONTRACTS,
    {
      address: liquidityGaugeAddress,
      abi: LiquidityGaugeAbi as Abi,
      chainId: config.chainId,
      functionName: 'claimable_tokens',
      args: [config.stakingAddress],
    },
  ]

  try {
    const data = (await readContractsPool.call({
      contracts,
      allowFailure: true,
    })) as BigNumber[]

    const [
      _earmarkIncentiveFee,
      _feeDenominator,
      _balRewardRate,
      _wncgEmissionPerSec,
      _cooldownSeconds,
      _unstakeWindow,
      _totalStaked,
      _claimableTokens,
    ] = data

    const earmarkIncentivePcnt = Math.min(
      bnum(_earmarkIncentiveFee?.toNumber() ?? 0)
        .div(_feeDenominator?.toNumber() ?? 0)
        .toNumber() ?? 0.01,
      1
    )

    const rewardEmissions = [_wncgEmissionPerSec, _balRewardRate].map((e) =>
      formatUnits(e)
    )

    const cooldownPeriod = _cooldownSeconds?.toNumber() ?? 0
    const unstakePeriod = _unstakeWindow?.toNumber() ?? 0
    const totalStaked = formatUnits(_totalStaked)
    const claimableTokens = formatUnits(_claimableTokens)
    const accumulatedEarmarkIncentive = bnum(claimableTokens)
      .times(earmarkIncentivePcnt)
      .toString()

    return {
      accumulatedEarmarkIncentive,
      claimableTokens,
      cooldownPeriod,
      earmarkIncentivePcnt,
      liquidityGaugeAddress,
      rewardEmissions,
      totalStaked,
      unstakePeriod,
    }
  } catch (error) {
    throw error
  }
}
