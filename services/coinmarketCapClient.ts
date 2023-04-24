import axios from 'axios'

export class CoinmarketCapClientService {
  async get<T>(endpoint: string): Promise<T> {
    const { data } = await this.axios.get<T>(endpoint)
    return data
  }

  get axios() {
    return axios.create({
      baseURL: 'https://pro-api.coinmarketcap.com',
      headers: {
        'X-CMC_PRO_API_KEY': process.env
          .NEXT_PUBLIC_COINMARKETCAP_API_KEY as string,
        Accept: 'application/json',
        'Accept-Encoding': 'deflate, gzip',
      },
    })
  }
}

export const coinmarketCapClient = new CoinmarketCapClientService()
