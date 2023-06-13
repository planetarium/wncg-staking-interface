import { fetchBalance } from '@wagmi/core'

import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'

export async function fetchUserBalances(
  chainId: ChainId,
  account: Hash,
  addresses: Hash[]
): Promise<RawBalanceMap> {
  console.log(44444, chainId)
  try {
    const promises = [
      fetchBalance({
        address: account,
        chainId,
      }),
      ...addresses.map((addr) =>
        fetchBalance({
          address: account,
          chainId,
          token: addr,
        })
      ),
    ]

    const responses = await Promise.all(promises)

    const entries = responses.map((res, i) => {
      const address = i === 0 ? NATIVE_CURRENCY_ADDRESS : addresses[i - 1]
      return [address, res.formatted]
    })

    return Object.fromEntries(entries)
  } catch (error) {
    throw error
  }
}
