import { createClient, createPublicClient, http } from 'viem'
import { useChain } from './useChain'
import { useMemo } from 'react'
import { ChainId } from 'config/chains'
import { bsc, bscTestnet, goerli, mainnet } from 'viem/chains'
import { assertUnreachable } from 'utils/assertUnreachable'

export function useViemClient() {
  const { chainId } = useChain()

  const chain = useMemo(() => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return mainnet
      case ChainId.GOERLI:
        return goerli
      case ChainId.BSC:
        return bsc
      case ChainId.BSC_TESTNET:
        return bscTestnet
      default:
        assertUnreachable(chainId)
    }
  }, [chainId])

  const client = useMemo(() => {
    return createPublicClient({
      chain,
      transport: http(),
    })
  }, [chain])

  return client
}
