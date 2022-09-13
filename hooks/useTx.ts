import { useCallback, useMemo } from 'react'
import { useResetRecoilState, useSetRecoilState } from 'recoil'
import type { Transaction } from 'ethers'
import store from 'store'

import { txListState } from 'app/states/transaction'
import STORAGE_KEYS from 'constants/storageKeys'
import { MessageService } from 'services/message'
import { TransactionSubscriptionService } from 'services/transactionSubscription'
import { parseTxError } from 'utils/error'
import { useProvider } from './useProvider'
import { useToast } from './useToast'

export function useTx() {
  const provider = useProvider()
  const { addToast } = useToast()

  const setTxList = useSetRecoilState(txListState)
  const resetTxList = useResetRecoilState(txListState)

  const txService = useMemo(() => {
    if (!provider) return null
    return new TransactionSubscriptionService(provider)
  }, [provider])

  const messageService = useMemo(() => {
    if (!provider) return null
    return new MessageService(provider)
  }, [provider])

  const subscribeTx = useCallback(
    (transaction: Transaction) => {
      if (!txService || !messageService) return
      const title = messageService.toastTitles(transaction)
      const messages = messageService.toastMessages(transaction)
      const toast = {
        title,
        messages,
      }
      const tx = txService.subscribe(transaction, toast)
      if (!tx) return

      setTxList((prev) => [...prev, { ...tx, toast }])
      addToast({
        title,
        message: messages.info,
        type: 'info',
      })
    },
    [addToast, messageService, setTxList, txService]
  )

  const resolveTx = useCallback(
    (transaction: Transaction, callback?: () => void) => {
      if (!txService) return
      const tx = txService.resolve(transaction)
      if (!tx) return

      setTxList((prev) => {
        const index = prev.findIndex((item) => item.hash === tx.hash)
        const newTxList = [...prev]
        if (index > -1) {
          newTxList.splice(index, 1)
        }
        return newTxList
      })
      addToast({
        title: tx.toast.title,
        message: tx.toast.messages.success,
        type: 'success',
      })

      callback?.()
    },
    [addToast, setTxList, txService]
  )

  const pingPendingTx = useCallback(
    async (transaction: Transaction) => {
      if (!txService || !transaction.hash) return

      try {
        await txService.getTxReceipt(transaction.hash)
        resolveTx(transaction)
      } catch (error: any) {
        const tx = txService.reject(transaction.hash, error)
        if (!tx) return

        addToast({
          title: tx.toast.title,
          message: parseTxError(error)?.message || tx.toast.messages.error,
          type: 'error',
        })
      }
    },
    [addToast, resolveTx, txService]
  )

  const resetTx = useCallback(() => {
    store.remove(STORAGE_KEYS.Transactions)
    resetTxList()
  }, [resetTxList])

  return {
    resolveTx,
    subscribeTx,
    resetTx,
    pingPendingTx,
    txService,
  }
}
