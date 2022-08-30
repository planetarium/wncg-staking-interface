import { useMemo } from 'react'

import { TransactionService } from 'services/transaction'
import { useProvider } from './useProvider'
import { useToast } from './useToast'

export function useTransaction() {
  const provider = useProvider()
  const { sendToast } = useToast()

  const transactionService = useMemo(() => {
    if (!provider) return null
    return new TransactionService(provider, sendToast)
  }, [provider, sendToast])

  return {
    transactionService,
    registerTx: transactionService?.registerTx,
    updateTxStatus: transactionService?.updateTxStatus,
  }
}
