import { useAtomValue } from 'jotai'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import {
  rewardTokenAddressAtom,
  rewardTokensListAtom,
  stakingContractAddressAtom,
} from 'states/staking'
import { configService } from 'services/config'
import { StakingAbi } from 'lib/abi'
import { assertUnreachable } from 'utils/assertion'
import { useRewards } from './useRewards'

export function useClaimRewards() {
  const { scaledRewards } = useRewards()

  const rewardTokenAddress = useAtomValue(rewardTokenAddressAtom)
  const rewardTokensList = useAtomValue(rewardTokensListAtom)
  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const { config: claimAllConfig } = usePrepareContractWrite({
    addressOrName: stakingAddress,
    contractInterface: StakingAbi,
    functionName: 'claimAllRewards',
  })
  const { writeAsync: claimAll } = useContractWrite(claimAllConfig)

  const { config: claimBalConfig } = usePrepareContractWrite({
    addressOrName: stakingAddress,
    contractInterface: StakingAbi,
    functionName: 'claimBALRewards',
  })
  const { writeAsync: claimBal } = useContractWrite(claimBalConfig)

  const { config: claimRewardTokenConfig } = usePrepareContractWrite({
    addressOrName: stakingAddress,
    contractInterface: StakingAbi,
    functionName: 'claimWNCGRewards',
    args: [scaledRewards[0]],
  })
  const { writeAsync: claimRewardToken } = useContractWrite(
    claimRewardTokenConfig
  )

  const claim = (tokensToImport: string[]) => {
    switch (true) {
      case tokensToImport.length === rewardTokensList.length:
        return claimAll
      case tokensToImport.includes(configService.bal):
        return claimBal
      case tokensToImport.includes(rewardTokenAddress):
        return claimRewardToken
      default:
        assertUnreachable(tokensToImport)
    }
  }

  return {
    claim,
  }
}
