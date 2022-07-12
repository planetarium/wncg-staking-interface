import { useEffect, useState } from 'react'
import store from 'store'

import {
  getUnstakeStatus,
  STORE_COOLDOWN_ENDS_AT_KEY,
  STORE_WITHDRAW_ENDS_AT_KEY,
} from 'app/states/unstake'
import { useAppSelector } from 'hooks'

export function useWithdrawable() {
  const status = useAppSelector(getUnstakeStatus)
  const [isWithdrawable, setIsWithdrawable] = useState(false)

  const cooldownEndsAt = store.get(STORE_COOLDOWN_ENDS_AT_KEY) || 0
  const withdrawEndsAt = store.get(STORE_WITHDRAW_ENDS_AT_KEY) || 0

  useEffect(() => {
    const now = Date.now()
    if (now > cooldownEndsAt && now < withdrawEndsAt) {
      setIsWithdrawable(true)
    } else {
      setIsWithdrawable(false)
    }
  }, [cooldownEndsAt, status, withdrawEndsAt])

  return {
    isWithdrawable,
  }
}
