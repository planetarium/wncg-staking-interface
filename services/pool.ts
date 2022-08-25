import type { QueryFunctionContext } from 'react-query'
import { request } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import { configService } from './config'

export default class PoolService {
  endpoint: string
  poolId: string
  itemsPerPage: number

  constructor(public readonly config = configService) {
    this.endpoint = this.config.subgraph
    this.poolId = this.config.env.poolId
    this.itemsPerPage = 5
  }

  public fetchPool = async (): Promise<Pool> => {
    const query = {
      query: {
        pool: {
          __args: {
            id: this.poolId,
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

    console.log(`💜 Fetch pool`)
    const data = await this.request(query)
    return data?.pool
  }

  public fetchPoolSwaps = async ({ pageParam = 0 }): Promise<Swap[]> => {
    const query = {
      query: {
        pool: {
          __args: {
            id: this.poolId,
          },
          swaps: {
            __args: {
              orderBy: 'timestamp',
              orderDirection: 'desc',
              first: this.itemsPerPage,
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
          },
        },
      },
    }

    console.log(`💜 Fetch pool swaps`)
    const data = await this.request(query)
    return data?.pool?.swaps || []
  }

  public fetchPoolJoinExits = async ({
    pageParam = 0,
    queryKey,
  }: QueryFunctionContext): Promise<JoinExit[]> => {
    const [, showMine, account] = queryKey || []
    const query = {
      query: {
        joinExits: {
          __args: {
            orderBy: 'timestamp',
            orderDirection: 'desc',
            first: this.itemsPerPage,
            skip: pageParam,
            where: {
              pool: this.poolId,
              user: showMine && account ? account : undefined,
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

    console.log(`💜 Fetch pool join exits`)
    const data = await this.request(query)
    return data?.joinExits || []
  }

  private async request(query: any) {
    return await request(this.endpoint, jsonToGraphQLQuery(query))
  }
}

export const poolService = new PoolService()
