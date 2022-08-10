import { memo, useCallback, useEffect } from 'react'
import { Event } from 'ethers'

import { removeTx, TransactionAction } from 'app/states/transaction'

import {
  useAppDispatch,
  useConfirmations,
  useEventFilter,
  useFetchPool,
  useProvider,
  useReward,
  useStake,
  useToast,
  useTransaction,
  useUnstake,
  useUserBalances,
} from 'hooks'

function UnstakeEffects() {
  const { getConfirmations, setConfirmations } = useConfirmations()
  const { cooldownEventFilter, withdrawnEventFilter } = useEventFilter()
  const { fetchPool } = useFetchPool()
  const provider = useProvider()
  const { earnedBal, earnedWncg } = useReward()
  const { stakedTokenBalance, totalStaked } = useStake()
  const { addToast } = useToast()
  const { getTransactionReceipt } = useTransaction()
  const { getTimestamps, unstakeWindow } = useUnstake()
  const { fetchBptBalance } = useUserBalances()

  const dispatch = useAppDispatch()

  useEffect(() => {
    getTimestamps()
  }, [getTimestamps])

  useEffect(() => {
    unstakeWindow()
  }, [unstakeWindow])

  const handleCooldownEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const confirmations = getConfirmations(transactionHash)
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.StartCooldown,
          hash: transactionHash,
          summary: 'Successfully started cooldown',
          showPartyEmoji: true,
        })
      }
      setConfirmations(transactionHash)

      getTimestamps()
    },
    [
      addToast,
      dispatch,
      getConfirmations,
      getTimestamps,
      getTransactionReceipt,
      setConfirmations,
    ]
  )

  const handleWithdrawnEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const confirmations = getConfirmations(transactionHash)
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.Withdraw,
          hash: transactionHash,
          summary: 'Successfully withdrew staked 20WETH-80WNCG',
          showPartyEmoji: true,
        })
      }
      setConfirmations(transactionHash)
      stakedTokenBalance()
      fetchBptBalance()
      fetchPool()
      totalStaked()
    },
    [
      addToast,
      dispatch,
      fetchBptBalance,
      getConfirmations,
      getTransactionReceipt,
      fetchPool,
      setConfirmations,
      stakedTokenBalance,
      totalStaked,
    ]
  )

  const handleWithdrawnAndAllRewardsEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const confirmations = getConfirmations(
        `${transactionHash}_withdrawAndClaim`
      )
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.Withdraw,
          hash: transactionHash,
          summary: 'Successfully withdrew and claimed',
          showPartyEmoji: true,
        })
      }
      setConfirmations(`${transactionHash}_withdrawAndClaim`)
      earnedBal()
      earnedWncg()
      fetchBptBalance()
      stakedTokenBalance()
      fetchPool()
      totalStaked()
    },
    [
      addToast,
      dispatch,
      earnedBal,
      earnedWncg,
      fetchBptBalance,
      getConfirmations,
      getTransactionReceipt,
      fetchPool,
      setConfirmations,
      stakedTokenBalance,
      totalStaked,
    ]
  )

  // NOTE: Cooldown event
  useEffect(() => {
    if (cooldownEventFilter) {
      provider?.on(cooldownEventFilter, handleCooldownEvent)
      return () => {
        provider?.off(cooldownEventFilter)
      }
    }
  }, [cooldownEventFilter, handleCooldownEvent, provider])

  // NOTE: Withdrawn event
  useEffect(() => {
    if (withdrawnEventFilter) {
      provider?.on(withdrawnEventFilter, handleWithdrawnEvent)
      provider?.on(withdrawnEventFilter, handleWithdrawnAndAllRewardsEvent)
      return () => {
        provider?.off(withdrawnEventFilter)
      }
    }
  }, [
    handleWithdrawnAndAllRewardsEvent,
    handleWithdrawnEvent,
    provider,
    withdrawnEventFilter,
  ])

  return null
}

export default memo(UnstakeEffects)
