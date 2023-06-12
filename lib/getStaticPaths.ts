import { ChainId } from 'config/chains'

const supportedNetworks = [
  ChainId.ETHEREUM,
  ChainId.GOERLI,
  ChainId.BSC,
  ChainId.BSC_TESTNET,
]

export async function getStaticPaths() {
  return {
    paths: supportedNetworks.map((chainId) => ({
      params: {
        chainId: String(chainId),
      },
    })),
    fallback: true, // false or "blocking"
  }
}
