import { useCallback } from 'react'

import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { networkChainId } from 'utils/network'
import { constants } from 'ethers'
import { Erc20Abi } from 'config/abi'

const approveConfig = Object.freeze({
  abi: Erc20Abi,
  chainId: networkChainId,
  functionName: 'approve',
})

export function useApprove(tokenAddress: Hash, spender: string) {
  const { config } = usePrepareContractWrite({
    ...approveConfig,
    address: tokenAddress as Hash,
    args: [spender, constants.MaxUint256],
    enabled: !!tokenAddress && !!spender,
  })

  const { writeAsync } = useContractWrite(config)

  const approve = useCallback(async () => {
    try {
      const response = await writeAsync?.()
      return response?.hash
    } catch (error: any) {
      throw error
    }
  }, [writeAsync])

  return approve
}
