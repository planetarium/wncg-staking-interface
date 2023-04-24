import { request } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import config from 'config'
import { DAY } from 'config/misc'
import { bnum } from 'utils/bnum'
import { now } from 'utils/now'

type FetchPoolSnapshotResponse = {
  pool: {
    swapFee: string
    tokens: {
      address: string
      balance: string
    }[]
  }
  swaps: {
    valueUSD: string
  }[]
}

export async function fetchPoolSnapshot(currentTimestamp: number = now()) {
  const query = {
    query: {
      pool: {
        __args: {
          id: config.poolId,
        },
        swapFee: true,
        tokens: {
          address: true,
          balance: true,
        },
      },
      swaps: {
        __args: {
          where: {
            poolId: config.poolId,
            timestamp_lt: currentTimestamp,
            timestamp_gte: currentTimestamp - DAY,
          },
        },
        valueUSD: true,
      },
    },
  }

  const { pool, swaps } = await request<FetchPoolSnapshotResponse>(
    config.subgraph,
    jsonToGraphQLQuery(query)
  )

  const poolTokenBalances = pool.tokens.map((t) => t.balance)

  const totalSwapVolumeIn24Hr = swaps
    ?.reduce((acc, s) => {
      return acc.plus(s.valueUSD)
    }, bnum(0))
    .toString()

  const totalSwapFeesIn24Hr = bnum(totalSwapVolumeIn24Hr)
    .times(pool.swapFee)
    .toString()

  return {
    poolTokenBalances,
    totalSwapVolumeIn24Hr,
    totalSwapFeesIn24Hr,
  }
}
