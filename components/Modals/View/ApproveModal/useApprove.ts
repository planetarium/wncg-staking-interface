import { useCallback } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { MaxUint256 } from '@ethersproject/constants'

import { Erc20Abi } from 'config/abi'
import { useAuth, useChain, useSwitchNetwork } from 'hooks'

const approveConfig = Object.freeze({
  abi: Erc20Abi,
  functionName: 'approve',
})

export function useApprove(tokenAddress: Hash, spender: string) {
  const { isConnected } = useAuth()
  const { switchBeforeSend } = useSwitchNetwork()
  const { chainId, networkMismatch } = useChain()

  const { config } = usePrepareContractWrite({
    ...approveConfig,
    address: tokenAddress as Hash,
    chainId,
    enabled: !!isConnected && !!tokenAddress && !!spender && !networkMismatch,
    args: [spender, MaxUint256.toBigInt()],
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
