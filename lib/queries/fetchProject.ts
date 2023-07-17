import axios from 'lib/axios'

export async function fetchProject(chainId: ChainId) {
  try {
    const { data } = await axios.get(`/api/staking?chainId=${chainId}`)
    return data
  } catch (error) {
    throw error
  }
}
