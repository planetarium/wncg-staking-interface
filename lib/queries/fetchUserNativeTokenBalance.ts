import { fetchBalance } from '@wagmi/core'

import config from 'config'

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
