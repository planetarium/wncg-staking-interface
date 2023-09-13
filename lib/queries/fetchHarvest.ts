import { BalancerLiquidityGaugeAbi, BalancerRewardPoolAbi } from 'config/abi'
import { STAKING_ADDRESS } from 'config/constants/addresses'
import { readContractsPool } from 'lib/readContractsPool'
import { formatUnits } from 'utils/formatUnits'
import { resolveReadContractsResult } from 'utils/resolveReadContractsResult'

export async function fetchHarvest(
  chainId: ChainId,
  balRewardPoolAddress: Hash,
  balancerGaugeAddress: Hash
) {
  try {
    const contracts = [
      {
        address: balRewardPoolAddress,
        abi: BalancerRewardPoolAbi as Abi,
        chainId,
        functionName: 'periodFinish',
      },
      {
        address: balancerGaugeAddress,
        abi: BalancerLiquidityGaugeAbi as Abi,
        chainId,
        functionName: 'claimable_tokens',
        args: [STAKING_ADDRESS[chainId]],
      },
    ]

    const response = await readContractsPool.call({ contracts })
    const data = resolveReadContractsResult(response) as [BigInt, BigInt]
    const [_periodFinish, _claimableTokens] = data

    const periodFinish = _periodFinish.toString()
    const claimableTokens = formatUnits(_claimableTokens.toString(), 18)

    return {
      periodFinish,
      claimableTokens,
    }
  } catch (error) {
    throw error
  }
}
