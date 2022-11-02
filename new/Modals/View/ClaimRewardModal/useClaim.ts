import { useCallback, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { stakingContractAddressAtom } from 'states/staking'
import { configService } from 'services/config'
import { assertUnreachable } from 'utils/assertion'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'
import { useRewards } from 'hooks'

const claimAllWriteConfig = Object.freeze({
  abi: findAbiFromStaking('claimAllRewards'),
  chainId: networkChainId,
  functionName: 'claimAllRewards',
})

const claimBalWriteConfig = Object.freeze({
  abi: findAbiFromStaking('claimBALRewards'),
  chainId: networkChainId,
  functionName: 'claimBALRewards',
})

const claimRewardTokenWriteConfig = Object.freeze({
  abi: findAbiFromStaking('claimWNCGRewards'),
  chainId: networkChainId,
  functionName: 'claimWNCGRewards',
})

export function useClaim(
  tokensToClaim: string[],
  { onConfirm, onError }: ContractWriteOption = {}
) {
  const { rewardTokenAddress, rewardTokenIndex, scaledRewards } = useRewards()

  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const { config: claimAllConfig } = usePrepareContractWrite({
    ...claimAllWriteConfig,
    address: stakingAddress,
  })

  const { config: claimBalConfig } = usePrepareContractWrite({
    ...claimBalWriteConfig,
    address: stakingAddress,
  })

  const { config: claimRewardTokenConfig } = usePrepareContractWrite({
    ...claimRewardTokenWriteConfig,
    address: stakingAddress,
    args: [scaledRewards[rewardTokenIndex]?.toString() ?? '0'],
  })

  const { writeAsync: _claimAll } = useContractWrite(claimAllConfig)
  const { writeAsync: _claimBal } = useContractWrite(claimBalConfig)
  const { writeAsync: _claimRewardToken } = useContractWrite(
    claimRewardTokenConfig
  )

  const writeAsync = useMemo(() => {
    if (tokensToClaim.length > 1) return _claimAll
    if (tokensToClaim.includes(configService.bal)) return _claimBal
    if (tokensToClaim.includes(rewardTokenAddress)) return _claimRewardToken
  }, [
    _claimAll,
    _claimBal,
    _claimRewardToken,
    rewardTokenAddress,
    tokensToClaim,
  ])

  const claim = useCallback(async () => {
    try {
      const response = await writeAsync?.()
      onConfirm?.(response?.hash as Hash)
    } catch (error) {
      onError?.(error)
      throw error
    }
  }, [onConfirm, onError, writeAsync])

  return claim
}
