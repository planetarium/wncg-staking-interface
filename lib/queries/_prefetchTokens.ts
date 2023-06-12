import { readContracts } from 'wagmi'

import config from 'config'
import { Erc20Abi } from 'config/abi'
import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'

const FNS = ['decimals', 'name', 'symbol']

type UnserializedTokenInfo = [number, string, string]

export async function prefetchTokens(tokensList: Hash[], chainId: ChainId) {
  try {
    const contractsList = tokensList.map((addr) =>
      FNS.map((fn) => ({
        address: addr,
        abi: Erc20Abi as unknown as Abi[],
        chainId,
        functionName: fn,
      }))
    )

    const promises = contractsList.map(
      (contracts) =>
        readContracts({
          contracts,
          allowFailure: true,
        }) as Promise<UnserializedTokenInfo>
    )

    const responses = await Promise.all(promises)

    const tokensMap = new Map<Hash, TokenInfo>()

    responses.forEach((res, i) => {
      const [decimals, name, symbol] = res
      const address = tokensList[i].toLowerCase() as Hash

      tokensMap.set(address, {
        address,
        decimals,
        name,
        symbol,
      })
    })

    const tokens = Object.fromEntries(tokensMap) as {
      [address: Hash]: TokenInfo
    }

    tokens[NATIVE_CURRENCY_ADDRESS] = {
      address: NATIVE_CURRENCY_ADDRESS,
      decimals: config.nativeCurrency.decimals,
      name: config.nativeCurrency.name,
      symbol: config.nativeCurrency.symbol,
    }

    return tokens
  } catch (error) {
    throw error
  }
}
