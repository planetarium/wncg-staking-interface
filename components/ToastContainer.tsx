import { useMemo } from 'react'
import {
  ToastContainer as ReactToastContainer,
  ToastContainerProps,
} from 'react-toastify'
import { useAtomValue } from 'jotai'

import { isDesktopAtom } from 'states/ui'
import {
  MAX_TOAST_LENGTH_DESKTOP,
  MAX_TOAST_LENGTH_MOBILE,
} from 'constants/toast'

import { ToastCloseButton } from 'components/Toast/CloseButton'

const config: ToastContainerProps = {
  className: 'toastContainer',
  toastClassName: 'toast',
  bodyClassName: 'toastBody',
  progressClassName: 'progressBar',
  hideProgressBar: true,
  autoClose: false,
  closeButton: false,
  closeOnClick: true,
  draggable: true,
  limit: MAX_TOAST_LENGTH_DESKTOP,
  pauseOnHover: true,
}

export function ToastContainer() {
  const isDesktop = useAtomValue(isDesktopAtom)

  const toastConfig = useMemo(() => {
    return isDesktop
      ? config
      : { ...config, limit: MAX_TOAST_LENGTH_MOBILE, autoClose: 5000 }
  }, [isDesktop])

  return <ReactToastContainer {...toastConfig} closeButton={ToastCloseButton} />
}
