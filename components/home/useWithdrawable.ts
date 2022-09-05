import { useEffect, useState } from 'react'
import { useMount, usePrevious } from 'react-use'
import { isPast } from 'date-fns'
import store from 'store'

import STORAGE_KEYS from 'constants/storageKeys'
import { useUnstakeTimestamps } from 'hooks'
import { UnstakeStatus } from 'hooks/useUnstakeTimestamps'

export function useWithdrawable() {
  const { unstakeStatus } = useUnstakeTimestamps()
  const prevUnstakeStatus = usePrevious(unstakeStatus)

  const [isWithdrawable, setIsWithdrawable] = useState(false)

  useEffect(() => {
    if (unstakeStatus === UnstakeStatus.Withdrawable) {
      setIsWithdrawable(true)
    }
  }, [unstakeStatus])

  // NOTE: Only update state when status changes from Withdrawable -> anything else
  useEffect(() => {
    if (prevUnstakeStatus !== UnstakeStatus.Withdrawable) return
    if (prevUnstakeStatus !== unstakeStatus) {
      setIsWithdrawable(false)
    }
  }, [prevUnstakeStatus, unstakeStatus])

  useMount(() => {
    const cooldownEndsAt = store.get(STORAGE_KEYS.Unstake.CooldownEndsAt) || 0
    const withdrawEndsAt = store.get(STORAGE_KEYS.Unstake.WithdrawEndsAt) || 0

    if (isPast(cooldownEndsAt) && !isPast(withdrawEndsAt)) {
      setIsWithdrawable(true)
    }
  })

  return {
    isWithdrawable,
  }
}
