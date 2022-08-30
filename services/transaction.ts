import type { Event } from 'ethers'
import type {
  TransactionReceipt,
  TransactionResponse,
  Web3Provider,
} from '@ethersproject/providers'
import { isToday } from 'date-fns'
import store from 'store'

import { STORE_TRANSACTION_MAP_KEY } from 'constants/storeKeys'
import { createLogger } from 'utils/log'
import { renderTxMessage, renderTxTitle } from 'utils/transaction'
import { getTokenSymbol } from 'utils/token'

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
  onRevert?(): void
}

const logger = createLogger('black')

export class TransactionService {
  constructor(
    public readonly provider: Web3Provider,
    public readonly sendNotification: (
      params: TransactionNotificationParams
    ) => string
  ) {}

  registerTx(
    response: TransactionResponse,
    action: TransactionAction,
    hashId?: string
  ) {
    console.log(22222, 'registerTx', action, response)
    const hashKey = this.key(response.hash, hashId)
    const newTx: Transaction = {
      action,
      hash: response.hash,
      status: 'pending',
      addedTime: Date.now(),
    }

    this.sendNotification({
      action,
      hash: response.hash,
      title: renderTxTitle(action),
      message: renderTxMessage(action, 'info', {
        symbol: getTokenSymbol(response.to),
        value: response.value.toString(),
      }),
    })

    store.set(STORE_TRANSACTION_MAP_KEY, {
      ...this.txMap,
      [hashKey]: newTx,
    })
  }

  async updateTxStatus(
    event: Event,
    option: UpdateTxOption = {},
    hashId?: string
  ): Promise<Transaction | undefined> {
    const hash = event.transactionHash
    const key = `tx receipt: ${hash}`

    console.log(111111, 'updateTxStatus', event)

    const hashKey = this.key(hash, hashId)
    const target = this.txMap[hashKey]

    //   NOTE: register가 안된 녀석
    if (!target || !target?.status) return

    //   NOTE: finalize 완료된 녀석
    if (!!target.finalizedTime) return

    try {
      logger(key)
      const receipt = await this.getTxReceipt(hash)
      if (!receipt) return

      const newTarget: Transaction = { ...target }

      //   NOTE: Fulfilled
      if (!!receipt.status) {
        newTarget.status = 'fulfilled'
        newTarget.finalizedTime = Date.now()

        this.sendNotification({
          action: target.action,
          hash: target.hash,
          title: renderTxTitle(target.action),
          message: renderTxMessage(target.action, 'success', {
            symbol: getTokenSymbol(event.address),
          }),
          type: 'success',
        })

        option.onFulfill?.()
      } else {
        // NOTE: Reverted
        newTarget.status = 'reverted'
        newTarget.finalizedTime = Date.now()

        this.sendNotification({
          action: target.action,
          hash: target.hash,
          title: renderTxTitle(target.action),
          message: renderTxMessage(target.action, 'error', {
            symbol: getTokenSymbol(event.address),
          }),
          type: 'error',
        })

        option.onRevert?.()
      }

      store.set(STORE_TRANSACTION_MAP_KEY, {
        ...this.txMap,
        [hashKey]: newTarget,
      })
    } catch (error) {
      logger(key, error)
      throw error
    }
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

  getTxStatus(hash: string): TransactionStatus | null {
    return this.txMap[this.key(hash)]?.status || null
  }

  get txMap(): TransactionMap {
    return store.get(STORE_TRANSACTION_MAP_KEY) || {}
  }

  get pendingTxList(): Transaction[] {
    return Object.values(this.txMap).filter((tx) => tx.status === 'pending')
  }

  private key(hash: string, hashId?: string) {
    return hashId ? `tx_${hash}_${hashId}` : `tx_${hash}`
  }
}
