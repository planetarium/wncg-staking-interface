import type { AxiosResponse } from 'axios'

import axios from 'lib/axios'
import { IS_ETHEREUM } from 'utils/env'

type PriceMap = Record<string, number>

export class CoingeckoService {
  fiatCurrency: string

  constructor() {
    this.fiatCurrency = 'usd'
  }

  getTokenId(key: string) {
    switch (key) {
      case 'bal':
        return 'balancer'
      case 'weth':
        return 'weth'
      case 'wncg':
        return IS_ETHEREUM ? 'wrapped-ncg' : 'wrapped-bitcoin'
      default:
        return key.toLowerCase()
    }
  }

  getSymbolName(key: string) {
    switch (key) {
      case 'balancer':
        return 'bal'
      case 'wrapped-ncg':
      case 'wrapped-bitcoin': // NOTE: Kovan network
        return 'wncg'
      default:
        return key.toLowerCase()
    }
  }

  async fetchTokens(symbols: string[]) {
    const responses: Promise<AxiosResponse<TokenPrice>>[] = []

    symbols.forEach((symb) => {
      const tokenId = this.getTokenId(symb)
      const res = axios.get<TokenPrice>(
        `/simple/price?ids=${tokenId}&vs_currencies=${this.fiatCurrency}`
      )
      responses.push(res)
    })

    return await Promise.all(responses)
  }

  async getTokens(symbols: string[]) {
    try {
      const results = await this.fetchTokens(symbols)
      const priceMap = results.reduce((acc, result) => {
        Object.entries(result.data).forEach(([key, value]) => {
          const symb = this.getSymbolName(key)
          acc[symb] = value.usd
        })
        return acc
      }, {} as PriceMap)
      return priceMap
    } catch (error) {
      console.log('Unable to fetch token prices', symbols, error)
      const priceMap = symbols.reduce((acc, symb) => {
        acc[symb] = 0
        return acc
      }, {} as PriceMap)
      return priceMap
    }
  }
}

export const tokenIds = ['weth', 'balancer', 'wrapped-ncg', 'wrapped-bitcoin']
export const tokenSymbols = ['weth', 'bal', 'wncg']

export const coingecko = new CoingeckoService()
