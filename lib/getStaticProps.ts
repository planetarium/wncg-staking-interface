import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { GetStaticPropsContext } from 'next'

import { ChainId } from 'config/chains'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { getQueryString } from 'utils/getQueryString'
import { fetchPoolSnapshot } from 'lib/queries/fetchPoolSnapshot'
import { fetchProject } from './queries/fetchProject'
import { fetchPrice } from './queries/fetchPrice'

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const queryClient = new QueryClient()

  const _chainId = getQueryString(ctx?.params?.chainId)
  const chainId = Math.max(Number(_chainId), ChainId.ETHEREUM) as ChainId

  const project = await fetchProject(chainId)
  const prices = await fetchPrice(chainId)

  try {
    await queryClient.prefetchQuery(
      [QUERY_KEYS.Build, chainId],
      () => fetchProject(chainId),
      {
        staleTime: Infinity,
        cacheTime: Infinity,
      }
    )

    await queryClient.prefetchQuery(
      [QUERY_KEYS.Staking.Prices, chainId],
      () => fetchPrice(chainId),
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
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
