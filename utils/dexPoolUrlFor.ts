import { ChainId } from 'config/chains'
import { DEX } from 'config/constants/dex'
import { isEthereum } from './isEthereum'

export function dexPoolUrlFor(chainId: ChainId) {
  const { dexPoolId, dexPlatformUrl, network } = DEX[chainId]

  return isEthereum(chainId)
    ? `${dexPlatformUrl}/#/${network}/pool/${dexPoolId}`
    : `${dexPlatformUrl}/info/pairs/${dexPoolId}?chainId=${chainId}`
}
