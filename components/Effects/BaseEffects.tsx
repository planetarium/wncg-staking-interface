import { memo } from 'react'
import { useMount, useUnmount } from 'react-use'
import { useSetRecoilState } from 'recoil'
import type { Network } from '@ethersproject/networks'
import store from 'store'

import { currentNetworkIdState } from 'app/states/network'
import { resetTxList } from 'app/states/transaction'
import {
  useAppDispatch,
  useConfirmations,
  useConnection,
  usePolling,
  useProvider,
} from 'hooks'

function BaseEffects() {
  const { flushOutdatedConfirmations, resetConfirmations } = useConfirmations()
  const { disconnect, updateAccount } = useConnection()
  const provider = useProvider()

  usePolling()

  const dispatch = useAppDispatch()
  const setCurrentNetworkId = useSetRecoilState(currentNetworkIdState)

  function handleAccountsChanged(...args: unknown[]) {
    dispatch(resetTxList())
    resetConfirmations()
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
    const connectedAccount = store.get('wncgStaking.account')
    if (connectedAccount) {
      updateAccount(connectedAccount)
    }
  })

  useMount(() => {
    provider?.on('network', handleNetworkChange)
    window?.ethereum?.on('accountsChanged', handleAccountsChanged)
    window?.ethereum?.on('chainChanged', handleChainChanged)
    flushOutdatedConfirmations()
  })

  useUnmount(() => {
    provider?.off('network', handleNetworkChange)
    window?.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
    window?.ethereum?.removeListener('chainChanged', handleChainChanged)
  })

  return null
}

export default memo(BaseEffects)
