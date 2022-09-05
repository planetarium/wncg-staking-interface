import { useMemo } from 'react'
import { useSetRecoilState } from 'recoil'

import { txMapState } from 'app/states/transaction'
import { TransactionService } from 'services/transaction'
import { useProvider } from './useProvider'
import { useToast } from './useToast'

export function useTx() {
  const provider = useProvider()
  const { addTxToast } = useToast()

  const setTxMap = useSetRecoilState(txMapState)

  const txService = useMemo(() => {
    if (!provider) return null
    return new TransactionService(provider, setTxMap, addTxToast)
  }, [provider, addTxToast, setTxMap])

  return {
    txService,
    registerTx: txService?.registerTx,
    handleTx: txService?.handleTx,
  }
}
