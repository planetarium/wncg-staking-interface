import { formatUnits } from 'ethers/lib/utils'
import type { Log } from '@ethersproject/abstract-provider'

import { configService } from 'services/config'
import { parseLog } from 'utils/iface'
import { decodeLogData, parseTransferLogs } from 'utils/tx'

export function parseExitLogs(logs: Log[]) {
  const parsedLogs = logs.map((log) => parseLog(log))
  const withdrawalLogIndex = parsedLogs.findIndex(
    (log) => log?.name === 'Withdrawal'
  )

  if (withdrawalLogIndex < 0) {
    return parseTransferLogs(logs)
  }

  const withdrawalLog = logs[withdrawalLogIndex]
  const decodedData = decodeLogData(withdrawalLog.data)
  const amount = formatUnits(decodedData?.[0] ?? '0')

  return {
    [configService.nativeAssetAddress]: amount,
  }
}
