import { CHAINS, ChainId } from 'config/chains'
import {
  BAL_ADDRESS,
  DEX_PROTOCOL_ADDRESS,
  STAKING_ADDRESS,
} from 'config/constants/addresses'
import { DEX } from 'config/constants/dex'

import { useChainContext } from 'components/ChainProvider'
import { useNetwork } from 'wagmi'
import { useMemo } from 'react'

export function useChain() {
  const { chainId, setChainId } = useChainContext()
  const { chain: currentChain } = useNetwork()

  const networkMismatch = useMemo(
    () => chainId !== currentChain?.id,
    [chainId, currentChain?.id]
  )

  const chain = CHAINS[chainId ?? ChainId.ETHEREUM]
  const dex = DEX[chainId ?? ChainId.ETHEREUM]
  const stakingAddress = STAKING_ADDRESS[chainId ?? ChainId.ETHEREUM]
  const dexProtocolAddress = DEX_PROTOCOL_ADDRESS[chainId ?? ChainId.ETHEREUM]

  const balAddress = BAL_ADDRESS[chainId ?? ChainId.ETHEREUM]

  return {
    ...chain,
    ...dex,
    setChainId,
    balAddress,
    stakingAddress,
    dexProtocolAddress,
    networkMismatch,
  }
}
