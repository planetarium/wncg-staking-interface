export const apiKeys = {
  infura: process.env.NEXT_PUBLIC_INFURA_API_KEY ?? '',
  nodeReal: process.env.NEXT_PUBLIC_NODE_REAL_API_KEY ?? '',
  thegraph: process.env.NEXT_PUBLIC_THEGRAPH_API_KEY ?? '',
}

export const baseUrls = {
  imgix: process.env.NEXT_PUBLIC_IMGIX_HOSTNAME,
  server: process.env.NEXT_PUBLIC_API_SERVER_BASE_URL,
}
