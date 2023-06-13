import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { GetStaticPropsContext } from 'next'

import { ChainId } from 'config/chains'
import { LIQUIDITY_POOL_PLACEHOLDER } from 'config/constants/placeholders'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { getQueryString } from 'utils/getQueryString'
import { build } from 'lib/queries/build'
import { fetchPrices } from 'lib/queries/fetchPrices'
import { fetchPool } from 'lib/queries/fetchPool'
import { fetchPoolSnapshot } from 'lib/queries/fetchPoolSnapshot'
import { fetchStaking } from 'lib/queries/fetchStaking'

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const queryClient = new QueryClient()

  const _chainId = getQueryString(params?.chainId)
  const chainId = Math.max(Number(_chainId), ChainId.ETHEREUM) as ChainId

  const {
    pool = LIQUIDITY_POOL_PLACEHOLDER,
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
    [QUERY_KEYS.Pool.Data, chainId],
    () => fetchPool(chainId),
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
    [QUERY_KEYS.Pool.Snapshot, chainId],
    () => fetchPoolSnapshot(chainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
