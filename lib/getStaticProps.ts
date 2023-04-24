import { dehydrate, QueryClient } from '@tanstack/react-query'

import { queryKeys } from 'config/queryKeys'
import { build } from 'lib/queries/build'
import { fetchPoolSnapshot } from 'lib/queries/fetchPoolSnapshot'
import { now } from 'utils/now'

export async function getStaticProps() {
  const queryClient = new QueryClient()
  const buildTime = now()

  await queryClient.prefetchQuery<BuildResponse>([queryKeys.Build], build, {
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  await queryClient.prefetchQuery<PoolSnapshotResponse>(
    [queryKeys.Pool.Snapshot, buildTime],
    () => fetchPoolSnapshot(buildTime),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60, // 1 hour
  }
}
