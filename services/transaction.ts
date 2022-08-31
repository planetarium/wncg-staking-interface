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
  txInfoMessage,
  txSuccessMessage,
  txToastTitle,
} from 'utils/transaction'

export const TxAction = {
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

export type TxAction = typeof TxAction[keyof typeof TxAction]

export type TxStatus = 'pending' | 'fulfilled' | 'reverted'

export type Transaction = {
  action: TxAction
  hash: string
  status: TxStatus
  addedTime: number
  finalizedTime?: number
  params?: string | string[]
}

export type TxToastParams = {
  action: TxAction
  hash: string
  title: string
  message: string
  type?: ToastType
}

type TxMap = {
  [id: string]: Transaction
}

type TxHandlerCallbacks = {
  onTxEvent?(): void
  onTxConfirmed?(): void
}

export class TransactionService {
  constructor(
    public readonly provider: Web3Provider,
    public readonly showToast: (params: TxToastParams) => void
  ) {}

  registerTx = async (
    response: TransactionResponse,
    action: TxAction,
    params?: string | string[]
  ) => {
    const hashKey = this.key(response.hash, action)

    const newTx: Transaction = {
      action,
      hash: response.hash,
      status: 'pending',
      addedTime: Date.now(),
      params,
    }

    this.showToast({
      action,
      hash: response.hash,
      title: txToastTitle(action),
      message: txInfoMessage(action, params),
    })

    store.set(STORE_TRANSACTION_MAP_KEY, {
      ...this.txMap,
      [hashKey]: newTx,
    })
  }

  handleTx = async (
    event: Event,
    action: TxAction,
    callbacks: TxHandlerCallbacks = {}
  ) => {
    const hashKey = this.key(event.transactionHash, action)
    const target = this.txMap[hashKey]

    callbacks.onTxEvent?.()

    if (!target || target.status !== 'pending') return
    if (!!target.finalizedTime) return

    const newTarget: Transaction = { ...target }

    newTarget.status = 'fulfilled'
    newTarget.finalizedTime = Date.now()

    this.showToast({
      action: target.action,
      hash: target.hash,
      title: txToastTitle(target.action),
      message: txSuccessMessage(target.action, target.params),
      type: 'success',
    })

    callbacks.onTxConfirmed?.()

    store.set(STORE_TRANSACTION_MAP_KEY, {
      ...this.txMap,
      [hashKey]: newTarget,
    })
  }

  resetTx() {
    store.remove(STORE_TRANSACTION_MAP_KEY)
  }

  flushOutdatedTx() {
    const newTxMap: TxMap = {}
    Object.entries(this.txMap).forEach(([hash, tx]) => {
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

  get txMap(): TxMap {
    return store.get(STORE_TRANSACTION_MAP_KEY) || {}
  }

  get pendingTxList(): Transaction[] {
    return Object.values(this.txMap).filter((tx) => tx.status === 'pending')
  }

  private key(hash: string, action: TxAction) {
    return `tx_${hash}_${action}`
  }
}
