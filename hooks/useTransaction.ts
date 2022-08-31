import { useMemo } from 'react'

import { TransactionService } from 'services/transaction'
import { useProvider } from './useProvider'
import { useToast } from './useToast'

export function useTransaction() {
  const provider = useProvider()
  const { addTxToast } = useToast()

  const eventLogService = useMemo(() => {
    if (!provider) return null
    return new TransactionService(provider, addTxToast)
  }, [provider, addTxToast])

  return {
    eventLogService,
    registerTx: eventLogService?.registerTx,
    handleTx: eventLogService?.handleTx,
  }
}
