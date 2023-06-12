import config from 'config'
import { bnum } from './bnum'

export function deserializePool(pool: SerializedPool): Pool {
  const { address, totalShares, tokens } = pool

  const poolTokens = tokens.map((t) => ({
    ...t,
    address: t.address?.toLowerCase() as Hash,
  }))

  const bptAddress = address?.toLowerCase() as Hash

  const poolTokenAddresses = poolTokens.map(
    (t) => t.address?.toLowerCase() as Hash
  )
  const poolTokenBalances = poolTokens.map((t) => t.balance)
  const poolTokenDecimals = poolTokens.map((t) => t.decimals)
  const poolTokenWeights = poolTokens.map((t) => t.weight)
  const poolTokenWeightsInPcnt = poolTokenWeights.map((weight) =>
    bnum(weight).times(100).toNumber()
  )
  const poolTokenSymbols = poolTokens.map((t) => t.symbol)

  const shouldReversePoolTokenOrderOnDisplay =
    poolTokenAddresses.findIndex((addr) => addr === config.wrapped) === 0

  const bptName = poolTokenSymbols
    .map((symb, i) => `${poolTokenWeightsInPcnt[i]}${symb}`)
    .join('-')

  const bptSymbol = `${
    poolTokenSymbols[shouldReversePoolTokenOrderOnDisplay ? 1 : 0]
  } BPT`

  return {
    bptAddress,
    bptTotalSupply: totalShares ?? '0',
    bptSymbol,
    bptName,
    bptDecimals: 18,
    poolTokens,
    poolTokenAddresses,
    poolTokenBalances,
    poolTokenDecimals,
    poolTokenWeights,
    poolTokenWeightsInPcnt,
    poolTokenSymbols,
    shouldReversePoolTokenOrderOnDisplay,
  }
}
