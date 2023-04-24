import config from 'config'

export function txUrlFor(hash?: string) {
  if (!hash) return ''
  return `${config.blockExplorerUrl}/tx/${hash}`
}
