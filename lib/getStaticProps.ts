import { dehydrate, QueryClient } from '@tanstack/react-query'

import { queryKeys } from 'config/queryKeys'
import { build } from 'lib/queries/build'
import { fetchPoolSnapshot } from 'lib/queries/fetchPoolSnapshot'
import { now } from 'utils/now'
import { fetchPrices } from './queries/fetchPrices'
import { getBptPrice } from 'utils/getBptPrice'

export async function getStaticProps() {
  const queryClient = new QueryClient()
  const buildTime = now()

  const buildData = await build()
  const priceMap = await fetchPrices(
    ...buildData.rewardTokenAddresses,
    ...buildData.poolTokenAddresses
  )

  const bptPrice = getBptPrice(
    buildData.poolTokens,
    buildData.bptTotalSupply,
    priceMap
  )

  await queryClient.prefetchQuery<BuildResponse>([queryKeys.Build], build, {
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  queryClient.setQueryData<PriceMap>([queryKeys.FallbackPrices], {
    ...priceMap,
    [buildData.bptAddress]: bptPrice,
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
    revalidate: 60 * 60 * 24, // 24 hour
  }
}
