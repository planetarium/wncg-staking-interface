import { memo, useCallback, useEffect } from 'react'
import type { Event } from 'ethers'

import { removeTx, TransactionAction } from 'app/states/transaction'
import {
  useAppDispatch,
  useConfirmations,
  useEventFilter,
  useProvider,
  useToast,
  useTransaction,
} from 'hooks'

function PoolEffects() {
  const { getConfirmations, getHashData, setConfirmations } = useConfirmations()
  const { poolBalanceChangedEventFilter } = useEventFilter()
  const provider = useProvider()
  const { addToast } = useToast()
  const { getTransactionReceipt } = useTransaction()

  const dispatch = useAppDispatch()

  const handlePoolBalanceChangedEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const confirmations = getConfirmations(transactionHash)
      if (!confirmations) return

      if (confirmations !== 'fulfilled') {
        const { action } = getHashData(transactionHash) || {}
        addToast({
          action,
          hash: transactionHash,
          summary: `Successfully ${
            action === TransactionAction.JoinPool ? 'joined' : 'exited'
          } pool`,
          showPartyEmoji: true,
        })
      }

      setConfirmations(transactionHash)
    },
    [
      addToast,
      dispatch,
      getConfirmations,
      getHashData,
      getTransactionReceipt,
      setConfirmations,
    ]
  )

  // NOTE: Pool balance changed event (Join / Exit)
  useEffect(() => {
    if (poolBalanceChangedEventFilter) {
      provider?.on(poolBalanceChangedEventFilter, handlePoolBalanceChangedEvent)
      return () => {
        provider?.off(poolBalanceChangedEventFilter)
      }
    }
  })
  return null
}

export default memo(PoolEffects)
