import { useMemo } from 'react'
import { createPublicClient, createWalletClient, custom, http } from 'viem'

import { useAuth, useChain } from 'hooks'

export function useViemClients() {
  const { account } = useAuth()
  const { chain } = useChain()

  const publicClient = useMemo(() => {
    return createPublicClient({
      chain,
      transport: http(),
    })
  }, [chain])

  const walletClient = useMemo(() => {
    if (!account) return null
    // @ts-ignore
    if (!window && !window?.ethereum) return null

    return createWalletClient({
      chain,
      // @ts-ignore
      transport: custom(window.ethereum),
      account,
    })
  }, [account, chain])

  return {
    publicClient,
    walletClient,
  }
}
