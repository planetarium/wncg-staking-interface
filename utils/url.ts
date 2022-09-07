import { configService } from 'services/config'
import { balancerUrlFor, explorerUrlFor, networkChainId } from './network'

export function getBalancerPoolUrl(poolId: string) {
  return `${balancerUrlFor(networkChainId)}/pool/${poolId}`
}

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
