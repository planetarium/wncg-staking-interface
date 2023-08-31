export function platformIdFor(chainId: ChainId) {
  if (chainId === 1 || chainId === 5) return 'ethereum'
  return 'binance-smart-chain'
}
