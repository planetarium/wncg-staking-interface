import config from 'config'

export function explorerUrlFor(address?: string): string {
  if (!address) return ''
  return `${config.blockExplorerUrl}/address/${address}`
}
