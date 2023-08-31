import axios from 'lib/axios'
import ethereumStaking from 'config/placeholders/1.json'
import bscStaking from 'config/placeholders/56.json'
import { ChainId } from 'config/chains'

export async function fetchStaking(chainId: ChainId) {
  try {
    const { data } = await axios.get(`/api/staking?chainId=${chainId}`)
    // console.log('💖 CONTRACT')
    return data
  } catch (error) {
    if (chainId === ChainId.ETHEREUM) return ethereumStaking
    if (chainId === ChainId.BSC) return bscStaking

    throw error
  }
}
