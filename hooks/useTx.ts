import { useCallback } from 'react'

import { useProvider } from 'wagmi'

import store from 'store'

import STORAGE_KEYS from 'constants/storageKeys'

// import { useToast } from './useToast'

export function useTx() {
  const provider = useProvider()

  const resetTx = useCallback(() => {
    store.remove(STORAGE_KEYS.Transactions)
  }, [])

  return {
    resetTx,
  }
}
