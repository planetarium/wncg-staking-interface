import type { Event } from 'ethers'
import type {
  TransactionReceipt,
  TransactionResponse,
  Web3Provider,
} from '@ethersproject/providers'
import { isToday } from 'date-fns'
import store from 'store'

import { STORE_TRANSACTION_MAP_KEY } from 'constants/storeKeys'
import {
  renderTxInfoMessage,
  renderTxSuccessMessage,
  renderTxTitle,
} from 'utils/transaction'

export const TransactionAction = {
  Approve: 'Approve',
  ClaimAllRewards: 'ClaimAllRewards',
  ClaimBalRewards: 'ClaimBalRewards',
  ClaimWncgRewards: 'ClaimWncgRewards',
  EarmarkRewards: 'EarmarkRewards',
  ExitPool: 'ExitPool',
  JoinPool: 'JoinPool',
  Stake: 'Stake',
  StartCooldown: 'StartCooldown',
  Withdraw: 'Withdraw',
  WithdrawAndClaim: 'WithdrawAndClaim',
} as const

export type TransactionAction =
  typeof TransactionAction[keyof typeof TransactionAction]

export type TransactionStatus = 'pending' | 'fulfilled' | 'reverted'

export type Transaction = {
  action: TransactionAction
  hash: string
  status: TransactionStatus
  addedTime: number
  finalizedTime?: number
  params?: string | string[]
}

export type TransactionNotificationParams = {
  action: TransactionAction
  hash: string
  title: string
  message: string
  type?: ToastType
}

type TransactionMap = {
  [id: string]: Transaction
}

type UpdateTxOption = {
  onFulfill?(): void
}

export class TransactionService {
  constructor(
    public readonly provider: Web3Provider,
    public readonly sendNotification: (
      params: TransactionNotificationParams
    ) => string
  ) {}

  registerTx = async (
    response: TransactionResponse,
    action: TransactionAction,
    params?: string | string[]
  ) => {
    const hashKey = this.key(response.hash, action)
    console.log('>>>> registerTx', hashKey, response)
    const newTx: Transaction = {
      action,
      hash: response.hash,
      status: 'pending',
      addedTime: Date.now(),
      params,
    }

    this.sendNotification({
      action,
      hash: response.hash,
      title: renderTxTitle(action),
      message: renderTxInfoMessage(action, params),
    })

    store.set(STORE_TRANSACTION_MAP_KEY, {
      ...this.txMap,
      [hashKey]: newTx,
    })
  }

  updateTxStatus = async (
    event: Event,
    action: TransactionAction,
    option: UpdateTxOption = {}
  ) => {
    const hashKey = this.key(event.transactionHash, action)

    const target = this.txMap[hashKey]
    console.log('>>>> updateTxStatus', hashKey, target?.status)

    if (!target || target.status !== 'pending') return
    if (!!target.finalizedTime) return

    const newTarget: Transaction = { ...target }

    newTarget.status = 'fulfilled'
    newTarget.finalizedTime = Date.now()

    this.sendNotification({
      action: target.action,
      hash: target.hash,
      title: renderTxTitle(target.action),
      message: renderTxSuccessMessage(target.action, target.params),
      type: 'success',
    })

    option.onFulfill?.()

    store.set(STORE_TRANSACTION_MAP_KEY, {
      ...this.txMap,
      [hashKey]: newTarget,
    })
  }

  resetTx() {
    store.remove(STORE_TRANSACTION_MAP_KEY)
  }

  flushOutdatedTx() {
    const newTxMap: TransactionMap = {}
    Object.entries(this.txMap).forEach(([hash, tx]) => {
      console.log(isToday(tx.finalizedTime || 0))
      if (!!tx.finalizedTime && !isToday(tx.finalizedTime)) {
        return
      }
      newTxMap[hash] = tx
    })

    store.set(STORE_TRANSACTION_MAP_KEY, newTxMap)
  }

  async getTxReceipt(hash: string): Promise<TransactionReceipt> {
    const txInfo = await this.provider?.getTransaction(hash)
    return await txInfo?.wait()
  }

  get txMap(): TransactionMap {
    return store.get(STORE_TRANSACTION_MAP_KEY) || {}
  }

  get pendingTxList(): Transaction[] {
    return Object.values(this.txMap).filter((tx) => tx.status === 'pending')
  }

  private key(hash: string, action: TransactionAction) {
    return `tx_${hash}_${action}`
  }
}
