import { useEffect, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { toast } from 'react-toastify'

import { isDesktopState } from 'app/states/mediaQuery'
import { toastIdListState } from 'app/states/toast'
import {
  MAX_TOAST_LENGTH_DESKTOP,
  MAX_TOAST_LENGTH_MOBILE,
} from 'constants/toast'

export function ToastEffects() {
  const [toastIdList, setToastIdList] = useRecoilState(toastIdListState)
  const isDesktop = useRecoilValue(isDesktopState)

  const maxToasts = useMemo(
    () => (isDesktop ? MAX_TOAST_LENGTH_DESKTOP : MAX_TOAST_LENGTH_MOBILE),
    [isDesktop]
  )

  useEffect(() => {
    if (toastIdList.length === maxToasts) {
      const newToastIdList = [...toastIdList]
      const toastToRemove = newToastIdList.shift()

      toast.dismiss(toastToRemove)
      setToastIdList(newToastIdList)
    }
  }, [maxToasts, setToastIdList, toastIdList])

  return null
}
