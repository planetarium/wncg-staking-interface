import axios from 'axios'

export const coingecko = axios.create({
  baseURL: process.env.NEXT_PUBLIC_COINGECKO_API_BASE_URL as string,
})
