import axios from 'axios'

export class CoingeckoClientService {
  baseUrl: string

  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3'
  }

  async get<T>(endpoint: string): Promise<T> {
    const { data } = await this.axios.get<T>(endpoint)
    return data
  }

  get axios() {
    return axios.create({ baseURL: this.baseUrl })
  }
}

export const coingeckoClient = new CoingeckoClientService()
