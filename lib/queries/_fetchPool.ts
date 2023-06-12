import { request } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import { CHAINS } from 'config/chains'
import { balancerPoolIdFor } from 'utils/balancerPoolIdFor'

type FetchPoolResponse = {
  pool: {
    totalShares: string
    tokens: PoolToken[]
  }
}

export async function fetchPool(chainId: ChainId) {
  const poolId = balancerPoolIdFor(chainId)

  const query = {
    query: {
      pool: {
        __args: {
          id: poolId,
        },
        totalShares: true,
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

  const { pool } = await request<FetchPoolResponse>(
    CHAINS[chainId].subgraph ?? '',
    jsonToGraphQLQuery(query)
  )

  return pool
}
