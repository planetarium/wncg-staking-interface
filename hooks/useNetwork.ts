import { useEffect, useState } from 'react'
import { useNetwork as useWagmiNetwork } from 'wagmi'
import type { Chain } from 'wagmi'

export function useNetwork() {
  const [chain, setChain] = useState<Chain | undefined>()
  const [chains, setChains] = useState<Chain[]>([])

  const { chain: _chain, chains: _chains } = useWagmiNetwork()

  function updateNetwork() {
    setChain(_chain)
    setChains(_chains)
  }

  useEffect(updateNetwork, [_chain, _chains])

  return {
    chain,
    chains,
  }
}
