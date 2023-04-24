import { fetchBalance } from '@wagmi/core'

import config from 'config'

export async function fetchUserNativeTokenBalance(
  account: Hash
): Promise<string> {
  try {
    return (
      await fetchBalance({
        address: account,
        chainId: config.chainId,
      })
    ).formatted
  } catch (error) {
    throw error
  }
}
