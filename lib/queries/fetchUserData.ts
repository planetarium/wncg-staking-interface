import { Contract, providers } from 'ethers'
import { readContracts } from 'wagmi'

import config from 'config'
import { StakingAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { now } from 'utils/now'

const FNS = [
  'stakedTokenBalance',
  'getCooldownEndTimestamp',
  'getWithdrawEndTimestamp',
  'cooldowns',
]

export async function fetchUserData(account: Hash): Promise<UserDataResponse> {
  const contracts = FNS.map((fn) => ({
    address: config.stakingAddress,
    abi: StakingAbi as Abi,
    chainId: config.chainId,
    functionName: fn,
    args: [account],
  }))

  let provider = new providers.Web3Provider(
    window?.ethereum as any as providers.ExternalProvider,
    'any'
  )

  const contract = new Contract(
    config.stakingAddress,
    StakingAbi,
    provider.getSigner(account)
  )

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

    let _earnedBAL = null
    let _earnedWNCG = null

    const currentNetwork = await provider.getNetwork()
    if (currentNetwork.chainId === config.chainId) {
      _earnedBAL = await contract?.earnedBAL(account)
      _earnedWNCG = await contract?.earnedWNCG(account)
    }

    const stakedTokenBalance = formatUnits(_stakedTokenBalance)
    const earnedRewards = [formatUnits(_earnedWNCG), formatUnits(_earnedBAL)]

    const _cooldownEndsAt = _getCooldownEndTimestamp?.toNumber() ?? 0
    const _withdrawEndsAt = _getWithdrawEndTimestamp?.toNumber() ?? 0
    const cooldowns = _cooldowns?.toNumber() ?? 0

    const currentTimestamp = now()

    const cooldownEndsAt =
      currentTimestamp > _withdrawEndsAt ? 0 : _cooldownEndsAt
    const withdrawEndsAt =
      currentTimestamp > _withdrawEndsAt ? 0 : _withdrawEndsAt

    const hasRewards = earnedRewards.some((r) => bnum(r).gt(0))

    return {
      cooldownEndsAt,
      cooldowns,
      earnedRewards,
      stakedTokenBalance,
      withdrawEndsAt,
      hasRewards,
    }
  } catch (error) {
    throw error
  }
}
