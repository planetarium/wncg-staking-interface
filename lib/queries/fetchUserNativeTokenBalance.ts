import { fetchBalance } from '@wagmi/core'

export async function fetchUserNativeTokenBalance(
  account: Hash,
  chainId: ChainId
): Promise<string> {
  try {
    return (
      await fetchBalance({
        address: account,
        chainId,
      })
    ).formatted
  } catch (error) {
    throw error
  }
}
