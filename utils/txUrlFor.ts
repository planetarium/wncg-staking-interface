import { CHAINS } from 'config/chains'

export function txUrlFor(chainId: ChainId, hash?: string) {
  if (!hash) return ''
  return `${CHAINS[chainId].explorer}/tx/${hash}`
}
