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

  async function getTransactionDetail(hash: string) {
    return await provider?.getTransaction(hash)
  }

  async function getTransactionReceipt(hash: string) {
    const txInfo = await getTransactionDetail(hash)
    return await txInfo?.wait()
  }

  return {
    getTransactionDetail,
    getTransactionReceipt,
    transactionService,
  }
}
