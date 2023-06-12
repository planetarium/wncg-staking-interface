import { request } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import { ChainId, CHAINS } from 'config/chains'
import { DEX } from 'config/constants/dex'
import { LIQUIDITY_POOL_PLACEHOLDER } from 'config/constants/placeholders'
import { bnum } from 'utils/bnum'

export async function fetchBalancerPool(
  chainId: ChainId
): Promise<LiquidityPool> {
  const { dexPoolId: poolId } = DEX[chainId]
  const { subgraph: endpoint, nativeCurrency } = CHAINS[chainId]

  if (!poolId || !endpoint) return LIQUIDITY_POOL_PLACEHOLDER

  const query = {
    query: {
      pool: {
        __args: {
          id: poolId,
        },
        address: true,
        symbol: true,
        name: true,
        totalShares: true,
        totalSwapFee: true,
        tokens: {
          symbol: true,
          name: true,
          decimals: true,
          address: true,
          balance: true,
          weight: true,
        },
      },
    },
  }

  const { pool } = await request<{ pool: SerializedPool }>(
    endpoint,
    jsonToGraphQLQuery(query)
  )

  const { address, totalShares = '0', totalSwapFee = '0', tokens } = pool

  const poolTokens = tokens.map((t) => ({
    ...t,
    address: t.address.toLowerCase() as Hash,
  }))

  const lpAddress = address.toLowerCase() as Hash

  const poolTokenAddresses = poolTokens.map(
    (t) => t.address.toLowerCase() as Hash
  )
  const poolTokenBalances = poolTokens.map((t) => t.balance)
  const poolTokenDecimals = poolTokens.map((t) => t.decimals)
  const poolTokenWeights = poolTokens.map((t) => t.weight)
  const poolTokenWeightsInPcnt = poolTokenWeights.map((weight) =>
    bnum(weight).times(100).toNumber()
  )
  const poolTokenSymbols = poolTokens.map((t) => t.symbol)

  const shouldReversePoolTokenOrderOnDisplay =
    poolTokenAddresses.findIndex(
      (addr) => addr === nativeCurrency.wrappedTokenAddress
    ) === 0

  const lpName = poolTokenSymbols
    .map((symb, i) => `${poolTokenWeightsInPcnt[i]}${symb}`)
    .join('-')

  const lpSymbol = `${
    poolTokenSymbols[shouldReversePoolTokenOrderOnDisplay ? 1 : 0]
  } BPT`

  return {
    lpToken: {
      address: lpAddress,
      decimals: 18,
      name: lpName,
      symbol: lpSymbol,
      totalSupply: totalShares,
    },

    poolTokens,
    poolTokenAddresses,
    poolTokenBalances,
    poolTokenDecimals,
    poolTokenWeights,
    poolTokenWeightsInPcnt,
    poolTokenSymbols,

    totalSwapFee,

    shouldReversePoolTokenOrderOnDisplay,
  }
}
