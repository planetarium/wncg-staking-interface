import { useAtomValue } from 'jotai'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { stakingContractAddressAtom } from 'states/staking'
import { configService } from 'services/config'
import { StakingAbi } from 'lib/abi'
import { assertUnreachable } from 'utils/assertion'
import { useRewards } from './useRewards'
import { useStaking } from './useStaking'

export function useClaimRewards() {
  const { scaledRewards } = useRewards()
  const { rewardTokenAddress, rewardTokensList } = useStaking()

  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const { config: claimAllConfig } = usePrepareContractWrite({
    address: stakingAddress,
    abi: StakingAbi,
    functionName: 'claimAllRewards',
  })
  const { writeAsync: claimAll } = useContractWrite(claimAllConfig)

  const { config: claimBalConfig } = usePrepareContractWrite({
    address: stakingAddress,
    abi: StakingAbi,
    functionName: 'claimBALRewards',
  })
  const { writeAsync: claimBal } = useContractWrite(claimBalConfig)

  const { config: claimRewardTokenConfig } = usePrepareContractWrite({
    address: stakingAddress,
    abi: StakingAbi,
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
