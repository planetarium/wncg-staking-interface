import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { GetStaticPropsContext } from 'next'

import { ChainId } from 'config/chains'
import { STAKING_ADDRESS } from 'config/constants/addresses'
import { LIQUIDITY_POOL_PLACEHOLDER } from 'config/constants/placeholders'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { build } from 'lib/queries/build'
import { fetchPoolSnapshot } from 'lib/queries/fetchPoolSnapshot'
import { getQueryString } from 'utils/getQueryString'
import { now } from 'utils/now'
import { fetchStaking } from './queries/fetchStaking'
import { fetchPrices } from './queries/fetchPrices'

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const queryClient = new QueryClient()

  const buildTime = now()
  const _chainId = getQueryString(ctx.params?.chainId)
  const chainId = (Number(_chainId) ?? ChainId.ETHEREUM) as ChainId
  const stakingAddress = STAKING_ADDRESS[chainId]

  const {
    pool = LIQUIDITY_POOL_PLACEHOLDER,
    priceMap,
    staking = {
      rewardTokenAddresses: [],
    },
  } = (await build(chainId)) ?? {}

  await queryClient.prefetchQuery(
    [QUERY_KEYS.Build, chainId],
    () => build(chainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  await queryClient.prefetchQuery(
    [QUERY_KEYS.Staking.Data, chainId],
    () => fetchStaking(chainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  await queryClient.prefetchQuery(
    [QUERY_KEYS.Staking.Prices, chainId],
    () =>
      fetchPrices(chainId, [
        ...pool?.poolTokenAddresses,
        ...staking?.rewardTokenAddresses,
      ]),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  await queryClient.prefetchQuery<PoolSnapshotResponse>(
    [QUERY_KEYS.Pool.Snapshot, buildTime, chainId],
    () => fetchPoolSnapshot(chainId, buildTime),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  queryClient.setQueryData<PriceMap>(
    [QUERY_KEYS.FallbackPrices, chainId],
    priceMap ?? {}
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
