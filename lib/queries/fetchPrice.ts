import axios from 'lib/axios'

export async function fetchPrice(chainId: ChainId) {
  try {
    const { data } = await axios.get(`/api/price?chainId=${chainId}`)
    return data
  } catch (error) {
    throw error
  }
}
