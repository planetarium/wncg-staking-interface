import { bnum } from './bnum'

export function deserializePool(pool: PoolResponse): Pool {
  const {
    id,
    address,
    swapFee,
    totalLiquidity,
    totalShares,
    totalSwapFee,
    totalSwapVolume,
    tokens,
    tokensList,
  } = pool

  const poolTokens = tokens.map((t) => ({
    ...t,
    address: t.address.toLowerCase() as Hash,
  }))

  const bptAddress = address.toLowerCase() as Hash

  const poolTokenAddresses = tokensList.map((a) => a.toLowerCase() as Hash)
  const poolTokenBalances = poolTokens.map((t) => t.balance)
  const poolTokenDecimals = poolTokens.map((t) => t.decimals)
  const poolTokenWeights = poolTokens.map((t) => t.weight)
  const poolTokenWeightsInPcnt = poolTokenWeights.map((weight) =>
    bnum(weight).times(100).toNumber()
  )
  const poolTokenSymbols = poolTokens.map((t) => t.symbol)

  const bptName = poolTokenSymbols
    .map((symb, i) => `${poolTokenWeightsInPcnt[i]}${symb}`)
    .join('-')

  return {
    bptAddress,
    bptTotalSupply: totalShares ?? '0',
    bptSymbol: bptName,
    bptName,
    bptDecimals: 18,
    poolId: id,
    poolSwapFee: swapFee ?? '0',
    poolTotalLiquidity: totalLiquidity ?? '0',
    poolTotalSwapVolume: totalSwapVolume ?? '0',
    poolTotalSwapFee: totalSwapFee ?? '0',
    poolTokens,
    poolTokenAddresses,
    poolTokenBalances,
    poolTokenDecimals,
    poolTokenWeights,
    poolTokenWeightsInPcnt,
    poolTokenSymbols,
  }
}
