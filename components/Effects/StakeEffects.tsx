import { useCallback, useEffect } from 'react'
import { Event } from 'ethers'

import { removeTx, TransactionAction } from 'app/states/transaction'
import {
  useAppDispatch,
  useConfirmations,
  useEventFilter,
  useFetchPool,
  useProvider,
  useStake,
  useToast,
  useTransaction,
  useUnstake,
  useUserBalances,
} from 'hooks'

export function StakeEffects() {
  const { getConfirmations, setConfirmations } = useConfirmations()
  const { stakedEventFilter } = useEventFilter()
  const { fetchPool } = useFetchPool()
  const provider = useProvider()
  const { stakedTokenBalance, totalStaked } = useStake()
  const { addToast } = useToast()
  const { getTransactionReceipt } = useTransaction()
  const { getTimestamps } = useUnstake()
  const { fetchBptBalance } = useUserBalances()

  const dispatch = useAppDispatch()

  useEffect(() => {
    stakedTokenBalance()
  }, [stakedTokenBalance])

  const handleStakedEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const confirmations = getConfirmations(transactionHash)
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.Stake,
          hash: transactionHash,
          summary: 'Successfully staked 20WETH-80WNCG',
          showPartyEmoji: true,
        })
      }
      setConfirmations(transactionHash)

      stakedTokenBalance()
      fetchBptBalance()
      fetchPool()
      totalStaked()
      getTimestamps()
    },
    [
      addToast,
      dispatch,
      fetchBptBalance,
      getConfirmations,
      getTimestamps,
      getTransactionReceipt,
      fetchPool,
      setConfirmations,
      stakedTokenBalance,
      totalStaked,
    ]
  )

  // NOTE: Staked event
  useEffect(() => {
    if (stakedEventFilter) {
      provider?.on(stakedEventFilter, handleStakedEvent)
      return () => {
        provider?.off(stakedEventFilter)
      }
    }
  }, [handleStakedEvent, provider, stakedEventFilter])

  return null
}
