export function platformIdFor(chainId: ChainId) {
  if (chainId === 1 || chainId === 11155111) return 'ethereum'
  return 'binance-smart-chain'
}
