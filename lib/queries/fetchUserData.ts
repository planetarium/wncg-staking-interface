import { StakingEthereumAbi } from 'config/abi'
import { STAKING_ADDRESS } from 'config/constants/addresses'
import { readContractsPool } from 'lib/readContractsPool'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { now } from 'utils/now'
import { resolveReadContractsResult } from 'utils/resolveReadContractsResult'

const FNS = [
  'stakedTokenBalance',
  'getCooldownEndTimestamp',
  'getWithdrawEndTimestamp',
  'cooldowns',
]

export async function fetchUserData(chainId: ChainId, account: Hash | null) {
  if (account == null) return {}

  const contracts = FNS.map((fn) => ({
    address: STAKING_ADDRESS[chainId],
    abi: StakingEthereumAbi as Abi,
    chainId,
    functionName: fn,
    args: [account],
  }))

  try {
    const data =
      (await readContractsPool.call({
        contracts,
        allowFailure: true,
      })) ?? []

    const [
      _stakedTokenBalance,
      _getCooldownEndTimestamp,
      _getWithdrawEndTimestamp,
      _cooldowns,
    ] = resolveReadContractsResult(data) as BigInt[]

    const stakedTokenBalance = formatUnits(_stakedTokenBalance.toString())

    const _cooldownEndsAt = bnum(
      _getCooldownEndTimestamp?.toString() ?? '0'
    ).toNumber()
    const _withdrawEndsAt = bnum(
      _getWithdrawEndTimestamp?.toString() ?? '0'
    ).toNumber()
    const cooldowns = bnum(_cooldowns?.toString() ?? '0').toNumber()

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
