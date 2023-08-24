import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { GetStaticPropsContext } from 'next'

import { ChainId, defaultChainId } from 'config/chains'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { getQueryString } from 'utils/getQueryString'
import { fetchPoolSnapshot } from 'lib/queries/fetchPoolSnapshot'
import { fetchProject } from './queries/fetchProject'
import { fetchPrices } from './queries/fetchPrices'

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const queryClient = new QueryClient()

  const _chainId = getQueryString(ctx?.params?.chainId)
  const chainId = Math.max(Number(_chainId), defaultChainId) as ChainId

  const project = await fetchProject(chainId)
  const prices = await fetchPrices(chainId)

  try {
    await queryClient.prefetchQuery(
      [QUERY_KEYS.Build, 5],
      () => fetchProject(5),
      {
        staleTime: Infinity,
        cacheTime: Infinity,
      }
    )

    await queryClient.prefetchQuery(
      [QUERY_KEYS.Build, 97],
      () => fetchProject(97),
      {
        staleTime: Infinity,
        cacheTime: Infinity,
      }
    )

    await queryClient.prefetchQuery(
      [QUERY_KEYS.Staking.Prices, 5],
      () => fetchPrices(5),
      {
        staleTime: Infinity,
        cacheTime: Infinity,
      }
    )

    await queryClient.prefetchQuery(
      [QUERY_KEYS.Staking.Prices, 97],
      () => fetchPrices(97),
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
        chainId,
        project,
        prices,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
