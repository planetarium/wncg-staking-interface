import { useEffect, useState } from 'react'
import { useMount, usePrevious } from 'react-use'
import store from 'store'

import { useUnstakeTimestamps } from 'hooks'
import { UnstakeStatus } from 'hooks/useUnstakeTimestamps'
import {
  STORE_COOLDOWN_ENDS_AT,
  STORE_WITHDRAW_ENDS_AT,
} from 'constants/storeKeys'
import { isPast } from 'date-fns'

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
    const cooldownEndsAt = store.get(STORE_COOLDOWN_ENDS_AT) || 0
    const withdrawEndsAt = store.get(STORE_WITHDRAW_ENDS_AT) || 0

    if (isPast(cooldownEndsAt) && !isPast(withdrawEndsAt)) {
      setIsWithdrawable(true)
    }
  })

  return {
    isWithdrawable,
  }
}
