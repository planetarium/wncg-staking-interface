import { QueryFunctionContext } from '@tanstack/react-query'
import { request } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import { PAGE_PER } from 'config/misc'
import { DEX } from 'config/constants/dex'
import { CHAINS } from 'config/chains'

type FetchSwapsResponse = {
  data: {
    pool: {
      swaps: Swap[]
    }
  }
}

export async function fetchPoolSwaps({
  pageParam = 0,
  queryKey = [],
}: QueryFunctionContext): Promise<Swap[]> {
  const [, chainId] = queryKey
  const { dexPoolId: poolId } = DEX[chainId as ChainId]
  const { subgraph: endpoint } = CHAINS[chainId as ChainId]

  if (!poolId || !endpoint) return []

  const query = {
    query: {
      pool: {
        __args: {
          id: poolId,
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
    endpoint,
    jsonToGraphQLQuery(query)
  )

  return data?.pool?.swaps ?? []
}
