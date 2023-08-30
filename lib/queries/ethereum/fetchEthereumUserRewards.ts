import { Contract, providers } from 'ethers'

import { StakingEthereumAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'

import { STAKING_ADDRESS } from 'config/constants/addresses'

export async function fetchEthereumUserRewards(
  chainId: ChainId,
  account?: Hash
) {
  const provider = new providers.Web3Provider(
    window?.ethereum as any as providers.ExternalProvider,
    'any'
  )

  const contract = new Contract(
    STAKING_ADDRESS[chainId],
    StakingEthereumAbi,
    provider.getSigner(account)
  )

  try {
    // NOTE: account is missing
    if (account == null) {
      return {
        earnedTokenRewards: [],
        hasRewards: false,
      }
    }

    let _earnedBAL = null
    let _earnedWNCG = null

    const currentNetwork = await provider.getNetwork()

    if (currentNetwork.chainId === chainId) {
      _earnedBAL = await contract?.earnedBAL(account)
      _earnedWNCG = await contract?.earnedWNCG(account)
    }

    const earnedTokenRewards = [
      formatUnits(_earnedWNCG),
      formatUnits(_earnedBAL),
    ]

    const hasRewards = earnedTokenRewards.some((r) => bnum(r).gt(0))

    // console.log('🖤 REWARDS')

    return {
      earnedTokenRewards,
      hasRewards,
    }
  } catch (error) {
    throw error
  }
}
