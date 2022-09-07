import { useMemo } from 'react'
import {
  ToastContainer as ReactToastContainer,
  ToastContainerProps,
} from 'react-toastify'
import { useRecoilValue } from 'recoil'

import { isDesktopState } from 'app/states/mediaQuery'
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
  autoClose: false,
  closeButton: false,
  closeOnClick: true,
  draggable: true,
  limit: MAX_TOAST_LENGTH_DESKTOP,
  pauseOnHover: true,
}

export function ToastContainer() {
  const isDesktop = useRecoilValue(isDesktopState)

  const toastConfig = useMemo(() => {
    return isDesktop
      ? config
      : { ...config, limit: MAX_TOAST_LENGTH_MOBILE, autoClose: 5000 }
  }, [isDesktop])

  return <ReactToastContainer {...toastConfig} closeButton={ToastCloseButton} />
}
