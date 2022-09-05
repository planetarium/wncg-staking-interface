import { QueryFunctionContext } from '@tanstack/react-query'
import { request } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import { configService } from 'services/config'
import { createLogger } from 'utils/log'

const logger = createLogger('purple')

const endpoint = configService.subgraph
const poolId = configService.env.poolId
const itemsPerPage = 5

const fetchPoolQuery = {
  query: {
    pool: {
      __args: {
        id: poolId,
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

export async function fetchPool(): Promise<Pool> {
  logger(`${poolId.slice(0, 6)} pool`)
  const data = await request(endpoint, jsonToGraphQLQuery(fetchPoolQuery))
  return data?.pool
}

export async function fetchPoolSwaps({
  pageParam = 0,
}: QueryFunctionContext): Promise<Swap[]> {
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
            first: itemsPerPage,
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

  logger(`${itemsPerPage} swaps`)
  const data = await request(endpoint, jsonToGraphQLQuery(query))
  return data?.pool?.swaps || []
}

export async function fetchPoolJoinExits({
  pageParam = 0,
  queryKey,
}: QueryFunctionContext): Promise<JoinExit[]> {
  const [, showMine, account] = queryKey || []
  const shouldFilterJoinExits = showMine && account
  const where = shouldFilterJoinExits ? { user: account } : {}

  const query = {
    query: {
      joinExits: {
        __args: {
          orderBy: 'timestamp',
          orderDirection: 'desc',
          first: itemsPerPage,
          skip: pageParam,
          where: {
            pool: poolId,
            ...where,
          },
        },
        id: true,
        type: true,
        amounts: true,
        sender: true,
        timestamp: true,
        tx: true,
      },
    },
  }

  logger(`${itemsPerPage} investments`)
  const data = await request(endpoint, jsonToGraphQLQuery(query))
  return data?.joinExits || []
}

export function getNextPageParam<T>(lastPage: T[], pages: T[][]) {
  return lastPage.length === itemsPerPage ? pages.length * itemsPerPage : false
}
