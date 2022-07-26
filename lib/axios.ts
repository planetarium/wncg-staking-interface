import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_COINGECKO_API_BASE_URL as string,
})

export default instance
