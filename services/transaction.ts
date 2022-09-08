import type { SetterOrUpdater } from 'recoil'
import type { Event } from 'ethers'
import type {
  TransactionReceipt,
  TransactionResponse,
  Web3Provider,
} from '@ethersproject/providers'
import { isToday } from 'date-fns'
import store from 'store'

import STORAGE_KEYS from 'constants/storageKeys'
import {
  txInfoMessage,
  txSuccessMessage,
  txToastTitle,
} from 'utils/transaction'

export const TxAction = {
  Approve: 'Approve',
  ClaimAll: 'ClaimAll',
  ClaimBal: 'ClaimBal',
  ClaimWncg: 'ClaimWncg',
  EarmarkRewards: 'EarmarkRewards',
  ExitPool: 'ExitPool',
  JoinPool: 'JoinPool',
  Stake: 'Stake',
  Cooldown: 'Cooldown',
  Withdraw: 'Withdraw',
  WithdrawAndClaim: 'WithdrawAndClaim',
} as const

export type TxAction = typeof TxAction[keyof typeof TxAction]

export type TxStatus = 'pending' | 'fulfilled' | 'error' | 'canceled'

export type TxToastParams = {
  action: TxAction
  hash: string
  title: string
  message: string
  data?: any
  type?: ToastType
}

export type TxMap = {
  [id: string]: Transaction
}

type TxHandlerCallbacks = {
  onTxEvent?(): void
  onTxConfirmed?(): void
}

export class TransactionService {
  constructor(
    public readonly provider: Web3Provider,
    public readonly setTxMap: SetterOrUpdater<TxMap>,
    public readonly addTxToast: (params: TxToastParams) => void
  ) {}

  registerTx = async (
    response: TransactionResponse,
    action: TxAction,
    params?: string | string[]
  ) => {
    const hashKey = this.encodeKey(response.hash, action)

    const newTx: Transaction = {
      action,
      hash: response.hash,
      status: 'pending',
      addedTime: Date.now(),
      params,
    }

    this.addTxToast({
      action,
      hash: response.hash,
      title: txToastTitle(action),
      message: txInfoMessage(action, params),
    })

    this.updateTx(hashKey, newTx)
  }

  handleTx = async (
    event: Event,
    action: TxAction,
    callbacks: TxHandlerCallbacks = {}
  ) => {
    const hashKey = this.encodeKey(event.transactionHash, action)
    const target = this.txMap[hashKey]

    callbacks.onTxEvent?.()

    if (!target || target.status !== 'pending') return
    if (!!target.finalizedTime) return

    const newTarget: Transaction = { ...target }

    newTarget.status = 'fulfilled'
    newTarget.finalizedTime = Date.now()

    this.addTxToast({
      action: target.action,
      hash: target.hash,
      title: txToastTitle(target.action, 'success'),
      message: txSuccessMessage(target.action, target.params),
      type: 'success',
    })

    callbacks.onTxConfirmed?.()

    this.updateTx(hashKey, newTarget)
  }

  flushOutdatedTx() {
    Object.entries(this.txMap).forEach(([hash, tx]) => {
      if (!!tx.finalizedTime && !isToday(tx.finalizedTime)) {
        this.removeTx(hash)
      }
    })
  }

  updateTx(hashKey: string, tx: Transaction) {
    const newTxMap = { ...this.txMap, [hashKey]: tx }
    store.set(STORAGE_KEYS.Transactions, newTxMap)
    this.setTxMap(newTxMap)
  }

  removeTx(hashKey: string) {
    const newTxMap = { ...this.txMap }
    delete newTxMap[hashKey]
    store.set(STORAGE_KEYS.Transactions, newTxMap)
    this.setTxMap(newTxMap)
  }

  resetTxMap() {
    store.remove(STORAGE_KEYS.Transactions)
  }

  async getTxReceipt(hash: string): Promise<TransactionReceipt> {
    const txInfo = await this.provider?.getTransaction(hash)
    return await txInfo?.wait()
  }

  get txMap(): TxMap {
    return store.get(STORAGE_KEYS.Transactions) || {}
  }

  encodeKey(hash: string, action: TxAction) {
    return `tx_${hash}_${action}`
  }

  decodeKey(hashKey?: string) {
    if (!hashKey) return hashKey
    return hashKey.split('_')[1] || hashKey
  }
}
