import { configService } from 'services/config'
import { explorerUrlFor, networkChainId } from './network'

export function getEtherscanUrl(address?: string) {
  if (!address) return ''
  return `${explorerUrlFor(networkChainId)}/address/${address}`
}

export function getTxUrl(hash?: string) {
  if (!hash) return ''
  return `${explorerUrlFor(networkChainId)}/tx/${hash}`
}

export function getOgImageUrl(fileName: string) {
  return `${configService.ogImageUrl}/${fileName}`
}
