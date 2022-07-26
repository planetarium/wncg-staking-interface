import {
  ApolloClient,
  ApolloLink,
  gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { BPT_POOL_ID } from 'utils/env'

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_BALANCER_GRAPHQL,
})

export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_BALANCER_GRAPHQL,
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink as any as ApolloLink]),
})

export async function fetchPoolTokenBalances() {
  const result = await client.query({
    query: gql`
      {
        pool(
          id: "${BPT_POOL_ID}"
        ) {
          tokens {
            symbol
            balance
          }
        }
      }
    `,
  })

  return result?.data?.pool?.tokens
}
