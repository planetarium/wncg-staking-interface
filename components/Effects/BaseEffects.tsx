import { memo } from 'react'
import { useMount, useUnmount } from 'react-use'
import { useSetRecoilState } from 'recoil'
import type { Network } from '@ethersproject/networks'
import store from 'store'

import { currentNetworkIdState } from 'app/states/network'
import { useConnection, useProvider, useTransaction } from 'hooks'
import { STORE_ACCOUNT_KEY } from 'constants/storeKeys'

function BaseEffects() {
  const { disconnect, updateAccount } = useConnection()
  const provider = useProvider()
  const { transactionService } = useTransaction()

  const setCurrentNetworkId = useSetRecoilState(currentNetworkIdState)

  function handleAccountsChanged(...args: unknown[]) {
    console.log('handleAccountsChanged')

    transactionService?.resetTx()
    // resetConfirmations()
    // resetTxList
    const accounts = args[0] as string[]

    // NOTE: Disconnected
    if (accounts.length === 0) {
      disconnect()
      return
    }

    if (accounts[0]) {
      updateAccount(accounts[0])
    }
  }

  function handleChainChanged() {
    window?.location.reload()
  }

  function handleNetworkChange(network: Network) {
    if (network) {
      setCurrentNetworkId(network.chainId)
    }
  }

  useMount(() => {
    const connectedAccount = store.get(STORE_ACCOUNT_KEY)
    if (connectedAccount) {
      updateAccount(connectedAccount)
    }
  })

  useMount(() => {
    provider?.on('network', handleNetworkChange)
    window?.ethereum?.on('accountsChanged', handleAccountsChanged)
    window?.ethereum?.on('chainChanged', handleChainChanged)
    transactionService?.flushOutdatedTx()
  })

  useUnmount(() => {
    provider?.off('network', handleNetworkChange)
    window?.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
    window?.ethereum?.removeListener('chainChanged', handleChainChanged)
  })

  return null
}

export default memo(BaseEffects)
