import { defaultAbiCoder } from 'ethers/lib/utils'

export function decodeTransactionData(data: string, types = ['uint256']) {
  try {
    return defaultAbiCoder.decode(types, data)
  } catch {
    return null
  }
}
