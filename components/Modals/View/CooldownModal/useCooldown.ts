import { useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { stakingContractAddressAtom } from 'states/staking'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'
import { useStakedBalance } from 'hooks'

const writeConfig = Object.freeze({
  abi: findAbiFromStaking('cooldown'),
  chainId: networkChainId,
  functionName: 'cooldown',
})

export function useCooldown({ onConfirm, onError }: ContractWriteOption = {}) {
  const { hasStakedBalance } = useStakedBalance()
  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const { config } = usePrepareContractWrite({
    ...writeConfig,
    address: stakingAddress,
    enabled: !!hasStakedBalance,
  })

  const { writeAsync } = useContractWrite(config)

  const cooldown = useCallback(async () => {
    try {
      const response = await writeAsync?.()
      onConfirm?.(response?.hash)
    } catch (error) {
      onError?.(error)
      throw error
    }
  }, [onConfirm, onError, writeAsync])

  return cooldown
}
