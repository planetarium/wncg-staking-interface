import { CHAINS } from 'config/chains'

export function networkNameFor(chainId: ChainId): string {
  return CHAINS[chainId].name
}
