import { useCallback, useMemo } from 'react'
import { useResetRecoilState, useSetRecoilState } from 'recoil'
import store from 'store'

import { txMapState } from 'app/states/transaction'
import { TransactionService, TxAction } from 'services/transaction'
import STORAGE_KEYS from 'constants/storageKeys'
import { parseTxError } from 'utils/error'
import { txInfoMessage, txToastTitle } from 'utils/transaction'
import { useProvider } from './useProvider'
import { useToast } from './useToast'

export function useTx() {
  const provider = useProvider()
  const { addTxToast } = useToast()

  const setTxMap = useSetRecoilState(txMapState)
  const resetTxMap = useResetRecoilState(txMapState)

  const txService = useMemo(() => {
    if (!provider) return null
    return new TransactionService(provider, setTxMap)
  }, [provider, setTxMap])

  const registerTx = useCallback(
    (hash: string, action: TxAction) => {
      if (!txService) return

      txService.registerTx(hash, action)
      addTxToast({
        action,
        hash,
        title: txToastTitle(action),
        message: txInfoMessage(action),
        type: 'info',
      })
    },
    [addTxToast, txService]
  )

  const fulfillTx = useCallback(
    (hash: string, action: TxAction, callback?: () => void) => {
      if (!txService) return
      const tx = txService.fulfillTx(hash, action)
      if (!tx) return

      addTxToast({
        action,
        hash,
        title: txToastTitle(action),
        message: txInfoMessage(action),
        type: 'success',
      })
      callback?.()
    },
    [addTxToast, txService]
  )

  const resolvePendingTx = useCallback(
    async (hash: string) => {
      if (!txService) return

      try {
        await txService.getTxReceipt(hash)
      } catch (error: any) {
        const tx = txService.rejectTx(hash, error)
        if (!tx) return

        console.log(11, error.transaction, error.reason, Object.keys(error))

        addTxToast({
          action: tx.action,
          hash: tx.hash,
          title: txToastTitle(tx.action),
          message: parseTxError(error)!.message,
          type: 'error',
        })
      }
    },
    [addTxToast, txService]
  )

  const resetTx = useCallback(() => {
    store.remove(STORAGE_KEYS.Transactions)
    resetTxMap()
  }, [resetTxMap])

  return {
    fulfillTx,
    registerTx,
    resetTx,
    resolvePendingTx,
    txService,
  }
}
