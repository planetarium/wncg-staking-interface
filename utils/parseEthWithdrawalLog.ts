import type { Log } from '@ethersproject/abstract-provider'
import { decodeLogData } from './decodeLogData'

import { parseLog } from './parseLog'

export function parseEthWithdrawalLog(logs: Log[]) {
  const withdrawalLog = logs.find((log) => {
    return parseLog(log)?.name === 'Withdrawal'
  })

  if (!withdrawalLog) return null

  return decodeLogData(withdrawalLog.data, ['uint256'])?.[0] ?? null
}
