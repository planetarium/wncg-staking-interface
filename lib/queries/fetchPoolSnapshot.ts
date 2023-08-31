import { request } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import { CHAINS } from 'config/chains'
import { DEX } from 'config/constants/dex'
import { DAY } from 'config/constants/time'
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

export async function fetchPoolSnapshot(
  chainId: ChainId,
  currentTimestamp: number = now()
) {
  const { dexPoolId: poolId } = DEX[chainId as ChainId]
  const { subgraph: endpoint } = CHAINS[chainId as ChainId]

  if (!poolId || !endpoint)
    return {
      poolTokenBalances: [],
      totalSwapVolumeIn24Hr: '0',
      totalSwapFeesIn24Hr: '0',
    }

  const query = {
    query: {
      pool: {
        __args: {
          id: poolId,
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
            poolId: poolId,
            timestamp_lt: currentTimestamp,
            timestamp_gte: currentTimestamp - DAY,
          },
        },
        valueUSD: true,
      },
    },
  }

  const { pool, swaps } = await request<FetchPoolSnapshotResponse>(
    endpoint,
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
