import axios from 'lib/axios'

export async function fetchStaking(chainId: ChainId) {
  try {
    const { data } = await axios.get(`/api/staking?chainId=${chainId}`)
    console.log('💖 CONTRACT')
    return data
  } catch (error) {
    throw error
  }
}
