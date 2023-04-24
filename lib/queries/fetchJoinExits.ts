import { QueryFunctionContext } from '@tanstack/react-query'
import { request } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import config from 'config'
import { PAGE_PER } from 'config/misc'

type FetchJoinExitsResponse = {
  data: {
    joinExits: JoinExit[]
  }
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
          first: PAGE_PER,
          skip: pageParam,
          where: {
            pool: config.poolId,
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

  const { data } = await request<FetchJoinExitsResponse>(
    config.subgraph,
    jsonToGraphQLQuery(query)
  )

  return data?.joinExits ?? []
}
