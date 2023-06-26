import { readContract } from '@wagmi/core'

import { BalancerRewardPoolAbi } from 'config/abi'

export async function fetchHarvest(
  chainId: ChainId,
  balRewardPoolAddress: Hash
) {
  try {
    const data = (await readContract({
      address: balRewardPoolAddress,
      abi: BalancerRewardPoolAbi,
      chainId,
      functionName: 'periodFinish',
    })) as BigNumber

    return data.toNumber()
  } catch (error) {
    throw error
  }
}
