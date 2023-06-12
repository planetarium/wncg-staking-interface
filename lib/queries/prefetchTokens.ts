import { fetchToken } from '@wagmi/core'

import { CHAINS } from 'config/chains'
import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { TOKENS } from 'config/constants/tokens'

export async function prefetchTokens(chainId: ChainId, tokenList: Hash[]) {
  const defaultTokens = Object.keys(TOKENS[chainId])
  const missingTokens = tokenList.filter(
    (addr) => !defaultTokens.includes(addr)
  )

  if (!missingTokens.length) return TOKENS[chainId]

  const promises = missingTokens.map((addr) =>
    fetchToken({
      address: addr,
      chainId,
    })
  )

  try {
    const responses = await Promise.all(promises)

    const _missingTokenMap = new Map<Hash, TokenInfo>()

    responses.forEach((res, i) => {
      const { decimals, name, symbol } = res
      const address = missingTokens[i].toLowerCase() as Hash

      _missingTokenMap.set(address, {
        address,
        decimals,
        name,
        symbol,
      })
    })

    const missingTokenMap = Object.fromEntries(_missingTokenMap) satisfies {
      [address: Hash]: TokenInfo
    }

    const { nativeCurrency } = CHAINS[chainId]
    const { coingeckoId, wrappedTokenAddress, ...rest } = nativeCurrency

    return {
      ...TOKENS[chainId],
      ...missingTokenMap,
      [NATIVE_CURRENCY_ADDRESS]: rest,
    }
  } catch (error) {
    throw error
  }
}
