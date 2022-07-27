import { request, gql } from 'graphql-request'
import { BALANCER_SUBGRAPHS, BPT_POOL_ID } from 'utils/env'

const endpoint = BALANCER_SUBGRAPHS as string

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

export async function fetchPoolRecentSwaps(
  skip = 0,
  count = 5
): Promise<Swap[]> {
  const query = gql`
    query {
      pool(
        id: "${BPT_POOL_ID}"
      ) {
        address
        swaps(orderBy: timestamp, orderDirection: desc, first: ${count}, skip: ${skip}) {
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
