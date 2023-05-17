import { request } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import config from 'config'

const query = {
  query: {
    pool: {
      __args: {
        id: config.poolId,
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

type FetchPoolResponse = {
  pool: {
    totalShares: string
    tokens: PoolToken[]
  }
}

export async function fetchPool() {
  const { pool } = await request<FetchPoolResponse>(
    config.subgraph,
    jsonToGraphQLQuery(query)
  )

  return pool
}
