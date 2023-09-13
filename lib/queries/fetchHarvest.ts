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
    })) as BigInt

    return data.toString()
  } catch (error) {
    throw error
  }
}
