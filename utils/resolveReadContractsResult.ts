import type { ReadContractsResult } from '@wagmi/core'
import type { ContractFunctionConfig } from 'viem'

export function resolveReadContractsResult(
  data: ReadContractsResult<ContractFunctionConfig[], true>
) {
  return data.map((v) => (v.status === 'success' ? v.result : null))
}
