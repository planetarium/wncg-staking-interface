import { request, gql } from 'graphql-request'
import { QueryFunctionContext } from 'react-query'
import { BALANCER_SUBGRAPHS, BPT_POOL_ID } from 'utils/env'

const endpoint = BALANCER_SUBGRAPHS as string
const itemsPerPage = 5

export async function fetchPoolTokenBalances() {
  const query = gql`
    query {
      pool(id: "${BPT_POOL_ID}") {
        tokens {
          symbol
          balance
        }
      }
    }
  `

  const result = await request(endpoint, query)
  return result?.pool?.tokens
}

export async function fetchPool(): Promise<Pool> {
  const query = gql`
    query {
      pool(
        id: "${BPT_POOL_ID}"
      ) {
        id
        address
        factory
        symbol
        name
        swapFee
        owner
        totalWeight
        totalLiquidity
        totalShares
        createTime
        tokensList
        tokens {
          symbol
          name
          decimals
          address
          balance
          weight
        }
      }
    }
  `

  const result = await request(endpoint, query)
  return result?.pool
}

export async function fetchPoolRecentSwaps({ pageParam = 0 }): Promise<Swap[]> {
  const query = gql`
    query {
      pool(
        id: "${BPT_POOL_ID}"
      ) {
        address
        swaps(orderBy: timestamp, orderDirection: desc, first: ${itemsPerPage}, skip: ${pageParam}) {
          tokenIn
          tokenOut
          tokenAmountIn
          tokenAmountOut
          valueUSD
          userAddress {
            id
          }
          timestamp
        }
      }
    }
  `

  const result = await request(endpoint, query)
  return result?.pool?.swaps || []
}

export async function fetchPoolRecentJoinExits({
  pageParam = 0,
  queryKey,
}: QueryFunctionContext): Promise<JoinExit[]> {
  const [, showMine, account] = queryKey || []

  const where =
    showMine && !!account
      ? `{
    pool: "${BPT_POOL_ID}",
    user: "${account}"
  }`
      : `{
    pool: "${BPT_POOL_ID}"
  }`

  const query = gql`
    query {
      joinExits(
        orderBy: timestamp,
        orderDirection: desc,
        first: ${itemsPerPage},
        skip: ${pageParam},
        where: ${where}
      ) {
        id
        type
        amounts
        sender
        timestamp
        tx
      }
    }
  `

  const result = await request(endpoint, query)
  return result?.joinExits || []
}

export function getNextPageParam<T>(lastPage: T[], pages: T[][]) {
  return lastPage.length === itemsPerPage ? pages.length * itemsPerPage : false
}
