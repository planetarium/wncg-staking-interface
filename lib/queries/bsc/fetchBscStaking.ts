import { readContracts } from 'wagmi'

import { StakingBscAbi } from 'config/abi'
import { STAKING_ADDRESS } from 'config/constants/addresses'
import { bnum } from 'utils/bnum'
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
    abi: StakingBscAbi as Abi,
    chainId,
    functionName: fn,
  }))

  try {
    const data = await readContracts({
      contracts,
      allowFailure: true,
    })

    const [
      _rewardToken,
      _emissionPerSec,
      _cooldownSeconds,
      _unstakeWindow,
      _totalStaked,
    ] = data.map((i) => (i.status === 'success' ? i.result : null)) as [
      Hash,
      BigInt,
      BigInt,
      BigInt,
      BigInt,
      BigInt
    ]

    const rewardTokenAddress = _rewardToken.toLowerCase() as Hash

    const emissionPerSec = formatUnits(_emissionPerSec?.toString())
    const cooldownSeconds = bnum(_cooldownSeconds?.toString() ?? '0').toNumber()
    const withdrawSeconds = bnum(_unstakeWindow?.toString() ?? '0').toNumber()
    const totalStaked = formatUnits(_totalStaked?.toString() ?? '0')

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
