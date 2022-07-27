import { request, gql } from 'graphql-request'
import { BPT_POOL_ID } from 'utils/env'

const endpoint = process.env.NEXT_PUBLIC_BALANCER_GRAPHQL as string

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
