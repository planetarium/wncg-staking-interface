import { CHAINS } from 'config/chains'

export function chainNameFor(chainId: ChainId): string {
  return CHAINS[chainId].chainName
}
