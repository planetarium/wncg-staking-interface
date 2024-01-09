import axios from 'lib/axios'
import ethereumStaking from 'config/placeholders/1.json'
import bscStaking from 'config/placeholders/56.json'
import { ChainId } from 'config/chains'

export async function fetchPrices(chainId: ChainId) {
  try {
    const { data } = await axios.get(`/api/price?chainId=${chainId}`)
    console.log('💛 PRICES')
    return data
  } catch (error) {
    if (chainId === ChainId.ETHEREUM) return ethereumStaking.prices
    if (chainId === ChainId.BSC) return bscStaking.prices

    throw error
  }
}
