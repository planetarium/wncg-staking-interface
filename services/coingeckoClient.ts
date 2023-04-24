import axios from 'axios'

import config from 'config'
import { apiKeys, baseUrls } from 'config/api'

export class CoingeckoClientService {
  constructor() {}

  async get<T>(endpoint: string): Promise<T> {
    const { data } = await this.axios.get<T>(endpoint)
    return data
  }

  get axios() {
    return axios.create({
      baseURL:
        config.env === 'production'
          ? baseUrls.coingeckoPro
          : baseUrls.coingecko,
      headers:
        config.env === 'production'
          ? {
              'x-cg-pro-api-key': apiKeys.coingecko,
            }
          : undefined,
    })
  }
}

export const coingeckoClient = new CoingeckoClientService()
