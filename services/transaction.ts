import type { SetterOrUpdater } from 'recoil'
import type { Web3Provider } from '@ethersproject/providers'
import { isToday } from 'date-fns'
import store from 'store'

import STORAGE_KEYS from 'constants/storageKeys'

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

export class TransactionService {
  constructor(
    public readonly provider: Web3Provider,
    public readonly setTxMap: SetterOrUpdater<TxMap>
  ) {}

  registerTx = (
    hash: string,
    action: TxAction,
    params?: string | string[]
  ): Transaction => {
    const hashKey = this.encodeKey(hash, action)

    const tx: Transaction = {
      action,
      hash,
      status: 'pending',
      addedTime: Date.now(),
      params,
    }

    this.updateTx(hashKey, tx)
    return tx
  }

  fulfillTx = (hash: string, action: TxAction) => {
    const hashKey = this.encodeKey(hash, action)
    const tx = this.findTx(hashKey)
    if (!tx || !!tx?.finalizedTime) return

    const newTx: Transaction = { ...tx }
    newTx.status = 'fulfilled'
    newTx.finalizedTime = Date.now()

    this.updateTx(hashKey, newTx)
    return newTx
  }

  rejectTx = (hash: string, error: any) => {
    const hashKey = this.findHashKey(hash)
    if (!hashKey) return

    const tx = this.findTx(hashKey)
    if (!tx || !!tx?.finalizedTime) return

    const newTx: Transaction = { ...tx, error }
    newTx.status = 'error'
    newTx.finalizedTime = Date.now()

    this.updateTx(hashKey, newTx)
    return newTx
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

  getTxReceipt = async (hash: string) => {
    const tx = await this.provider?.getTransaction(hash)
    return await tx?.wait()
  }

  private findTx(hashKey: string) {
    return this.txMap[hashKey]
  }

  findHashKey = (hash: string): string | void => {
    return this.findTxEntry(hash)?.[0]
  }

  private findTxEntry = (hash: string) => {
    return Object.entries(this.txMap).find(([, tx]) => tx.hash === hash)
  }

  private encodeKey(hash: string, action: TxAction) {
    return `tx_${hash}_${action}`
  }

  get txMap(): TxMap {
    return store.get(STORAGE_KEYS.Transactions) || {}
  }
}
