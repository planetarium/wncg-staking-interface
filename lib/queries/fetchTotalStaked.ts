import { StakingBscAbi, StakingEthereumAbi } from 'config/abi'
import { STAKING_ADDRESS } from 'config/constants/addresses'
import { createPublicClient } from 'lib/wagmi/publicClient'
import { formatUnits } from 'utils/formatUnits'
import { isEthereum } from 'utils/isEthereum'

export async function fetchTotalStaked(chainId: ChainId) {
  const publicClient = createPublicClient(chainId)

  try {
    const data = (await publicClient.readContract({
      address: STAKING_ADDRESS[chainId],
      abi: isEthereum(chainId) ? StakingEthereumAbi : StakingBscAbi,
      functionName: 'totalStaked',
    })) as BigInt

    return formatUnits(data.toString())
  } catch (error) {
    throw error
  }
}
