import { useCallback } from 'react'
import { Contract } from 'ethers'
import { useAccount } from 'wagmi'

import { approve as initApprove } from 'contracts/erc20'
import { Erc20Abi } from 'lib/abi'
import { useProvider } from './useProvider'
import { useTx } from './useTx'

export function useApprove() {
  const provider = useProvider()
  const { subscribeTx } = useTx()

  const { address: account } = useAccount()

  const approve = useCallback(
    async (address: string, spender: string) => {
      if (!address || !provider || !account) return

      const contract = new Contract(
        address,
        Erc20Abi,
        provider.getSigner(account)
      )

      const response = await initApprove(contract, spender)
      subscribeTx?.(response)
      return response.hash
    },
    [account, provider, subscribeTx]
  )

  return {
    approve,
  }
}
