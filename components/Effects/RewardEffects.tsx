import { memo, useCallback, useEffect } from 'react'
import { Event } from 'ethers'

import { removeTx, TransactionAction } from 'app/states/transaction'
import {
  useAppDispatch,
  useConfirmations,
  useEventFilter,
  useProvider,
  useReward,
  useToast,
  useTransaction,
} from 'hooks'

function RewardEffects() {
  const { getConfirmations, setConfirmations } = useConfirmations()
  const {
    earmarkEventFilter,
    rewardsAllEventFilter,
    rewardsBalEventFilter,
    rewardsWncgEventFilter,
  } = useEventFilter()
  const provider = useProvider()
  const { earmarkIncentive, earnedBal, earnedWncg } = useReward()
  const { addToast } = useToast()
  const { getTransactionReceipt } = useTransaction()
  const dispatch = useAppDispatch()

  useEffect(() => {
    earnedBal()
  }, [earnedBal])

  useEffect(() => {
    earnedWncg()
  }, [earnedWncg])

  const handleAllRewardEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const key = `${transactionHash}_claimAll`
      const confirmations = getConfirmations(key)
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.ClaimAllRewards,
          hash: transactionHash,
          summary: 'Successfully claimed WNCG & BAL rewards',
          showPartyEmoji: true,
        })
      }
      setConfirmations(key)

      earnedBal()
      earnedWncg()
    },
    [
      addToast,
      dispatch,
      earnedBal,
      earnedWncg,
      getConfirmations,
      getTransactionReceipt,
      setConfirmations,
    ]
  )

  const handleBalRewardEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const confirmations = getConfirmations(transactionHash)
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.ClaimBalRewards,
          hash: transactionHash,
          summary: 'Successfully claimed BAL reward',
          showPartyEmoji: true,
        })
      }
      setConfirmations(transactionHash)

      earnedBal()
    },
    [
      addToast,
      dispatch,
      earnedBal,
      getConfirmations,
      getTransactionReceipt,
      setConfirmations,
    ]
  )

  const handleWncgRewardEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const confirmations = getConfirmations(transactionHash)
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.ClaimWncgRewards,
          hash: transactionHash,
          summary: 'Successfully claimed WNCG reward',
          showPartyEmoji: true,
        })
      }
      setConfirmations(transactionHash)

      earnedWncg()
    },
    [
      addToast,
      dispatch,
      earnedWncg,
      getConfirmations,
      getTransactionReceipt,
      setConfirmations,
    ]
  )

  const handleEarmarkRewardsEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const confirmations = getConfirmations(transactionHash)
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.EarmarkRewards,
          hash: transactionHash,
          summary: 'Successfully harvested BAL reward',
          showPartyEmoji: true,
        })
      }
      setConfirmations(transactionHash)
      earmarkIncentive()
      earnedBal()
    },
    [
      addToast,
      dispatch,
      earmarkIncentive,
      earnedBal,
      getConfirmations,
      getTransactionReceipt,
      setConfirmations,
    ]
  )

  // NOTE: Reward All event
  useEffect(() => {
    if (rewardsAllEventFilter) {
      provider?.on(rewardsAllEventFilter, handleAllRewardEvent)
      return () => {
        provider?.off(rewardsAllEventFilter)
      }
    }
  }, [handleAllRewardEvent, provider, rewardsAllEventFilter])

  // NOTE: Reward BAL event
  useEffect(() => {
    if (rewardsBalEventFilter) {
      provider?.on(rewardsBalEventFilter, handleBalRewardEvent)
      return () => {
        provider?.off(rewardsBalEventFilter)
      }
    }
  }, [handleBalRewardEvent, provider, rewardsBalEventFilter])

  // NOTE: Reward WNCG event
  useEffect(() => {
    if (rewardsWncgEventFilter) {
      provider?.on(rewardsWncgEventFilter, handleWncgRewardEvent)
      return () => {
        provider?.off(rewardsWncgEventFilter)
      }
    }
  }, [handleWncgRewardEvent, provider, rewardsWncgEventFilter])

  // NOTE: Earmark rewards event
  useEffect(() => {
    if (earmarkEventFilter) {
      provider?.on(earmarkEventFilter, handleEarmarkRewardsEvent)
      return () => {
        provider?.off(earmarkEventFilter)
      }
    }
  }, [provider, handleEarmarkRewardsEvent, earmarkEventFilter])

  return null
}

export default memo(RewardEffects)
