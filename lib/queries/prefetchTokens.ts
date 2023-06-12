import { fetchToken } from '@wagmi/core'

import config from 'config'

export async function prefetchTokens(tokensList: Hash[]) {
  try {
    const promises = tokensList.map((a) =>
      fetchToken({
        address: a,
        chainId: config.chainId,
      })
    )

    const responses = await Promise.all(promises)
    const tokensMap = new Map<Hash, TokenInfo>()

    responses.forEach((r) => {
      const address = r.address?.toLowerCase() as Hash

      tokensMap.set(address, {
        address: address,
        decimals: r.decimals,
        name: r.name,
        symbol: r.symbol,
      })
    })

    const tokenMap = Object.fromEntries(tokensMap) as {
      [address: Hash]: TokenInfo
    }

    tokenMap[config.nativeCurrency.address] = {
      address: config.nativeCurrency.address,
      decimals: config.nativeCurrency.decimals,
      name: config.nativeCurrency.name,
      symbol: config.nativeCurrency.symbol,
    }

    return tokenMap
  } catch (error) {
    throw error
  }
}
