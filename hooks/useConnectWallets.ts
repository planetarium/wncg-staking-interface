import { useCallback } from 'react'
import { useDisconnect } from 'wagmi'

import { ModalCategory } from 'app/states/modal'
import { useModal } from './useModal'
import { useSettings } from './useSettings'
import { useTx } from './useTx'

export function useConnectWallets() {
  const { addModal } = useModal()
  const { resetSettings } = useSettings()
  const { resetTx } = useTx()

  const { disconnect } = useDisconnect({
    onSuccess() {
      resetSettings()
      resetTx?.()
    },
  })

  const connect = useCallback(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      addModal({
        category: ModalCategory.MetaMaskGuide,
      })
      return
    }

    addModal({
      category: ModalCategory.Connect,
    })
  }, [addModal])

  return {
    connect,
    disconnect,
  }
}
