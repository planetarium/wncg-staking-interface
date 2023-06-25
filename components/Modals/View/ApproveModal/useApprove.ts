import { useCallback } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { constants } from 'ethers'

import { Erc20Abi } from 'config/abi'
import { useChain, useSwitchNetwork } from 'hooks'

const approveConfig = Object.freeze({
  abi: Erc20Abi,
  functionName: 'approve',
})

export function useApprove(tokenAddress: Hash, spender: string) {
  const { switchBeforeSend } = useSwitchNetwork()
  const { chainId } = useChain()

  const { config } = usePrepareContractWrite({
    ...approveConfig,
    address: tokenAddress as Hash,
    chainId,
    args: [spender, constants.MaxUint256],
    enabled: !!tokenAddress && !!spender,
    onError: switchBeforeSend,
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
