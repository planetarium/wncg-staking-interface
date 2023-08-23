import { useMemo } from 'react'
import { useNetwork } from 'wagmi'

import { CHAINS, defaultChainId } from 'config/chains'
import {
  BAL_ADDRESS,
  DEX_PROTOCOL_ADDRESS,
  STAKING_ADDRESS,
} from 'config/constants/addresses'
import { DEX } from 'config/constants/dex'

import { useChainContext } from 'components/ChainProvider'

export function useChain() {
  const { chainId, setChainId } = useChainContext()
  const { chain: currentChain } = useNetwork()

  const networkMismatch = useMemo(
    () => chainId !== currentChain?.id,
    [chainId, currentChain?.id]
  )

  const chain = CHAINS[chainId ?? defaultChainId]
  const dex = DEX[chainId ?? defaultChainId]
  const stakingAddress = STAKING_ADDRESS[chainId ?? defaultChainId]
  const dexProtocolAddress = DEX_PROTOCOL_ADDRESS[chainId ?? defaultChainId]

  const balAddress = BAL_ADDRESS[chainId ?? defaultChainId]

  return {
    ...chain,
    ...dex,
    currentChain,
    setChainId,
    balAddress,
    stakingAddress,
    dexProtocolAddress,
    networkMismatch,
  }
}
