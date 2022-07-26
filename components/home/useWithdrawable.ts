import { useEffect, useState } from 'react'
import { useMount, usePrevious } from 'react-use'
import store from 'store'

import {
  getUnstakeStatus,
  STORE_COOLDOWN_ENDS_AT,
  STORE_WITHDRAW_ENDS_AT,
  UnstakeStatus,
} from 'app/states/unstake'
import { useAppSelector } from 'hooks'

export function useWithdrawable() {
  const status = useAppSelector(getUnstakeStatus)
  const prevStatus = usePrevious(status)

  const [isWithdrawable, setIsWithdrawable] = useState(false)

  useEffect(() => {
    if (status === UnstakeStatus.Withdrawable) {
      setIsWithdrawable(true)
    }
  }, [status])

  // NOTE: Only update state when status changes from Withdrawable -> anything else
  useEffect(() => {
    if (prevStatus !== UnstakeStatus.Withdrawable) return
    if (prevStatus !== status) {
      setIsWithdrawable(false)
    }
  }, [prevStatus, status])

  useMount(() => {
    const now = Date.now()
    const cooldownEndsAt = store.get(STORE_COOLDOWN_ENDS_AT) || 0
    const withdrawEndsAt = store.get(STORE_WITHDRAW_ENDS_AT) || 0

    if (cooldownEndsAt < now && withdrawEndsAt > now) {
      setIsWithdrawable(true)
    }
  })

  return {
    isWithdrawable,
  }
}
