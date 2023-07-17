export const apiKeys = {
  coingecko: process.env.NEXT_PUBLIC_COINGECKO_API_KEY ?? '',
  infura: process.env.NEXT_PUBLIC_INFURA_API_KEY ?? '',
  nodeReal: process.env.NEXT_PUBLIC_NODE_REAL_API_KEY ?? '',
}

export const baseUrls = {
  coingecko: 'https://api.coingecko.com/api/v3',
  coingeckoPro: 'https://pro-api.coingecko.com/api/v3',
  imgix: process.env.NEXT_PUBLIC_IMGIX_HOSTNAME,
  server: process.env.NEXT_PUBLIC_API_SERVER_BASE_URL,
}
