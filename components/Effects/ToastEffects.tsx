import { useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'

import { getIsDesktop } from 'app/states/mediaQuery'
import { getToasts, removeToast } from 'app/states/toast'
import { useAppDispatch, useAppSelector } from 'hooks'

export function ToastEffects() {
  const dispatch = useAppDispatch()
  const toasts = useAppSelector(getToasts)
  const isDesktop = useAppSelector(getIsDesktop)

  const maxToasts = useMemo(() => (isDesktop ? 6 : 4), [isDesktop])

  useEffect(() => {
    if (toasts.length === maxToasts) {
      const toastToRemove = toasts[0]
      toast.dismiss(toastToRemove)
      dispatch(removeToast(toastToRemove))
    }
  }, [dispatch, maxToasts, toasts])

  return null
}
