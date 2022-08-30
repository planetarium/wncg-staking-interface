import axios from 'axios'
import { configService } from './config'

export class CoingeckoClientService {
  constructor(public readonly config = configService) {}

  async get<T>(endpoint: string): Promise<T> {
    const { data } = await this.axios.get<T>(endpoint)
    return data
  }

  get axios() {
    return axios.create({ baseURL: this.config.coingecko.baseUrl })
  }
}

export const coingeckoClient = new CoingeckoClientService()
