import { useCallback } from 'react'
import { constants } from 'ethers'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { networkChainId } from 'utils/network'
import { findAbiFromErc20 } from 'utils/wagmi'

const approveConfig = Object.freeze({
  abi: findAbiFromErc20('approve'),
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
    address: tokenAddress,
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
