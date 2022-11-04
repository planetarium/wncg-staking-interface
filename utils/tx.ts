import { defaultAbiCoder, formatUnits } from 'ethers/lib/utils'
import type { Log } from '@ethersproject/abstract-provider'

import { configService } from 'services/config'
import { parseLog } from './iface'
import { getTokenInfo } from './token'

export function parseTxError(error: any): TxError | void {
  if (error?.code === 4001) {
    return
  }

  switch (true) {
    case error?.message?.includes('BAL#507'):
    case error?.message?.includes('BAL#207'):
      return {
        title: 'Transaction failed due to slippage',
        message:
          'The market price changed beyond your slippage tolerance due to other trades processed before yours. Try again or increase your slippage tolerance.',
      }

    case error?.code === 'INSUFFICIENT_FUNDS':
    case error?.message?.includes('INSUFFICIENT_BALANCE'):
      return {
        title: 'Insufficient balance',
        message:
          "The account doesn't have enough balance to perform this transaction.",
      }

    case error?.code === 4100:
      return {
        title: 'Authentication required',
        message:
          'The requested account method has not been authorized by the user.',
      }
    case error?.code === 'UNPREDICTABLE_GAS_LIMIT':
      return {
        title: 'Cannot estimate gas',
        message: 'Transaction may fail or require manual gas limit.',
      }

    case error?.message?.includes('-32010'):
      return {
        title: 'Gas too low',
        message:
          'Transaction gas is too low. There is not enough gas to cover minimal cost of the transaction. Try increasing supplied gas.',
      }

    default:
      return {
        title: 'Something went wrong',
        message: 'Sorry for the inconvenience. Please try again later.',
      }
  }
}

export function parseTransferLogs(logs: Log[]) {
  const transferLogs = logs.filter((log) => parseLog(log)?.name === 'Transfer')

  const tokenAddresses = transferLogs.map((log) => log.address.toLowerCase())

  const transferedAmounts = transferLogs.map((log, i) =>
    formatUnits(
      decodeLogData(log.data)?.[0] ?? '0',
      getTokenInfo(tokenAddresses[i])?.decimals ?? 18
    )
  )

  return Object.fromEntries(
    tokenAddresses.map((address, i) => [address, transferedAmounts[i]])
  )
}

export function parsePoolBalanceChangedLogs(logs: Log[]) {
  const parsedLogs = logs.map((log) => parseLog(log))

  const poolBalanceChangedLogIndex = parsedLogs.findIndex((log) =>
    ['Deposit', 'Withdrawal'].includes(log?.name ?? '')
  )

  if (poolBalanceChangedLogIndex < 0) {
    return parseTransferLogs(logs)
  }

  const poolBalanceChangedLog = logs[poolBalanceChangedLogIndex]
  const decodedData = decodeLogData(poolBalanceChangedLog.data)
  const amount = formatUnits(decodedData?.[0] ?? '0')

  return {
    [configService.nativeAssetAddress]: amount,
  }
}

export function decodeLogData(data: string, types = ['uint256']) {
  try {
    return defaultAbiCoder.decode(types, data)
  } catch {
    return null
  }
}
