import { readContracts } from 'wagmi'

import { StakingBscAbi } from 'config/abi'
import { STAKING_ADDRESS } from 'config/constants/addresses'
import { formatUnits } from 'utils/formatUnits'

const FNS = [
  'REWARD_TOKEN',
  'getEmissionPerSec',
  'COOLDOWN_SECONDS',
  'UNSTAKE_WINDOW',
  'totalStaked',
]

export async function fetchBscStaking(chainId: ChainId) {
  const contracts = FNS.map((fn) => ({
    address: STAKING_ADDRESS[chainId],
    abi: StakingBscAbi,
    chainId,
    functionName: fn,
  }))

  try {
    const data = (await readContracts({
      contracts,
      allowFailure: true,
    })) as [Hash, BigNumber, BigNumber, BigNumber, BigNumber]

    const [
      _rewardToken,
      _emissionPerSec,
      _cooldownSeconds,
      _unstakeWindow,
      _totalStaked,
    ] = data

    const rewardTokenAddress = _rewardToken.toLowerCase() as Hash

    const emissionPerSec = formatUnits(_emissionPerSec)
    const cooldownSeconds = _cooldownSeconds?.toNumber() ?? 0
    const withdrawSeconds = _unstakeWindow?.toNumber() ?? 0
    const totalStaked = formatUnits(_totalStaked)

    return {
      cooldownSeconds,
      rewardEmissionsPerSec: [emissionPerSec],
      rewardTokenAddresses: [rewardTokenAddress],
      totalStaked,
      withdrawSeconds,
    }
  } catch (error) {
    throw error
  }
}
