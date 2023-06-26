import { CHAINS, ChainId } from 'config/chains'
import { DEX } from 'config/constants/dex'
import { isEthereum } from './isEthereum'

export function dexPoolUrlFor(chainId: ChainId) {
  const { nativeCurrency } = CHAINS[chainId]
  const { dexPoolId, dexPlatformUrl, network } = DEX[chainId]

  // FIXME: dexPoolId (BSC) 기준 변경해야함
  return isEthereum(chainId)
    ? `${dexPlatformUrl}/#/${network}/pool/${dexPoolId}`
    : `${dexPlatformUrl}/v2/pair/${nativeCurrency.symbol}/${dexPoolId}?chain=${chainId}`
}
