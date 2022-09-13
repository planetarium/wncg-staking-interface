import type { Web3Provider } from '@ethersproject/providers'
import type { Transaction } from 'ethers'
import { isToday } from 'date-fns'
import store from 'store'

import STORAGE_KEYS from 'constants/storageKeys'

export class TransactionSubscriptionService {
  constructor(public readonly provider: Web3Provider) {}

  subscribe = (transaction: Transaction, toast: ToastContent) => {
    if (!transaction.hash) return

    const tx: Tx = {
      addedTime: Date.now(),
      data: transaction.data,
      hash: transaction.hash,
      status: 'pending',
      toast,
      transaction,
    }

    this.setTx(tx)
    return tx
  }

  resolve = (transaction: Transaction) => {
    if (!transaction.hash) return
    const tx = this.findTx(transaction.hash)
    if (!tx || !!tx?.finalizedTime) return

    const newTx: Tx = { ...tx }
    newTx.status = 'fulfilled'
    newTx.finalizedTime = Date.now()

    this.setTx(newTx)
    return newTx
  }

  reject = (hash: string, error: any) => {
    const tx = this.findTx(hash)
    if (!tx || !!tx?.finalizedTime) return

    const newTx: Tx = { ...tx, error }
    newTx.status = 'error'
    newTx.finalizedTime = Date.now()

    this.setTx(newTx)
    return newTx
  }

  flushOutdatedTx() {
    Object.entries(this.txMap).forEach(([hash, tx]) => {
      if (!!tx.finalizedTime && !isToday(tx.finalizedTime)) {
        this.removeTx(hash)
      }
    })
  }

  setTx(tx: Tx) {
    const hashKey = this.encodeKey(tx.hash)
    const newTxMap = { ...this.txMap, [hashKey]: tx }
    store.set(STORAGE_KEYS.Transactions, newTxMap)
    return newTxMap
  }

  removeTx(hash: string) {
    const hashKey = this.encodeKey(hash)
    const newTxMap = { ...this.txMap }
    delete newTxMap[hashKey]
    store.set(STORAGE_KEYS.Transactions, newTxMap)
    return newTxMap
  }

  getTxReceipt = async (hash: string) => {
    const tx = await this.provider?.getTransaction(hash)
    return await tx?.wait()
  }

  findTx(hash: string) {
    const hashKey = this.encodeKey(hash)
    return this.txMap[hashKey]
  }

  encodeKey(hash: string) {
    return `tx_${hash}`
  }

  get txMap(): TxMap {
    return store.get(STORAGE_KEYS.Transactions) || {}
  }
}
