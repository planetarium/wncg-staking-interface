import { dehydrate, QueryClient } from '@tanstack/react-query'

import config from 'config'
import { ChainId, defaultChainId } from 'config/chains'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchPrices } from 'lib/queries/fetchPrices'
import { fetchStaking } from 'lib/queries/fetchStaking'

export async function getStaticProps() {
  const queryClient = new QueryClient()

  const chainId = defaultChainId

  const project = await fetchStaking(chainId)
  const prices = await fetchPrices(chainId)

  const ethereumChainId = config.isTestnet ? ChainId.GOERLI : ChainId.ETHEREUM
  const bscChainId = config.isTestnet ? ChainId.BSC_TESTNET : ChainId.BSC

  await queryClient.prefetchQuery(
    [QUERY_KEYS.Build, ethereumChainId],
    () => fetchStaking(ethereumChainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  await queryClient.prefetchQuery(
    [QUERY_KEYS.Build, bscChainId],
    () => fetchStaking(bscChainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  await queryClient.prefetchQuery(
    [QUERY_KEYS.Staking.Prices, ethereumChainId],
    () => fetchPrices(ethereumChainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  await queryClient.prefetchQuery(
    [QUERY_KEYS.Staking.Prices, bscChainId],
    () => fetchPrices(bscChainId),
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
    revalidate: 60 * 10,
  }
}
