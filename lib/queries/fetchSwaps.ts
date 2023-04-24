import { QueryFunctionContext } from '@tanstack/react-query'
import { request } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import config from 'config'
import { PAGE_PER } from 'config/misc'

type FetchSwapsResponse = {
  data: {
    pool: {
      swaps: Swap[]
    }
  }
}

export async function fetchPoolSwaps({
  pageParam = 0,
}: QueryFunctionContext): Promise<Swap[]> {
  const query = {
    query: {
      pool: {
        __args: {
          id: config.poolId,
        },
        swaps: {
          __args: {
            orderBy: 'timestamp',
            orderDirection: 'desc',
            first: PAGE_PER,
            skip: pageParam,
          },
          tokenIn: true,
          tokenOut: true,
          tokenAmountIn: true,
          tokenAmountOut: true,
          valueUSD: true,
          userAddress: {
            id: true,
          },
          timestamp: true,
          tx: true,
        },
      },
    },
  }

  const { data } = await request<FetchSwapsResponse>(
    config.subgraph,
    jsonToGraphQLQuery(query)
  )

  return data?.pool?.swaps ?? []
}
