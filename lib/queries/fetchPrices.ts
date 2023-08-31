import axios from 'lib/axios'

export async function fetchPrices(chainId: ChainId) {
  try {
    const { data } = await axios.get(`/api/price?chainId=${chainId}`)
    // console.log('💛 PRICES')
    return data
  } catch (error) {
    throw error
  }
}
