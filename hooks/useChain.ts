import { useRouter } from 'next/router'

import { CHAINS, ChainId } from 'config/chains'
import { DEX } from 'config/constants/dex'
import { STAKING_ADDRESS } from 'config/constants/addresses'
import { useAtomValue } from 'jotai'
import { chainIdAtom } from 'states/system'

export function useChain() {
  const chainId = useAtomValue(chainIdAtom) ?? ChainId.ETHEREUM

  const chain = CHAINS[chainId]
  const dex = DEX[chainId]
  const stakingAddress = STAKING_ADDRESS[chainId]

  return {
    ...chain,
    ...dex,
    stakingAddress,
  }
}
