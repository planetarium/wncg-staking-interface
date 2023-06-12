import type { Log } from '@ethersproject/abstract-provider'
import { decodeLogData } from './decodeLogData'

import { parseLog } from './parseLog'

export function parseTransferLogs(logs: Log[]) {
  const transferLogs = logs.filter((log) => {
    return parseLog(log)?.name === 'Transfer'
  })

  const tokenAddresses = transferLogs.map((log) => log.address?.toLowerCase())

  const transferedAmounts = transferLogs.map(
    (log) => decodeLogData(log.data, ['uint256'])?.[0] ?? null
  )

  return Object.fromEntries(
    tokenAddresses.map((address, i) => [address, transferedAmounts[i]])
  )
}
