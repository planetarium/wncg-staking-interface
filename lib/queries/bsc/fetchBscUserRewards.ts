import { Contract, ContractInterface, providers } from 'ethers'

import { StakingBscAbi } from 'config/abi'
import { STAKING_ADDRESS } from 'config/constants/addresses'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'

export async function fetchBscUserRewards(chainId: ChainId, account?: Hash) {
  const provider = new providers.Web3Provider(
    window?.ethereum as any as providers.ExternalProvider,
    'any'
  )

  const contract = new Contract(
    STAKING_ADDRESS[chainId],
    StakingBscAbi as ContractInterface,
    provider.getSigner(account)
  )

  try {
    if (account == null) {
      return {
        earnedTokenRewards: [],
        hasRewards: false,
      }
    }

    let _earnedTokenRewards = null

    const currentNetwork = await provider.getNetwork()

    if (currentNetwork.chainId === chainId) {
      _earnedTokenRewards = await contract?.earnedTokenRewards(account)
    }

    const earnedTokenRewards = [formatUnits(_earnedTokenRewards)]

    const hasRewards = earnedTokenRewards.some((r) => bnum(r).gt(0))

    console.log('🖤 REWARDS')

    return {
      earnedTokenRewards,
      hasRewards,
    }
  } catch (error: any) {
    return
  }
}
