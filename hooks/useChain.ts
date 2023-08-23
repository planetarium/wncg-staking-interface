import { useMemo } from 'react'
import { useNetwork } from 'wagmi'

import { CHAINS, ChainId } from 'config/chains'
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

  // const defaultChain = ChainId.ETHEREUM
  const defaultChain = ChainId.GOERLI

  const chain = CHAINS[chainId ?? defaultChain]
  const dex = DEX[chainId ?? defaultChain]
  const stakingAddress = STAKING_ADDRESS[chainId ?? defaultChain]
  const dexProtocolAddress = DEX_PROTOCOL_ADDRESS[chainId ?? defaultChain]

  const balAddress = BAL_ADDRESS[chainId ?? defaultChain]

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
