import { CHAINS } from 'config/chains'

export function explorerUrlFor(chainId: ChainId, address?: string): string {
  const currentNetwork = CHAINS[chainId]

  if (!currentNetwork) return ''

  return `${currentNetwork.explorer}/address/${address}`
}
