import { readContracts } from 'wagmi'

import { StakingEthereumAbi } from 'config/abi'
import { STAKING_ADDRESS } from 'config/constants/addresses'
// import { readContractsPool } from 'lib/readContractsPool'
import { formatUnits } from 'utils/formatUnits'
import { now } from 'utils/now'

const FNS = [
  'stakedTokenBalance',
  'getCooldownEndTimestamp',
  'getWithdrawEndTimestamp',
  'cooldowns',
]

export async function fetchUserData(chainId: ChainId, account: Hash) {
  const contracts = FNS.map((fn) => ({
    address: STAKING_ADDRESS[chainId],
    abi: StakingEthereumAbi,
    chainId,
    functionName: fn,
    args: [account],
  }))

  try {
    const data =
      (await readContracts({
        contracts,
        allowFailure: true,
      })) ?? []

    const [
      _stakedTokenBalance,
      _getCooldownEndTimestamp,
      _getWithdrawEndTimestamp,
      _cooldowns,
    ] = data as unknown as BigNumber[]

    const stakedTokenBalance = formatUnits(_stakedTokenBalance)

    const _cooldownEndsAt = _getCooldownEndTimestamp?.toNumber() ?? 0
    const _withdrawEndsAt = _getWithdrawEndTimestamp?.toNumber() ?? 0
    const cooldowns = _cooldowns?.toNumber() ?? 0

    const currentTimestamp = now()

    const cooldownEndsAt =
      currentTimestamp > _withdrawEndsAt ? 0 : _cooldownEndsAt
    const withdrawEndsAt =
      currentTimestamp > _withdrawEndsAt ? 0 : _withdrawEndsAt

    return {
      cooldownEndsAt,
      cooldowns,
      stakedTokenBalance,
      withdrawEndsAt,
    }
  } catch (error) {
    throw error
  }
}
