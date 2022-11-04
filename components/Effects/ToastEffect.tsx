import { memo, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useAtom, useAtomValue } from 'jotai'

import { isDesktopAtom, toastIdsAtom } from 'states/ui'
import {
  MAX_TOAST_LENGTH_DESKTOP,
  MAX_TOAST_LENGTH_MOBILE,
} from 'constants/toast'

function ToastEffects() {
  const [toastIdList, setToastIdList] = useAtom(toastIdsAtom)
  const isDesktop = useAtomValue(isDesktopAtom)

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

export default memo(ToastEffects)
