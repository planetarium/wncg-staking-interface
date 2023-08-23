import type { GetStaticPathsResult } from 'next'

import { SUPPORTED_CHAINS } from 'config/chains'

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = SUPPORTED_CHAINS.map((id) => ({
    params: {
      chainId: String(id),
      locale: 'en',
    },
  }))

  return {
    fallback: 'blocking',
    paths,
  }
}
