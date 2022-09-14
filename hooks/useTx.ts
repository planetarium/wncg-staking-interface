import { useCallback, useMemo } from 'react'
import { useResetRecoilState, useSetRecoilState } from 'recoil'
import type { Transaction } from 'ethers'
import store from 'store'

import { txListState } from 'app/states/transaction'
import STORAGE_KEYS from 'constants/storageKeys'
import { MessageService } from 'services/message'
import { TransactionSubscriptionService } from 'services/transactionSubscription'
import { useProvider } from './useProvider'
import { useRefetch } from './useRefetch'
import { useToast } from './useToast'

export function useTx() {
  const provider = useProvider()
  const refetch = useRefetch()
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
        hash: tx.hash,
        type: 'info',
      })
    },
    [addToast, messageService, setTxList, txService]
  )

  const resolveTx = useCallback(
    (transaction: Transaction) => {
      const tx = txService!.resolve(transaction)
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
        hash: tx.hash,
        type: 'success',
      })
    },
    [addToast, setTxList, txService]
  )

  const rejectTx = useCallback(
    (hash: string, error: any) => {
      const tx = txService!.reject(hash, error)
      if (!tx) return

      addToast({
        title: tx.toast.title,
        message: tx.toast.messages.error,
        hash: tx.hash,
        type: 'error',
      })
    },
    [addToast, txService]
  )

  const pingPendingTx = useCallback(
    async (transaction: Transaction) => {
      if (!txService || !transaction.hash) return

      try {
        await txService.getTxReceipt(transaction.hash)
        resolveTx(transaction)
      } catch (error: any) {
        rejectTx(transaction.hash, error)
      }

      refetch()
    },
    [refetch, rejectTx, resolveTx, txService]
  )

  const resetTx = useCallback(() => {
    store.remove(STORAGE_KEYS.Transactions)
    resetTxList()
  }, [resetTxList])

  return {
    pingPendingTx,
    resetTx,
    subscribeTx,
    txService,
  }
}
