import { useMemo } from 'react'

import { TransactionService } from 'services/transaction'
import { useProvider } from './useProvider'
import { useToast } from './useToast'

export function useTx() {
  const provider = useProvider()
  const { addTxToast } = useToast()

  const txService = useMemo(() => {
    if (!provider) return null
    return new TransactionService(provider, addTxToast)
  }, [provider, addTxToast])

  return {
    txService,
    registerTx: txService?.registerTx,
    handleTx: txService?.handleTx,
  }
}
