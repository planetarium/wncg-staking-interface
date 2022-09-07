import { useCallback } from 'react'
import { useRecoilState, useResetRecoilState } from 'recoil'
import store from 'store'

import {
  accountState,
  ConnectionStatus,
  connectionStatusState,
} from 'app/states/connection'
import { ModalCategory } from 'app/states/modal'
import STORAGE_KEYS from 'constants/storageKeys'
import { gaEvent } from 'lib/gtag'
import { parseTxError } from 'utils/error'
import { convertChainIdToHex, networkChainId } from 'utils/network'
import { useModal } from './useModal'
import { useProvider } from './useProvider'
import { useSettings } from './useSettings'
import { useToast } from './useToast'
import { useTx } from './useTx'
import { useUnstakeTimestamps } from './useUnstakeTimestamps'

export function useConnection() {
  const { addModal } = useModal()
  const provider = useProvider()
  const { resetSettings } = useSettings()
  const { addErrorToast } = useToast()
  const { resetTx } = useTx()
  const { resetTimestamps } = useUnstakeTimestamps()

  const [account, setAccount] = useRecoilState(accountState)
  const [connectionStatus, setConnectionStatus] = useRecoilState(
    connectionStatusState
  )

  const resetAccount = useResetRecoilState(accountState)
  const resetConnectionStatus = useResetRecoilState(connectionStatusState)

  const reset = useCallback(() => {
    resetAccount()
    resetConnectionStatus()
    resetSettings()
    resetTimestamps()
    resetTx?.()
    store.remove(STORAGE_KEYS.Account)
  }, [
    resetAccount,
    resetConnectionStatus,
    resetSettings,
    resetTimestamps,
    resetTx,
  ])

  const updateAccount = useCallback(
    (account: string) => {
      setAccount(account)
      setConnectionStatus(ConnectionStatus.Connected)
      store.set(STORAGE_KEYS.Account, account)
    },
    [setAccount, setConnectionStatus]
  )

  const initConnect = useCallback(async () => {
    if (!provider) return

    try {
      setConnectionStatus(ConnectionStatus.Connecting)
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
        addErrorToast({
          ...errorMsg,
        })
      }
    }
  }, [addErrorToast, provider, reset, setConnectionStatus, updateAccount])

  const connect = useCallback(() => {
    if (!provider) {
      addModal({
        category: ModalCategory.MetaMaskGuide,
      })
      return
    }

    initConnect()
  }, [addModal, initConnect, provider])

  const disconnect = useCallback(() => {
    reset()
    gaEvent({
      name: 'disconnect_metamask',
      params: {
        account,
      },
    })
  }, [account, reset])

  const switchNetwork = useCallback(() => {
    if (!provider) return

    gaEvent({
      name: 'switch_network',
      params: {
        oldNetwork: window?.ethereum?.chainId,
      },
    })

    window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: convertChainIdToHex(networkChainId) }],
    })
  }, [provider])

  const isConnected = connectionStatus === ConnectionStatus.Connected

  return {
    connect,
    disconnect,
    switchNetwork,
    updateAccount,
    isConnected,
  }
}
