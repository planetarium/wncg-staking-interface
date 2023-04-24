import { defaultAbiCoder } from '@ethersproject/abi'

export function decodeLogData(
  data: string,
  types = ['uint256', 'uint256', 'uint256']
) {
  try {
    return defaultAbiCoder.decode(types, data)
  } catch {
    return null
  }
}
