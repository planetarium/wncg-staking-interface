import axios from 'axios'

export async function fetchAprs(chainId: ChainId, totalStaked: string) {
  try {
    const { data } = await axios.get<{ aprs: string[] }>(
      `/api/calcApr?chainId=${chainId}&totalStaked=${totalStaked}`
    )

    return data.aprs
  } catch (error) {
    throw error
  }
}
