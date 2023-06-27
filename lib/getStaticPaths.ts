import { ChainId } from 'config/chains'
import { GetStaticPathsResult } from 'next'

const supportedNetworks = [
  ChainId.ETHEREUM,
  ChainId.GOERLI,
  ChainId.BSC,
  ChainId.BSC_TESTNET,
]

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = supportedNetworks.map((chainId) => ({
    params: {
      chainId: String(chainId),
      locale: 'en',
    },
  }))

  return {
    fallback: 'blocking',
    paths,
  }
}
