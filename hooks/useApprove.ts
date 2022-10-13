import { useCallback } from 'react'
import { constants } from 'ethers'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { Erc20Abi } from 'lib/abi'
import { networkChainId } from 'utils/network'

const approveConfig = Object.freeze({
  contractInterface: Erc20Abi,
  chainId: networkChainId,
  functionName: 'approve',
})

export function useApprove(
  tokenAddress: string,
  spender: string,
  { onConfirm, onError }: ContractWriteOption = {}
) {
  const { config } = usePrepareContractWrite({
    ...approveConfig,
    addressOrName: tokenAddress,
    args: [spender, constants.MaxUint256],
    enabled: !!tokenAddress && !!spender,
  })

  const { writeAsync } = useContractWrite(config)

  const approve = useCallback(async () => {
    try {
      const response = await writeAsync?.()
      onConfirm?.(response?.hash as Hash)
    } catch (error: any) {
      onError?.(error)
      throw error
    }
  }, [onConfirm, onError, writeAsync])

  return approve
}
