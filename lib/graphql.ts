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

export async function fetchPool() {
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
