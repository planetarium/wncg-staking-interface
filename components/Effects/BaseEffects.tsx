import { useCallback, useEffect } from 'react'
import { useMount, useUnmount } from 'react-use'
import { Event } from 'ethers'
import type { Network } from '@ethersproject/networks'
import store from 'store'

import { setIsApproved } from 'app/states/bpt'
import {
  removeTx,
  resetTxList,
  TransactionAction,
} from 'app/states/transaction'
import {
  useAppDispatch,
  useConfirmations,
  useConnection,
  useEventFilter,
  usePolling,
  useProvider,
  useToast,
  useTransaction,
} from 'hooks'

export function BaseEffects() {
  const {
    flushOutdatedConfirmations,
    getConfirmations,
    setConfirmations,
    resetConfirmations,
  } = useConfirmations()
  const { approvalEventFilter } = useEventFilter()
  const { disconnect, updateAccount, updateChainId } = useConnection()
  const provider = useProvider()
  const { addToast } = useToast()
  const { getTransactionReceipt } = useTransaction()

  usePolling()

  const dispatch = useAppDispatch()

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
      updateChainId(network.chainId)
    }
  }

  const handleApprovalEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))
      dispatch(setIsApproved(true))

      const confirmations = getConfirmations(transactionHash)
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.Approve,
          hash: transactionHash,
          summary: 'Successfully approved 20WETH-80WNCG',
          showPartyEmoji: true,
        })
      }
      setConfirmations(transactionHash)
    },
    [
      addToast,
      dispatch,
      getConfirmations,
      getTransactionReceipt,
      setConfirmations,
    ]
  )

  useEffect(() => {
    if (approvalEventFilter) {
      provider?.on(approvalEventFilter, handleApprovalEvent)
      return () => {
        provider?.off(approvalEventFilter)
      }
    }
  }, [approvalEventFilter, handleApprovalEvent, provider])

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
