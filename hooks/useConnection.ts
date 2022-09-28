import { useCallback } from 'react'
import store from 'store'

import { ModalCategory } from 'app/states/modal'
import STORAGE_KEYS from 'constants/storageKeys'
import { gaEvent } from 'lib/gtag'
import { convertChainIdToHex, networkChainId } from 'utils/network'
import { parseTxError } from 'utils/tx'
import { useModal } from './useModal'
import { useProvider } from './useProvider'
import { useSettings } from './useSettings'
import { useToast } from './useToast'
import { useTx } from './useTx'

export function useConnection() {
  const { addModal } = useModal()
  const provider = useProvider()
  const { resetSettings } = useSettings()
  const { addToast } = useToast()
  const { resetTx } = useTx()

  // const [account, setAccount] = useRecoilState(accountState)
  // const [connectionStatus, setConnectionStatus] = useRecoilState(
  //   connectionStatusState
  // )

  // const resetAccount = useResetRecoilState(accountState)
  // const resetConnectionStatus = useResetRecoilState(connectionStatusState)

  const reset = useCallback(() => {
    // resetAccount()
    // resetConnectionStatus()
    resetSettings()
    resetTx?.()
    store.remove(STORAGE_KEYS.Account)
  }, [resetSettings, resetTx])

  const updateAccount = useCallback((account: string) => {
    // setAccount(account)
    // setConnectionStatus(ConnectionStatus.Connected)
  }, [])

  const initConnect = useCallback(async () => {
    if (!provider) return

    try {
      // setConnectionStatus(ConnectionStatus.Connecting)
      const accounts = await provider.send('eth_requestAccounts', [])

      if (accounts && accounts[0]) {
        updateAccount(accounts[0])
        gaEvent({
          name: 'connect_metamask',
          params: {
            account: accounts[0],
          },
        })
      }
    } catch (error) {
      reset()
      const errorMsg = parseTxError(error)
      if (errorMsg) {
        addToast({
          ...errorMsg,
          type: 'error',
        })
      }
    }
  }, [addToast, provider, reset, updateAccount])

  const connect = useCallback(() => {
    if (!provider) {
      addModal({
        category: ModalCategory.MetaMaskGuide,
      })
      return
    }

    addModal({
      category: ModalCategory.Connect,
    })

    // initConnect()
  }, [addModal, provider])

  const disconnect = useCallback(() => {
    reset()
    // gaEvent({
    //   name: 'disconnect_metamask',
    //   params: {
    //     account,
    //   },
    // })
  }, [reset])

  const switchNetwork = useCallback(() => {
    if (!provider) return

    // gaEvent({
    //   name: 'switch_network',
    //   params: {
    //     oldNetwork: window?.ethereum?.chainId,
    //   },
    // })

    window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: convertChainIdToHex(networkChainId) }],
    })
  }, [provider])

  return {
    connect,
    disconnect,
    switchNetwork,
    updateAccount,
  }
}
