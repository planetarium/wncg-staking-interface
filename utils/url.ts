import { IS_ETHEREUM } from './env'

export function getEtherscanUrl(address?: string) {
  if (!address) return ''
  return `https://${IS_ETHEREUM ? '' : 'kovan.'}etherscan.io/address/${address}`
}

export function getTxUrl(hash?: string) {
  if (!hash) return ''
  return `https://${IS_ETHEREUM ? '' : 'kovan.'}etherscan.io/tx/${hash}`
}
