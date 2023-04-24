import { request } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import config from 'config'

const query = {
  query: {
    pool: {
      __args: {
        id: config.poolId,
      },
      id: true,
      address: true,
      factory: true,
      symbol: true,
      name: true,
      swapFee: true,
      owner: true,
      totalWeight: true,
      totalLiquidity: true,
      totalShares: true,
      totalSwapFee: true,
      totalSwapVolume: true,
      createTime: true,
      tokensList: true,
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

type PrefetchPoolResponse = {
  pool: PoolResponse
}

export async function prefetchPool() {
  const { pool } = await request<PrefetchPoolResponse>(
    config.subgraph,
    jsonToGraphQLQuery(query)
  )

  return pool
}
